<script lang="ts" setup>
import { FormatUtil } from "@/util/FormatUtil.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: BaseBeloppradComparable;
  numPreviousYears: number;
  contextRefPrefix: "period" | "balans";
  allowNot: boolean;
  showBalanceSign?: boolean;
  displayAsTotalItem?: boolean;
}>();

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(
    props.belopprad.taxonomyItemName,
    props.belopprad.labelType,
  );
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
        {{
          FormatUtil.formatNumber(belopprad.beloppNuvarandeAr, {
            removeSign: true,
          })
        }}
      </ix:nonFraction>
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
