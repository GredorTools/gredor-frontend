<script lang="ts" setup>
/**
 * En komponent för att rendera belopprader av typen tuple.
 * Växlar mellan enkel tabell och jämförelsetabell beroende på tuple-typ.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import {
  type BeloppradTuple,
  BeloppradTupleFormat,
  getBeloppradTupleFormat,
} from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";
import RenderBeloppradTupleSimple from "@/components/render/blocks/belopprad/RenderBeloppradTupleSimple.vue";
import RenderBeloppradTupleComparison from "@/components/render/blocks/belopprad/RenderBeloppradTupleComparison.vue";
import { computed } from "vue";

const props = defineProps<{
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

const beloppradTupleFormat = computed(() =>
  getBeloppradTupleFormat(props.belopprad),
);
</script>

<template>
  <RenderBeloppradTupleSimple
    v-if="beloppradTupleFormat === BeloppradTupleFormat.SIMPLE"
    :belopprad="belopprad"
    :display-header="displayHeader"
    :redovisningsvaluta="redovisningsvaluta"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradTupleComparison
    v-else-if="beloppradTupleFormat === BeloppradTupleFormat.COMPARISON"
    :belopprad="belopprad"
    :display-header="displayHeader"
    :num-previous-years="comparableNumPreviousYears"
    :redovisningsvaluta="redovisningsvaluta"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
