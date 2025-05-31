<script lang="ts" setup>
import { FormatUtil } from "@/util/FormatUtil.ts";
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";

defineProps<{
  belopprad: BeloppradDecimal;
  contextRefPrefix: "period" | "balans";
}>();
</script>

<template>
  <tr
    :class="{
      abstract: belopprad.taxonomyItem.abstrakt === 'true',
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td>
      {{ belopprad.egetNamn || belopprad.taxonomyItem.radrubrik }}
    </td>
    <td></td>
    <td>
      <!-- TODO: unitRef -->
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
        <!-- TODO: unitRef -->
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
</style>
