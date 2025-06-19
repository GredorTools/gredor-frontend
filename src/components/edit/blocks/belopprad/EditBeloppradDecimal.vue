<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har decimaltal som datatyp.
 */

import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseEditBeloppradComparable from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";

defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Antal tidigare räkenskapsår som ska visas för jämförelse. */
  numPreviousYears: number;

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot: boolean;
}>();

const emit = defineEmits<{
  /** Triggas när användaren tar bort beloppraden. */
  (e: "delete"): void;
}>();

/** Beloppraden med decimalvärden som ska redigeras. */
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
