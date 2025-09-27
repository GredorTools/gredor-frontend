<script lang="ts" setup>
/**
 * En komponent som fungerar som en wrapper för olika typer av belopprader.
 * Väljer automatiskt rätt komponent baserat på beloppradens typ (monetär, icke-monetär eller sträng).
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
import RenderBeloppradOtherComparable from "@/components/render/blocks/belopprad/RenderBeloppradOtherComparable.vue";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import RenderBeloppradTuple from "@/components/render/blocks/belopprad/RenderBeloppradTuple.vue";
import { isBeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import RenderBeloppradEnum from "@/components/render/blocks/belopprad/RenderBeloppradEnum.vue";
import { isBeloppradEnum } from "@/model/arsredovisning/beloppradtyper/BeloppradEnum.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { getContextRefPrefix } from "@/util/renderUtils.ts";
import { RenderBeloppradDisplayAsType } from "@/components/render/blocks/belopprad/RenderBeloppradDisplayAsType.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden som ska renderas. */
  belopprad: Belopprad;

  /** Årsredovisningens redovisningsvaluta. */
  redovisningsvaluta: Redovisningsvaluta;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs?: Record<string, string>;

  /** Möjliggör att få beloppraden att se ut som en belopprad av en viss nivå,
   * även om den egentligen inte är en belopprad av den nivån. */
  displayAsLevel?: number;

  /** Vilket format beloppraden ska visas i. */
  displayFormat?: BeloppFormat;

  /** Möjliggör att visa en egen rubrik för beloppraden. */
  displayHeader?: string;

  /** Antal tidigare räkenskapsår som ska visas för belopprader där man kan
   * jämföra mellan år. */
  comparableNumPreviousYears?: number;

  /** Huruvida notfält ska visas för belopprader där man kan jämföra mellan år.
   **/
  comparableAllowNot?: boolean;

  /** Hur raden ska visas ("vanlig rad", summarad, eller att det väljs
   * automatiskt), för belopprader där man kan jämföra mellan år. */
  comparableDisplayAsType?: RenderBeloppradDisplayAsType;

  /** Huruvida balanstecken ska visas för monetära belopprader. */
  monetaryShowBalanceSign?: boolean;

  /** Huruvida rubriker för strängbelopprader ska visas. */
  stringShowHeader?: boolean;

  /** Huruvida rubriken ska visas som en abstrakt radrubrik (om den visas), för
   * strängbelopprader. */
  stringShowHeaderAsAbstract?: boolean;

  /** Huruvida strängbelopprader ska renderas som "rå" text, utan p-taggar. */
  stringRaw?: boolean;
}>();

const contextRefPrefix = computed(() =>
  getContextRefPrefix(
    getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad),
  ),
);
</script>

<template>
  <RenderBeloppradString
    v-if="isBeloppradString(belopprad)"
    :additional-ixbrl-attrs="additionalIxbrlAttrs || {}"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-level="displayAsLevel"
    :display-header="displayHeader"
    :raw="stringRaw || false"
    :show-header="stringShowHeader || false"
    :show-header-as-abstract="stringShowHeaderAsAbstract || false"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradMonetary
    v-else-if="isBeloppradMonetary(belopprad)"
    :additional-ixbrl-attrs="additionalIxbrlAttrs || {}"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-level="displayAsLevel"
    :display-as-type="
      comparableDisplayAsType || RenderBeloppradDisplayAsType.AUTO
    "
    :display-format="displayFormat || BeloppFormat.HELTAL"
    :display-header="displayHeader"
    :num-previous-years="comparableNumPreviousYears || 0"
    :redovisningsvaluta="redovisningsvaluta"
    :show-balance-sign="monetaryShowBalanceSign || false"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradEnum
    v-else-if="isBeloppradEnum(belopprad)"
    :additional-ixbrl-attrs="additionalIxbrlAttrs || {}"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-level="displayAsLevel"
    :display-as-type="
      comparableDisplayAsType || RenderBeloppradDisplayAsType.AUTO
    "
    :display-format="displayFormat || BeloppFormat.HELTAL"
    :display-header="displayHeader"
    :num-previous-years="comparableNumPreviousYears || 0"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradOtherComparable
    v-else-if="isBeloppradComparable(belopprad)"
    :additional-ixbrl-attrs="additionalIxbrlAttrs || {}"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-level="displayAsLevel"
    :display-as-type="
      comparableDisplayAsType || RenderBeloppradDisplayAsType.AUTO
    "
    :display-format="displayFormat || BeloppFormat.HELTAL"
    :display-header="displayHeader"
    :num-previous-years="comparableNumPreviousYears || 0"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradTuple
    v-else-if="isBeloppradTuple(belopprad)"
    :belopprad="belopprad"
    :display-header="displayHeader"
    :redovisningsvaluta="redovisningsvaluta"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
