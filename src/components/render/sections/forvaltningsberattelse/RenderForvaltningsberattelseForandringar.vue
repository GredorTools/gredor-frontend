<script lang="ts" setup>
/**
 * En komponent för att rendera förändringar i eget kapital i förvaltningsberättelsen.
 * Visar en tabell med kolumner för olika typer av eget kapital och rader för olika förändringar.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { getForandringarAsTable } from "@/util/forandringarUtils.ts";
import { isBeloppradInTaxonomyItemList } from "@/model/arsredovisning/Belopprad.ts";
import BaseRenderBeloppradLevel1Header from "@/components/render/blocks/belopprad/BaseRenderBeloppradLevel1Header.vue";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import RenderBeloppradCellComparable from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellComparable.vue";

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

const forandringarTable = computed(() =>
  getForandringarAsTable(
    props.taxonomyManager,
    groupTaxonomyItem.value,
    belopprader.value,
  ),
);
</script>

<template>
  <table
    v-if="belopprader.length > 0"
    :class="{ [`num-columns-${forandringarTable.columnNames.length}`]: true }"
    class="forandringar-table"
  >
    <thead>
      <tr>
        <th scope="col">
          <BaseRenderBeloppradLevel1Header :taxonomy-item="groupTaxonomyItem" />
        </th>
        <th
          v-for="columnName in forandringarTable.columnNames"
          :key="columnName"
          class="value-container column-name"
          scope="col"
        >
          {{ columnName }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in forandringarTable.table" :key="rowIndex">
        <td>
          {{ forandringarTable.rowNames[rowIndex] }}
        </td>
        <td
          v-for="(cell, columnIndex) in row"
          :key="columnIndex"
          class="value-container"
        >
          <template v-if="cell != null">
            <RenderBeloppradCellComparable
              :additional-ixbrl-attrs="{}"
              :belopprad="cell.belopprad"
              :display-format="BeloppFormat.HELTAL"
              :taxonomy-item="cell.taxonomyItem"
              :year-index="0"
            />
          </template>
          <template v-else>&ndash;</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.forandringar-table {
  &.num-columns-6 {
    font-size: 0.85rem;
    :deep(.value-container) {
      min-width: 85px !important;
    }
  }

  &.num-columns-7 {
    font-size: 0.7rem;
    :deep(.value-container) {
      min-width: 70px !important;
    }
  }

  &.num-columns-8 {
    font-size: 0.62rem;
    :deep(.value-container) {
      min-width: 62px !important;
    }
  }

  &.num-columns-9 {
    // Maxantal
    font-size: 0.55rem;
    :deep(.value-container) {
      min-width: 55px !important;
    }
  }

  th.column-name {
    white-space: collapse !important;
  }
}
</style>
