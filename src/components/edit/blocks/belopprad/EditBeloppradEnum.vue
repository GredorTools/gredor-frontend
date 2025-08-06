<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har vallistor som datatyp.
 */

import BaseEditBeloppradComparable, {
  type EditBeloppradComparableEmitsBase,
  type EditBeloppradComparablePropsBase,
} from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";
import type { BeloppradEnum } from "@/model/arsredovisning/beloppradtyper/BeloppradEnum.ts";

import { formatEnumValueDisplayLabel } from "@/util/formatUtils.ts";

defineProps<EditBeloppradComparablePropsBase>();

const emit = defineEmits<EditBeloppradComparableEmitsBase>();

/** Beloppraden med vallistan som ska redigeras. */
const belopprad = defineModel<BeloppradEnum>("belopprad", {
  required: true,
});
</script>

<template>
  <BaseEditBeloppradComparable
    :allow-delete="allowDelete"
    :allow-not="allowNot"
    :belopprad="belopprad"
    :num-previous-years="numPreviousYears"
    :small="small"
    :taxonomy-manager="taxonomyManager"
    @delete="emit('delete')"
  >
    <template #input-current-year="{ taxonomyItem }">
      <select v-model="belopprad.beloppNuvarandeAr">
        <option
          v-for="choice in taxonomyItem.childrenFlat"
          :key="choice.xmlName"
          :value="choice.xmlName"
        >
          {{ formatEnumValueDisplayLabel(choice) }}
        </option>
      </select>
    </template>

    <template #input-previous-year="{ previousYearIndex, taxonomyItem }">
      <select v-model="belopprad.beloppTidigareAr[previousYearIndex]">
        <option
          v-for="choice in taxonomyItem.childrenFlat"
          :key="choice.xmlName"
          :value="choice.xmlName"
        >
          {{ formatEnumValueDisplayLabel(choice) }}
        </option>
      </select>
    </template>
  </BaseEditBeloppradComparable>
</template>

<style lang="scss" scoped></style>
