<script lang="ts" setup>
import { FormatUtil } from "@/util/FormatUtil.ts";
import type { BeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { getDisplayNameForTaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

defineProps<{
  belopprad: BeloppradMonetary;
  contextRefPrefix: "period" | "balans";
  showSaldo: boolean;
}>();

const extraSummarader = ["Årets resultat"];
const superdelsummarader = [
  "Rörelseresultat",
  "Resultat efter finansiella poster",
  "Resultat före skatt",
];
</script>

<template>
  <tr
    :class="{
      summa:
        belopprad.taxonomyItem.radrubrik.startsWith('Summa ') ||
        extraSummarader.includes(belopprad.taxonomyItem.radrubrik),
      superdelsumma: superdelsummarader.includes(
        belopprad.taxonomyItem.radrubrik,
      ),
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td class="rubrik">
      {{
        belopprad.egetNamn ||
        getDisplayNameForTaxonomyItem(belopprad.taxonomyItem)
      }}
    </td>
    <td>
      {{ belopprad.not }}
    </td>
    <td>
      <span
        v-if="
          (showSaldo &&
            belopprad.taxonomyItem.saldo === 'debit' &&
            belopprad.beloppNuvarandeAr.trim().length > 0 &&
            belopprad.beloppNuvarandeAr.trim() !== '0') ||
          belopprad.beloppNuvarandeAr.startsWith('-')
        "
        >&minus;</span
      >
      <!-- @delete-whitespace -->
      <ix:nonFraction
        :contextRef="contextRefPrefix + '_nuvarande'"
        :name="
          belopprad.taxonomyItem.tillhor +
          ':' +
          belopprad.taxonomyItem.elementnamn
        "
        :sign="belopprad.beloppNuvarandeAr.startsWith('-') ? '-' : undefined"
        decimals="INF"
        format="ixt:numspacecomma"
        scale="0"
        unitRef="redovisningsvaluta"
      >
        {{
          FormatUtil.formatNumber(belopprad.beloppNuvarandeAr, {
            removeSign: true,
          })
        }}
      </ix:nonFraction>
    </td>
    <td>
      <template v-if="belopprad.beloppForegaendeAr != null">
        <span
          v-if="
            (showSaldo &&
              belopprad.taxonomyItem.saldo === 'debit' &&
              belopprad.beloppForegaendeAr.trim().length > 0 &&
              belopprad.beloppForegaendeAr.trim() !== '0') ||
            belopprad.beloppForegaendeAr.startsWith('-')
          "
          >&minus;</span
        >
        <!-- @delete-whitespace -->
        <ix:nonFraction
          :contextRef="contextRefPrefix + '_foregaende'"
          :name="
            belopprad.taxonomyItem.tillhor +
            ':' +
            belopprad.taxonomyItem.elementnamn
          "
          :sign="belopprad.beloppForegaendeAr.startsWith('-') ? '-' : undefined"
          decimals="INF"
          format="ixt:numspacecomma"
          scale="0"
          unitRef="redovisningsvaluta"
        >
          {{
            FormatUtil.formatNumber(belopprad.beloppForegaendeAr, {
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
.superdelsumma {
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
