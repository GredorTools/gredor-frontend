<script lang="ts" setup>
/**
 * En komponent för att rendera förändringar i eget kapital i förvaltningsberättelsen.
 * Visar en tabell med kolumner för olika typer av eget kapital och rader för olika förändringar.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { getForandringarAsTable } from "@/util/forandringarUtils.ts";
import { formatNumber } from "@/util/formatUtils.ts";
import {
  type Belopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import BaseRenderBeloppradLevel1Header from "@/components/render/blocks/belopprad/BaseRenderBeloppradLevel1Header.vue";
import {
  getNonFractionDecimals,
  getNonFractionScale,
  getSignAttribute,
  getUnitRef,
} from "@/util/renderUtils.ts";
import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

const props = defineProps<{
  /** Årsredovisningen som innehåller förvaltningsberättelsen med förändringar i eget kapital. */
  arsredovisning: Arsredovisning;

  /** TaxonomyManager för att hantera taxonomiobjekt i förändringar i eget kapital. */
  taxonomyManager: TaxonomyManager;
}>();

const groupTaxonomyItem = computed(() =>
  props.taxonomyManager.getItemByName(
    "se-gen-base:ForandringEgetKapitalAbstract",
  ),
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
  <!-- TODO: Hantera om tabellen blir för bred... -->
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
              :decimals="
                getNonFractionDecimals(cell.taxonomyItem, BeloppFormat.HELTAL)
              "
              :name="cell.taxonomyItem.xmlName"
              :scale="
                getNonFractionScale(cell.taxonomyItem, BeloppFormat.HELTAL)
              "
              :sign="
                isBeloppradMonetary(cell.belopprad)
                  ? getSignAttribute(
                      cell.taxonomyItem,
                      cell.belopprad.beloppNuvarandeAr.startsWith('-'),
                    )
                  : undefined
              "
              :unitRef="getUnitRef(cell.taxonomyItem)"
              format="ixt:numspacecomma"
            >
              {{
                formatNumber(
                  cell.belopprad.beloppNuvarandeAr,
                  cell.taxonomyItem,
                  BeloppFormat.HELTAL,
                  {
                    removeSign: true,
                  },
                )
              }}
            </ix:nonFraction>
          </template>
          <template v-else>&ndash;</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped></style>
