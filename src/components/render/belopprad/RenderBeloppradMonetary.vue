<script lang="ts" setup>
import { type BeloppradMonetary } from "@/model/arsredovisning/Arsredovisning.ts";
import { FormatUtil } from "@/util/FormatUtil.ts";

const props = defineProps<{
  belopprad: BeloppradMonetary;
  contextRefPrefix: "period" | "balans";
  showSaldo: boolean;
}>();

const isAbstract = props.belopprad.taxonomyItem.abstrakt === "true";
</script>

<template>
  <tr
    :class="{
      abstract: isAbstract,
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td>
      {{ belopprad.egetNamn || belopprad.taxonomyItem.radrubrik }}
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
        >-</span
      >
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
        unitRef="SEK"
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
          >-</span
        >
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
          unitRef="SEK"
          >{{
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
