<script lang="ts" setup>
/**
 * En komponent som visar rubriken för en belopprad med tooltip.
 * Hanterar olika stilar baserat på beloppradens nivå och typ.
 */

import { computed, onMounted, useTemplateRef } from "vue";
import { Tooltip } from "bootstrap";
import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { isPercentageTaxonomyItem } from "@/util/renderUtils.ts";

const props = defineProps<{
  /** TaxonomyManager för att hämta information om beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Möjliggör att få beloppraden att se ut som en belopprad av en viss nivå,
   * även om den egentligen inte är en belopprad av den nivån. */
  displayAsLevel?: number;
}>();

/** Beloppraden vars rubrik ska visas. */
const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});

const displayLevel = computed(
  () => props.displayAsLevel ?? taxonomyItem.value.level,
);

const titleSpan = useTemplateRef("title-span");
onMounted(() => {
  const element = titleSpan.value;
  if (element) {
    new Tooltip(element);
  }
});
</script>

<template>
  <div
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      'string-item': taxonomyItem.properties.type === 'xbrli:stringItemType',
      summa:
        taxonomyItem.additionalData.labelType === 'totalLabel' ||
        taxonomyItem.additionalData.isCalculatedItem,
      [`level-${displayLevel}`]: true,
    }"
    class="title-root"
  >
    {{ taxonomyItem.additionalData.displayLabel }}
    <span v-if="isPercentageTaxonomyItem(taxonomyItem)" class="unit-indicator"
      >[%]</span
    >
    <span
      v-if="!!taxonomyItem.properties.documentation"
      ref="title-span"
      :data-bs-title="taxonomyItem.properties.documentation"
      class="info-icon"
      data-bs-placement="bottom"
      data-bs-toggle="tooltip"
    >
      <span class="info-circle">i</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.title-root {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-xs;
}

.abstract.level-1,
.string-item.level-1 {
  font-weight: 600;
  font-size: $font-size-lg;
  color: $dark;
}

.abstract.level-2 {
  font-weight: 600;
  text-decoration: underline;
  color: mix($dark, $medium, 80%);
}

.abstract.level-3 {
  font-weight: 500;
  color: mix($dark, $medium, 60%);
}

.abstract.level-4 {
  font-weight: 400;
  text-decoration: underline;
  color: $medium;
}

.summa.level-1 {
  font-weight: 600;
  font-style: italic;
  color: $dark;
}

.summa.level-2 {
  font-weight: 600;
  color: $dark;
}

.summa.level-3 {
  font-weight: 500;
  color: mix($dark, $medium, 80%);
}

.unit-indicator {
  font-size: $font-size-sm;
  color: $medium;
  margin-left: $spacing-xs;
}

.info-icon {
  font-style: normal;
  display: inline-flex;
  align-items: center;
  margin-left: $spacing-xs;

  &:hover {
    cursor: help;
  }

  .info-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: $info-color;
    color: white;
    font-size: 10px;
    font-weight: bold;
    line-height: 1;

    &:hover {
      background-color: darken($info-color, 15%);
    }
  }
}
</style>
