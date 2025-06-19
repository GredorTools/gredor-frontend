<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har monetära värden som datatyp.
 * Hanterar automatiskt beräkning av summarader och visar balanstecken vid behov.
 */

import {
  type BeloppradMonetary,
  calculateValuesIntoBelopprad,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { computed } from "vue";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseEditBeloppradComparable from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Antal tidigare räkenskapsår som ska visas för jämförelse. */
  numPreviousYears: number;

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot: boolean;

  /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
  showBalanceSign: boolean;
}>();

const emit = defineEmits<{
  /** Triggas när användaren tar bort beloppraden. */
  (e: "delete"): void;
}>();

/** Beloppraden med monetära värden som ska redigeras. */
const belopprad = defineModel<BeloppradMonetary>("belopprad", {
  required: true,
});

/** Lista med alla belopprader i samma tabell, används för beräkning av summarader. */
const belopprader = defineModel<Belopprad[]>("belopprader", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(
    belopprad.value.taxonomyItemName,
    belopprad.value.labelType,
  );
});

const isSummarad = computed(() => {
  const result = taxonomyItem.value.additionalData.isTotalItem;

  if (result) {
    calculateValuesIntoBelopprad(
      props.taxonomyManager.calculationProcessor,
      belopprader.value,
      belopprad.value,
    );
  }

  return result;
});
</script>

<template>
  <BaseEditBeloppradComparable
    :allow-not="allowNot"
    :belopprad="belopprad"
    :is-summarad="isSummarad"
    :num-previous-years="numPreviousYears"
    :show-balance-sign="showBalanceSign"
    :taxonomy-manager="taxonomyManager"
    @delete="emit('delete')"
  />
</template>

<style lang="scss" scoped></style>
