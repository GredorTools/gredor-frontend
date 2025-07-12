<script lang="ts" setup>
/**
 * En baskomponent för att rendera belopprader där man kan jämföra värden mellan nuvarande och tidigare år.
 * Används som grund för t.ex. monetära och decimala belopprader.
 */

import { formatNumber } from "@/util/formatUtils.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  getNonFractionScale,
  getUnitRef,
  isPercentageTaxonomyItem,
} from "@/util/renderUtils.ts";

export interface RenderBeloppradComparablePropsBase<
  T extends BaseBeloppradComparable,
> {
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med jämförbara värden som ska redigeras. */
  belopprad: T;

  /** Möjliggör att få beloppraden att renderas som en belopprad av en viss
   * nivå, även om den inte är en belopprad av den nivån. */
  renderAsLevel?: number;

  /** Beloppradens kontexttyp. */
  contextRefPrefix: "period" | "balans";

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot: boolean;

  /** Huruvida beloppraden ska tvångsvisas som en summarad. */
  displayAsTotalItem: boolean;
}

const props = defineProps<
  RenderBeloppradComparablePropsBase<BaseBeloppradComparable> & {
    /** Antal tidigare räkenskapsår som ska visas. */
    numPreviousYears: number;

    /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
    showBalanceSign?: boolean;
  }
>();

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad);
});

const renderLevel = computed(
  () => props.renderAsLevel ?? taxonomyItem.value.level,
);
</script>

<template>
  <tr
    :class="{
      summa:
        taxonomyItem.additionalData.labelType === 'totalLabel' ||
        taxonomyItem.additionalData.isCalculatedItem,
      ['summa-forced']: displayAsTotalItem,
      [`level-${renderLevel}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td class="rubrik">
      {{ taxonomyItem.additionalData.displayLabel }}
      <span v-if="isPercentageTaxonomyItem(taxonomyItem)">[%]</span>
    </td>
    <td v-if="allowNot" class="not-container">
      {{ belopprad.not }}
    </td>
    <td class="value-container">
      <template v-if="belopprad.beloppNuvarandeAr.length > 0">
        <span
          v-if="
            (showBalanceSign &&
              taxonomyItem.properties.balance === 'debit' &&
              belopprad.beloppNuvarandeAr.trim().length > 0 &&
              belopprad.beloppNuvarandeAr.trim() !== '0') ||
            belopprad.beloppNuvarandeAr.startsWith('-')
          "
          >&minus;</span
        >
        <!-- @delete-whitespace -->
        <ix:nonFraction
          :contextRef="contextRefPrefix + '_nuvarande'"
          :name="taxonomyItem.xmlName"
          :scale="getNonFractionScale(taxonomyItem)"
          :sign="belopprad.beloppNuvarandeAr.startsWith('-') ? '-' : undefined"
          :unitRef="getUnitRef(taxonomyItem)"
          decimals="INF"
          format="ixt:numspacecomma"
        >
          {{
            formatNumber(belopprad.beloppNuvarandeAr, {
              removeSign: true,
            })
          }}
        </ix:nonFraction>
      </template>
      <template v-else>&ndash;</template>
    </td>
    <td v-for="i in numPreviousYears" :key="i" class="value-container">
      <template v-if="belopprad.beloppTidigareAr[i - 1]?.length > 0">
        <span
          v-if="
            (showBalanceSign &&
              taxonomyItem.properties.balance === 'debit' &&
              belopprad.beloppTidigareAr[i - 1].trim().length > 0 &&
              belopprad.beloppTidigareAr[i - 1].trim() !== '0') ||
            belopprad.beloppTidigareAr[i - 1].startsWith('-')
          "
          >&minus;</span
        >
        <!-- @delete-whitespace -->
        <ix:nonFraction
          :contextRef="contextRefPrefix + '_tidigare' + i"
          :name="taxonomyItem.xmlName"
          :scale="getNonFractionScale(taxonomyItem)"
          :sign="
            belopprad.beloppTidigareAr[i - 1]?.startsWith('-') ? '-' : undefined
          "
          :unitRef="getUnitRef(taxonomyItem)"
          decimals="INF"
          format="ixt:numspacecomma"
        >
          {{
            formatNumber(belopprad.beloppTidigareAr[i - 1], {
              removeSign: true,
            })
          }}
        </ix:nonFraction>
      </template>
      <template v-else>&ndash;</template>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.summa.level-1,
.summa-forced {
  font-weight: 600;

  td {
    padding-top: 1.25rem;
  }

  .rubrik {
    font-style: italic;
  }
}

.summa.level-2 {
  font-weight: 600;

  td {
    padding-top: 0.5rem;
  }
}

.summa.level-3 {
  font-weight: 500;
}

.summa + *:not(.summa) td {
  padding-top: 1.25rem;
}
</style>
