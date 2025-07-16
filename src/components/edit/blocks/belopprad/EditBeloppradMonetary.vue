<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har monetära värden som datatyp.
 * Hanterar automatiskt beräkning av summarader och visar balanstecken vid behov.
 */

import {
  type BeloppradMonetary,
  calculateValuesIntoBelopprad,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { computed, onMounted, watch } from "vue";
import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import BaseEditBeloppradComparable, {
  type EditBeloppradComparableEmitsBase,
  type EditBeloppradComparablePropsBase,
} from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";

const props = defineProps<
  EditBeloppradComparablePropsBase & {
    /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
    showBalanceSign: boolean;
  }
>();

const emit = defineEmits<EditBeloppradComparableEmitsBase>();

/** Beloppraden med monetära värden som ska redigeras. */
const belopprad = defineModel<BeloppradMonetary>("belopprad", {
  required: true,
});

/** Lista med alla belopprader i samma tabell, används för beräkning av summarader. */
const belopprader = defineModel<Belopprad[]>("belopprader", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});

// Räkna automatiskt ut summor
function createSumWatcher(
  belopprad: BeloppradMonetary,
  belopprader: Belopprad[],
) {
  if (taxonomyItem.value.additionalData.isCalculatedItem) {
    const sumPartBelopprader = belopprader.filter((otherBelopprad) =>
      props.taxonomyManager.calculationProcessor.isConceptIncludedInSum(
        otherBelopprad.taxonomyItemName,
        belopprad.taxonomyItemName,
      ),
    );

    for (const sumPartBelopprad of sumPartBelopprader) {
      watch(sumPartBelopprad, () => {
        calculateValuesIntoBelopprad(
          props.taxonomyManager.calculationProcessor,
          sumPartBelopprader,
          belopprad,
        );
      });
    }
  }
}

onMounted(() => createSumWatcher(belopprad.value, belopprader.value));
watch(
  [belopprad, belopprader],
  ([newBelopprad, newBelopprader]) => {
    createSumWatcher(newBelopprad, newBelopprader);
  },
  { deep: false },
);
</script>

<template>
  <BaseEditBeloppradComparable
    :allow-delete="allowDelete"
    :allow-not="allowNot"
    :allowed-value-regex="/^-?\d*$/"
    :belopprad="belopprad"
    :is-summarad="taxonomyItem.additionalData.isCalculatedItem"
    :num-previous-years="numPreviousYears"
    :show-balance-sign="showBalanceSign"
    :taxonomy-manager="taxonomyManager"
    @delete="emit('delete')"
  />
</template>

<style lang="scss" scoped></style>
