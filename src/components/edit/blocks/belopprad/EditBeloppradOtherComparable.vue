<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har icke-monetära jämförbara
 * värden som datatyp (t.ex. decimalvärden, aktievärden)
 */

import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import BaseEditBeloppradComparable, {
  type EditBeloppradComparableEmitsBase,
  type EditBeloppradComparablePropsBase
} from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";

defineProps<EditBeloppradComparablePropsBase>();

const emit = defineEmits<EditBeloppradComparableEmitsBase>();

/** Beloppraden med icke-monetära jämförbara värden som ska redigeras. */
const belopprad = defineModel<BaseBeloppradComparable>("belopprad", {
  required: true,
});
</script>

<template>
  <BaseEditBeloppradComparable
    :allow-delete="allowDelete"
    :allow-not="allowNot"
    :belopprad="belopprad"
    :display-as-level="displayAsLevel"
    :num-previous-years="numPreviousYears"
    :small="small"
    :taxonomy-manager="taxonomyManager"
    :value-colspan-override="valueColspanOverride"
    @delete="emit('delete')"
  />
</template>

<style lang="scss" scoped></style>
