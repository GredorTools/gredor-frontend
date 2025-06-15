<script lang="ts" setup>
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseEditBeloppradComparable from "@/components/edit/belopprad/BaseEditBeloppradComparable.vue";

defineProps<{
  taxonomyManager: TaxonomyManager;
  numPreviousYears: number;
  allowNot: boolean;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradDecimal>("belopprad", {
  required: true,
});
</script>

<template>
  <BaseEditBeloppradComparable
    :allow-not="allowNot"
    :belopprad="belopprad"
    :delete-callback="deleteCallback"
    :num-previous-years="numPreviousYears"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
