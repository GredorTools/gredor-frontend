<script lang="ts" setup>
/**
 * En komponent som fungerar som en wrapper för olika typer av belopprader.
 * Väljer automatiskt rätt komponent baserat på beloppradens typ (monetär, decimal eller sträng).
 */

import RenderBeloppradMonetary from "@/components/render/blocks/belopprad/RenderBeloppradMonetary.vue";
import RenderBeloppradString from "@/components/render/blocks/belopprad/RenderBeloppradString.vue";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import RenderBeloppradNonmonetaryComparable from "@/components/render/blocks/belopprad/RenderBeloppradNonmonetaryComparable.vue";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden som ska renderas. */
  belopprad: Belopprad;

  /** Antal tidigare räkenskapsår som ska visas för belopprader där man kan jämföra mellan år. */
  comparableNumPreviousYears?: number;

  /** Huruvida notfält ska visas för belopprader där man kan jämföra mellan år. */
  comparableAllowNot?: boolean;

  /** Huruvida beloppraden ska tvångsvisas som en summarad, för belopprader där man kan jämföra mellan år. */
  comparableDisplayAsTotalItem?: boolean;

  /** Huruvida balanstecken ska visas för monetära belopprader. */
  monetaryShowBalanceSign?: boolean;

  /** Huruvida strängrader ska tillåta radbrytningar. */
  stringShowHeader?: boolean;
}>();

const contextRefPrefix = computed(() => {
  switch (
    getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad)
      .properties.periodType
  ) {
    case "duration":
      return "period";
    case "instant":
      return "balans";
    default:
      throw new Error("Unknown periodType");
  }
});
</script>

<template>
  <RenderBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :show-header="stringShowHeader || false"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradMonetary
    v-else-if="isBeloppradMonetary(belopprad)"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-total-item="comparableDisplayAsTotalItem || false"
    :num-previous-years="comparableNumPreviousYears || 0"
    :show-balance-sign="monetaryShowBalanceSign || false"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradNonmonetaryComparable
    v-else-if="isBeloppradComparable(belopprad)"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-total-item="comparableDisplayAsTotalItem || false"
    :num-previous-years="comparableNumPreviousYears || 0"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
