<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har icke-monetära jämförbara
 * värden som datatyp (t.ex. decimalvärden, aktievärden)
 */

import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import BaseEditBeloppradComparable, {
  type EditBeloppradComparableEmitsBase,
  type EditBeloppradComparablePropsBase,
} from "@/components/edit/blocks/belopprad/BaseEditBeloppradComparable.vue";
import { computed } from "vue";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import { isTaxonomyItemForRealNumber } from "@/model/taxonomy/TaxonomyItem.ts";

const props = defineProps<EditBeloppradComparablePropsBase>();

const emit = defineEmits<EditBeloppradComparableEmitsBase>();

/** Beloppraden med icke-monetära jämförbara värden som ska redigeras. */
const belopprad = defineModel<BaseBeloppradComparable>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});

const allowedValueRegex = computed(() => {
  if (isTaxonomyItemForRealNumber(taxonomyItem.value)) {
    // Tillåt endast reella tal
    // OBS: Punkt är egentligen inte tillåtet som decimaltecken, men vi gör om
    // det till kommatecken vid rendering
    return /^-?\d+[.,]?\d*$/;
  } else {
    // Tillåt vad som helst
    return undefined;
  }
});
</script>

<template>
  <BaseEditBeloppradComparable
    :allow-delete="allowDelete"
    :allow-not="allowNot"
    :allowed-value-regex="allowedValueRegex"
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
