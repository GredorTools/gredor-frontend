<script lang="ts" setup>
import { FormatUtil } from "@/util/FormatUtil.ts";
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { computed } from "vue";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: BeloppradDecimal;
  contextRefPrefix: "period" | "balans";
}>();

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(props.belopprad.taxonomyItemName);
});
</script>

<template>
  <tr
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      [`level-${taxonomyItem.level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td>
      {{ belopprad.egetNamn || taxonomyItem.additionalData.displayLabel }}
    </td>
    <td></td>
    <td>
      <!-- TODO: unitRef -->
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
    <td>
      <template v-if="belopprad.beloppForegaendeAr != null">
        <!-- TODO: unitRef -->
        <ix:nonFraction
          :contextRef="contextRefPrefix + '_foregaende'"
          :name="taxonomyItem.xmlName"
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
