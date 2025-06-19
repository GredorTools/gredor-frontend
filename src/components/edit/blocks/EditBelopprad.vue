<script lang="ts" setup>
/**
 * En komponent som fungerar som en wrapper för olika typer av belopprader.
 * Väljer automatiskt rätt komponent baserat på beloppradens typ (monetär, decimal eller sträng).
 */

import EditBeloppradMonetary from "@/components/edit/blocks/belopprad/EditBeloppradMonetary.vue";
import EditBeloppradString from "@/components/edit/blocks/belopprad/EditBeloppradString.vue";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import EditBeloppradDecimal from "@/components/edit/blocks/belopprad/EditBeloppradDecimal.vue";
import { isBeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";

defineProps<{
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
</script>

<template>
  <EditBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :comparable-num-previous-years="comparableNumPreviousYears || 0"
    :multiline="stringMultiline || false"
    :taxonomy-manager="taxonomyManager"
    @delete="emit('delete')"
  />
  <EditBeloppradMonetary
    v-if="isBeloppradMonetary(belopprad)"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :belopprader="belopprader"
    :num-previous-years="comparableNumPreviousYears || 0"
    :show-balance-sign="monetaryShowBalanceSign || false"
    :taxonomy-manager="taxonomyManager"
    @delete="emit('delete')"
  />
  <EditBeloppradDecimal
    v-if="isBeloppradDecimal(belopprad)"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :num-previous-years="comparableNumPreviousYears || 0"
    :taxonomy-manager="taxonomyManager"
    @delete="emit('delete')"
  />
</template>

<style lang="scss" scoped></style>
