<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";
import RenderBeloppradTupleSimple from "@/components/render/blocks/belopprad/RenderBeloppradTupleSimple.vue";
import RenderBeloppradTupleComparison from "@/components/render/blocks/belopprad/RenderBeloppradTupleComparison.vue";
import { comparableTuples } from "@/data/comparableTuples.ts";

defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med tuple-värdet som ska renderas. */
  belopprad: BeloppradTuple;

  /** Årsredovisningens redovisningsvaluta. */
  redovisningsvaluta: Redovisningsvaluta;

  /** Möjliggör att visa en egen rubrik för beloppraden. */
  displayHeader?: string;

  /** Antal tidigare räkenskapsår som ska visas för jämförelse, för tuples vars
   * värden kan jämföras mellan år. */
  comparableNumPreviousYears: number;
}>();
</script>

<template>
  <RenderBeloppradTupleComparison
    v-if="comparableTuples.includes(belopprad.taxonomyItemName)"
    :belopprad="belopprad"
    :display-header="displayHeader"
    :num-previous-years="comparableNumPreviousYears"
    :redovisningsvaluta="redovisningsvaluta"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradTupleSimple
    v-else
    :belopprad="belopprad"
    :display-header="displayHeader"
    :redovisningsvaluta="redovisningsvaluta"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
