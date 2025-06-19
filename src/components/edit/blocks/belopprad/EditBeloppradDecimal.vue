<script lang="ts" setup>
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseEditBeloppradComparable from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";

defineProps<{
  taxonomyManager: TaxonomyManager;
  numPreviousYears: number;
  allowNot: boolean;
}>();

const emit = defineEmits<{
  (e: "delete"): void;
}>();

const belopprad = defineModel<BeloppradDecimal>("belopprad", {
  required: true,
});
</script>

<template>
  <BaseEditBeloppradComparable
    :allow-not="allowNot"
    :belopprad="belopprad"
    :num-previous-years="numPreviousYears"
    :taxonomy-manager="taxonomyManager"
    @delete="emit('delete')"
  />
</template>

<style lang="scss" scoped></style>
