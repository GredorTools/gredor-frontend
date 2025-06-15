<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { getForandringarAsTable } from "@/util/forandringarUtils.ts";
import { FormatUtil } from "@/util/FormatUtil.ts";
import {
  type Belopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import BaseRenderBeloppradLevel1Header from "@/components/render/belopprad/BaseRenderBeloppradLevel1Header.vue";

const props = defineProps<{
  arsredovisning: Arsredovisning;
  taxonomyManager: TaxonomyManager;
}>();

const groupTaxonomyItem = computed(() =>
  props.taxonomyManager.getItem("se-gen-base:ForandringEgetKapitalAbstract"),
);

const belopprader = computed(() =>
  props.arsredovisning.forvaltningsberattelse.filter((belopprad) =>
    isBeloppradInTaxonomyItemList(
      groupTaxonomyItem.value.childrenFlat,
      belopprad,
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

function getContextRef(belopprad: Belopprad) {
  switch (belopprad.labelType) {
    case "periodStartLabel":
      return "balans_tidigare1";
    case "periodEndLabel":
      return "balans_nuvarande";
    default:
      return "period_nuvarande";
  }
}
</script>

<template>
  <table xmlns:ix="http://www.xbrl.org/2013/inlineXBRL">
    <thead>
      <tr>
        <th scope="col">
          <BaseRenderBeloppradLevel1Header :taxonomy-item="groupTaxonomyItem" />
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
          <template v-if="cell != null">
            <span v-if="cell.belopprad.beloppNuvarandeAr.startsWith('-')"
              >&minus;</span
            >
            <!-- @delete-whitespace -->
            <ix:nonFraction
              :contextRef="getContextRef(cell.belopprad)"
              :name="cell.taxonomyItem.xmlName"
              :sign="
                cell.belopprad.beloppNuvarandeAr.startsWith('-')
                  ? '-'
                  : undefined
              "
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
