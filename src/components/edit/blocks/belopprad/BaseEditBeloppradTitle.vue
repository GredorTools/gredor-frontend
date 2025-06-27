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
}>();

/** Beloppraden vars rubrik ska visas. */
const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});

const titleSpan = useTemplateRef("title-span");
onMounted(() => {
  const element = titleSpan.value;
  if (element) {
    new Tooltip(element);
  }
});
</script>

<template>
  <span
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      'string-item': taxonomyItem.properties.type === 'xbrli:stringItemType',
      summa:
        taxonomyItem.additionalData.labelType === 'totalLabel' ||
        taxonomyItem.additionalData.isCalculatedItem,
      [`level-${taxonomyItem.level}`]: true,
    }"
    >{{ taxonomyItem.additionalData.displayLabel }}
    <span v-if="isPercentageTaxonomyItem(taxonomyItem)">[%]</span>
    <span
      v-if="!!taxonomyItem.properties.documentation"
      ref="title-span"
      :data-bs-title="taxonomyItem.properties.documentation"
      class="info-icon"
      data-bs-placement="bottom"
      data-bs-toggle="tooltip"
    >
      ℹ️
    </span>
  </span>
</template>

<style lang="scss" scoped>
.abstract.level-1,
.string-item.level-1 {
  font-weight: 600;
  font-size: 1.2rem;
}

.abstract.level-2 {
  font-weight: 600;
  text-decoration: underline;
}

.abstract.level-3 {
  font-weight: 500;
}

.abstract.level-4 {
  font-weight: 400;
  text-decoration: underline;
}

.summa.level-1 {
  font-weight: 600;
  font-style: italic;
}

.summa.level-2 {
  font-weight: 600;
}

.summa.level-3 {
  font-weight: 500;
}

.info-icon {
  font-style: normal;

  &:hover {
    cursor: help;
  }
}
</style>
