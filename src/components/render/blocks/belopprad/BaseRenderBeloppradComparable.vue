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

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden som ska redigeras. */
  belopprad: BaseBeloppradComparable;

  /** Antal tidigare räkenskapsår som ska visas. */
  numPreviousYears: number;

  /** Beloppradens kontexttyp. */
  contextRefPrefix: "period" | "balans";

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot: boolean;

  /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
  showBalanceSign?: boolean;

  /** Huruvida beloppraden ska tvångsvisas som en summarad. */
  displayAsTotalItem?: boolean;
}>();

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad);
});
</script>

<!-- TODO: unitRef -->
<template>
  <tr
    :class="{
      summa: taxonomyItem.additionalData.isTotalItem,
      ['summa-forced']: displayAsTotalItem,
      [`level-${taxonomyItem.level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td class="rubrik">
      {{ taxonomyItem.additionalData.displayLabel }}
    </td>
    <td v-if="allowNot" class="not-container">
      {{ belopprad.not }}
    </td>
    <td class="value-container">
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
        :sign="belopprad.beloppNuvarandeAr.startsWith('-') ? '-' : undefined"
        decimals="INF"
        format="ixt:numspacecomma"
        scale="0"
        unitRef="redovisningsvaluta"
      >
      </ix:nonFraction>
          {{
            formatNumber(belopprad.beloppNuvarandeAr, {
              removeSign: true,
            })
          }}
    </td>
    <td v-for="i in numPreviousYears" :key="i" class="value-container">
      <template v-if="belopprad.beloppTidigareAr[i - 1] != null">
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
          :sign="
            belopprad.beloppTidigareAr[i - 1]?.startsWith('-') ? '-' : undefined
          "
          decimals="INF"
          format="ixt:numspacecomma"
          scale="0"
          unitRef="redovisningsvaluta"
        >
          {{
            FormatUtil.formatNumber(belopprad.beloppTidigareAr[i - 1], {
              removeSign: true,
            })
          }}
        </ix:nonFraction>
      </template>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.summa.level-1,
.summa-forced {
  font-weight: 700;

  & td {
    padding-top: 1.25rem;
  }

  & .rubrik {
    font-style: italic;
  }
}

.summa.level-2 {
  font-weight: 600;

  & td {
    padding-top: 0.5rem;
  }
}

.summa.level-3 {
  font-weight: 500;
}
</style>
