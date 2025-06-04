<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";
import { Tooltip } from "bootstrap";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  getDisplayNameForTaxonomyItem,
  type TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";

const belopprad = defineModel<Belopprad<TaxonomyItemType>>("belopprad", {
  required: true,
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
      'gredor-tooltip-target': !!belopprad.taxonomyItem.dokumentation,
    }"
    :data-bs-title="belopprad.taxonomyItem.dokumentation"
    data-bs-placement="bottom"
    data-bs-toggle="tooltip"
    >{{ getDisplayNameForTaxonomyItem(belopprad.taxonomyItem) }}</span
  >
</template>

<style lang="scss" scoped></style>
