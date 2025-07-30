<script lang="ts" setup>
/**
 * En komponent för att redigera förändringar i eget kapital i förvaltningsberättelsen.
 * Visar en tabell med kolumner för olika typer av eget kapital och rader för olika förändringar.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { getForandringarAsTable } from "@/util/forandringarUtils.ts";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt i förändringar i eget kapital. */
  taxonomyManager: TaxonomyManager;

  /** Taxonomiobjekt som representerar gruppen av nyckeltal som ska visas. */
  groupTaxonomyItem: TaxonomyItem;
}>();

/** Årsredovisningen som innehåller förvaltningsberättelsen med förändringar i eget kapital. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

const groupTaxonomyItemFull = computed(() =>
  props.taxonomyManager.getItemByCompleteInfo(
    "se-gen-base:ForandringEgetKapitalAbstract",
  ),
);
const { prepopulateSection } = usePrepopulateSection({
  taxonomyManager: props.taxonomyManager,
  availableTaxonomyItems: props.groupTaxonomyItem,
  arsredovisning: arsredovisning,
  sectionName: "forvaltningsberattelse",
  maxNumPreviousYears: 0,
});

const belopprader = prepopulateSection();

const forandringarTable = computed(() =>
  getForandringarAsTable(
    props.taxonomyManager,
    groupTaxonomyItemFull.value,
    belopprader.value,
  ),
);
</script>

<template>
  <table class="edit-forandringar-table">
    <thead>
      <tr>
        <th></th>
        <th
          v-for="columnName in forandringarTable.columnNames"
          :key="columnName"
          class="value-container"
          scope="col"
        >
          {{ columnName }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in forandringarTable.table" :key="rowIndex">
        <td>
          <div class="row-label">
            {{ forandringarTable.rowNames[rowIndex] }}
          </div>
        </td>
        <td
          v-for="(cell, columnIndex) in row"
          :key="columnIndex"
          :class="{ 'empty-container': cell == null }"
          class="value-container"
        >
          <div v-if="cell != null" class="value-contents">
            <input
              v-model.trim="cell.belopprad.beloppNuvarandeAr"
              class="form-control"
              type="text"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
@import "@/assets/extendables.scss";

@mixin auto-font-sizes {
  @media (max-width: 1500px) {
    font-size: 0.7rem;
  }

  @media (min-width: 1500px) and (max-width: 1700px) {
    font-size: 0.8rem;
  }

  @media (min-width: 1700px) and (max-width: 1900px) {
    font-size: 0.9rem;
  }
}

table.edit-forandringar-table {
  width: min-content;

  border-collapse: separate;
  border-spacing: 0;

  thead {
    position: sticky;
    top: -1rem;
    background: white;
  }

  th,
  td {
    @include auto-font-sizes;

    border: 1px solid lightgray;

    &:not(:last-child) {
      border-right: none;
    }
  }

  tr:not(:last-child) {
    td {
      border-bottom: none;
    }
  }

  th {
    padding-left: 1rem;
    border-bottom-width: 4px;
  }

  td {
    .row-label {
      width: max-content;
    }

    &.value-container {
      &.empty-container {
        background: lightgray;
      }

      .value-contents input {
        width: 100%;

        &.form-control {
          @extend %text-input;
          @include auto-font-sizes;

          @media (max-width: 1500px) {
            min-width: 80px;
          }

          @media (min-width: 1500px) and (max-width: 1700px) {
            min-width: 100px;
          }

          padding: 0.25rem 0.5rem;
        }
      }
    }
  }
}
</style>
