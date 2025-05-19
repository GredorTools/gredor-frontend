<script lang="ts" setup>
import type { Belopprad } from "@/model/arsredovisning/Arsredovisning.ts";
import { FormatUtil } from "@/util/FormatUtil.ts";

defineProps<{
  belopprad: Belopprad;
  showSaldo?: boolean;
}>();
</script>

<template>
  <tr
    :class="{
      abstract: belopprad.taxonomyItem.abstrakt === 'true',
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
      [`typ-${belopprad.typ}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td>
      {{ belopprad.egetNamn || belopprad.taxonomyItem.radrubrik }}
    </td>
    <td>{{ belopprad.not }}</td>
    <td>
      <span
        v-if="
          showSaldo &&
          belopprad.taxonomyItem.saldo === 'debit' &&
          belopprad.beloppNuvarandeAr.trim().length > 0
        "
        >-</span
      >
      <ix:nonFraction
        :name="
          belopprad.taxonomyItem.tillhor +
          ':' +
          belopprad.taxonomyItem.elementnamn
        "
        context-ref="period0"
        decimals="INF"
        format="ixt:numspacecomma"
        scale="0"
        unit-ref="SEK"
      >
        {{ FormatUtil.formatNumber(belopprad.beloppNuvarandeAr) }}
      </ix:nonFraction>
    </td>
    <td v-if="belopprad.beloppForegaendeAr != null">
      <span
        v-if="
          showSaldo &&
          belopprad.taxonomyItem.saldo === 'debit' &&
          belopprad.beloppForegaendeAr.trim().length > 0
        "
        >-</span
      >
      <ix:nonFraction
        :name="
          belopprad.taxonomyItem.tillhor +
          ':' +
          belopprad.taxonomyItem.elementnamn
        "
        context-ref="period1"
        decimals="INF"
        format="ixt:numspacecomma"
        scale="0"
        unit-ref="SEK"
        >{{ FormatUtil.formatNumber(belopprad.beloppForegaendeAr) }}
      </ix:nonFraction>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.abstract.level-1 {
  font-weight: 600;
}

.abstract.level-2 {
  font-weight: 500;
}

.abstract.level-3 {
  font-weight: 400;
  text-decoration: underline;
}

.typ-delsumma {
  font-weight: 500;
}

.typ-summa {
  font-weight: 600;
}

.typ-slutsumma {
  font-weight: 700;
}
</style>
