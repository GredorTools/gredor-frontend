<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from "vue";
import { Tooltip } from "bootstrap";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
}>();

const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(belopprad.value.taxonomyItemName);
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
    ref="title-span"
    :class="{
      'gredor-tooltip-target': !!taxonomyItem.properties.documentation,
      abstract: taxonomyItem.properties.abstract === 'true',
      [`level-${taxonomyItem.level}`]: true,
    }"
    :data-bs-title="taxonomyItem.properties.documentation"
    data-bs-placement="bottom"
    data-bs-toggle="tooltip"
    >{{ taxonomyItem.additionalData.displayLabel }}</span
  >
</template>

<style lang="scss" scoped>
.abstract.level-1 {
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

.gredor-tooltip-target {
  border-bottom: 1px dotted black;
}
</style>
