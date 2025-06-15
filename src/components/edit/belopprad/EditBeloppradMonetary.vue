<script lang="ts" setup>
import {
  type BeloppradMonetary,
  calculateValuesIntoBelopprad,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { computed } from "vue";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseEditBeloppradComparable from "@/components/edit/belopprad/BaseEditBeloppradComparable.vue";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  numPreviousYears: number;
  allowNot: boolean;
  showSaldo: boolean;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradMonetary>("belopprad", {
  required: true,
});
const belopprader = defineModel<Belopprad[]>("belopprader", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(belopprad.value.taxonomyItemName);
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
    :delete-callback="deleteCallback"
    :is-summarad="isSummarad"
    :num-previous-years="numPreviousYears"
    :show-saldo="showSaldo"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
