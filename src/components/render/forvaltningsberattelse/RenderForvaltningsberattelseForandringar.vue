<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { getForandringarAsTable } from "@/util/forandringarUtils.ts";
import { FormatUtil } from "@/util/FormatUtil.ts";

const props = defineProps<{
  arsredovisning: Arsredovisning;
  taxonomyManager: TaxonomyManager;
}>();

const groupTaxonomyItem = computed(() =>
  props.taxonomyManager.getItem("se-gen-base:ForandringEgetKapitalAbstract"),
);

const belopprader = computed(() =>
  props.arsredovisning.forvaltningsberattelse.filter((belopprad) =>
    groupTaxonomyItem.value.childrenFlat.some(
      (c) => belopprad.taxonomyItemName === c.xmlName,
    ),
  ),
);

const table = computed(() =>
  getForandringarAsTable(
    props.taxonomyManager,
    groupTaxonomyItem.value,
    belopprader.value,
  ),
);
</script>

<template>
  <table xmlns:ix="http://www.xbrl.org/2013/inlineXBRL">
    <thead>
      <tr>
        <th scope="col">
          {{ groupTaxonomyItem.additionalData.displayLabel }}
        </th>
        <th
          v-for="columnName in table.columnNames"
          :key="columnName"
          class="value-container"
          scope="col"
        >
          {{ columnName }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in table.table" :key="rowIndex">
        <td>
          {{ table.rowNames[rowIndex] }}
        </td>
        <td
          v-for="(cell, columnIndex) in row"
          :key="columnIndex"
          class="value-container"
        >
          <!-- TODO: contextRef ska vara balans_tidigare1 vid årets ingång -->
          <!-- TODO: contextRef ska vara balans_nuvarande vid årets utgång -->
          <template v-if="cell != null">
            <span v-if="cell.belopprad.beloppNuvarandeAr.startsWith('-')"
              >&minus;</span
            >
            <!-- @delete-whitespace -->
            <ix:nonFraction
              :name="cell.taxonomyItem.xmlName"
              :sign="
                cell.belopprad.beloppNuvarandeAr.startsWith('-')
                  ? '-'
                  : undefined
              "
              contextRef="period_nuvarande"
              decimals="INF"
              format="ixt:numspacecomma"
              scale="0"
              unitRef="redovisningsvaluta"
            >
              {{
                FormatUtil.formatNumber(cell.belopprad.beloppNuvarandeAr, {
                  removeSign: true,
                })
              }}
            </ix:nonFraction>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped></style>
