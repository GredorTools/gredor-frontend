<script lang="ts" setup>
/**
 * En komponent som fungerar som en wrapper för olika typer av belopprader.
 * Väljer automatiskt rätt komponent baserat på beloppradens typ (monetär, icke-monetär eller sträng).
 */

import EditBeloppradMonetary from "@/components/edit/blocks/belopprad/EditBeloppradMonetary.vue";
import EditBeloppradString from "@/components/edit/blocks/belopprad/EditBeloppradString.vue";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import EditBeloppradNonmonetaryComparable from "@/components/edit/blocks/belopprad/EditBeloppradNonmonetaryComparable.vue";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { computed } from "vue";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Antal tidigare räkenskapsår som ska visas för belopprader där man kan jämföra mellan år. */
  comparableNumPreviousYears?: number;

  /** Huruvida notfält ska visas för belopprader där man kan jämföra mellan år. */
  comparableAllowNot?: boolean;

  /** Huruvida balanstecken ska visas för monetära belopprader. */
  monetaryShowBalanceSign?: boolean;

  /** Huruvida strängrader ska tillåta radbrytningar. */
  stringMultiline?: boolean;

  /** Minsta nivå för strängbelopprader; belopprader som är strängar och ligger
   * högre upp i hierarkin kommer inte att renderas. */
  stringMinimumLevel?: number;
}>();

const emit = defineEmits<{
  /** Triggas när användaren tar bort beloppraden. */
  (e: "delete"): void;
}>();

/** Beloppraden som ska redigeras. */
const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});

/** Lista med alla belopprader i samma tabell. */
const belopprader = defineModel<Belopprad[]>("belopprader", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});
</script>

<template>
  <template
    v-if="
      taxonomyItem.properties.type !== 'xbrli:stringItemType' ||
      taxonomyItem.childrenFlat.length < 1 ||
      taxonomyItem.level > (stringMinimumLevel ?? -1)
    "
  >
    <EditBeloppradString
      v-if="isBeloppradString(belopprad)"
      :belopprad="belopprad"
      :comparable-num-previous-years="comparableNumPreviousYears || 0"
      :multiline="stringMultiline || false"
      :taxonomy-manager="taxonomyManager"
      @delete="emit('delete')"
    />
    <EditBeloppradMonetary
      v-else-if="isBeloppradMonetary(belopprad)"
      :allow-not="comparableAllowNot || false"
      :belopprad="belopprad"
      :belopprader="belopprader"
      :num-previous-years="comparableNumPreviousYears || 0"
      :show-balance-sign="monetaryShowBalanceSign || false"
      :taxonomy-manager="taxonomyManager"
      @delete="emit('delete')"
    />
    <EditBeloppradNonmonetaryComparable
      v-else-if="isBeloppradComparable(belopprad)"
      :allow-not="comparableAllowNot || false"
      :belopprad="belopprad"
      :num-previous-years="comparableNumPreviousYears || 0"
      :taxonomy-manager="taxonomyManager"
      @delete="emit('delete')"
    />
  </template>
</template>

<style lang="scss" scoped></style>
