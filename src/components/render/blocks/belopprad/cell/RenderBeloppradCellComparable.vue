<script lang="ts" setup>
import {
  getContextRef,
  getContextRefPrefix,
  getNonFractionDecimals,
  getNonFractionScale,
  getSignAttribute,
  getUnitRef,
  shouldShowSign,
} from "@/util/renderUtils.ts";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { formatNumber } from "@/util/formatUtils.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { computed } from "vue";

const props = defineProps<{
  /** Beloppraden med det jämförbara värdet som ska renderas. */
  belopprad: BaseBeloppradComparable;

  /** Taxonomiobjektet som motsvarar beloppraden. */
  taxonomyItem: TaxonomyItem;

  /** Vilket format beloppraden ska visas i. */
  displayFormat: BeloppFormat;

  /** Huruvida balanstecken (plus/minus) får visas för beloppraden utifrån det
   * motsvarande taxonomiobjektets balance-värde. */
  showBalanceSign?: boolean;

  /** 0 för nuvarande räkenskapsår, 1 för senaste tidigare räkenskapsåret, osv.
   * */
  yearIndex: number;

  /** Möjliggör override av contextRef - används för tuples. */
  contextRefOverrideYearIndex?: number;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs: Record<string, string>;
}>();

const belopp = computed(() => {
  if (props.yearIndex === 0) {
    return props.belopprad.beloppNuvarandeAr;
  } else {
    return props.belopprad.beloppTidigareAr[props.yearIndex - 1];
  }
});
</script>

<template>
  <span
    v-if="
      shouldShowSign(
        taxonomyItem,
        belopp,
        displayFormat,
        showBalanceSign || false,
      )
    "
    >&minus;</span
  >
  <!-- @delete-whitespace -->
  <ix:nonFraction
    :contextRef="
      getContextRef(
        taxonomyItem,
        getContextRefPrefix(taxonomyItem),
        contextRefOverrideYearIndex ?? yearIndex,
      )
    "
    :decimals="getNonFractionDecimals(taxonomyItem, displayFormat)"
    :name="taxonomyItem.xmlName"
    :scale="getNonFractionScale(taxonomyItem, displayFormat)"
    :sign="getSignAttribute(taxonomyItem, belopp)"
    :unitRef="getUnitRef(taxonomyItem)"
    format="ixt:numspacecomma"
    v-bind="additionalIxbrlAttrs"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    {{
      formatNumber(belopp, taxonomyItem, displayFormat, {
        removeSign: true,
      })
    }}
  </ix:nonFraction>
</template>

<style lang="scss" scoped></style>
