<script lang="ts" setup>
import {
  type BeloppradMonetary,
  calculateValuesIntoBelopprad,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { computed } from "vue";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseEditBeloppradComparable from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  numPreviousYears: number;
  allowNot: boolean;
  showBalanceSign: boolean;
}>();

const emit = defineEmits<{
  (e: "delete"): void;
}>();

const belopprad = defineModel<BeloppradMonetary>("belopprad", {
  required: true,
});
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
