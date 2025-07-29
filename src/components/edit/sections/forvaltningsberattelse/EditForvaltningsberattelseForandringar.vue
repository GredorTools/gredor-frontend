<script lang="ts" setup>
/**
 * En komponent för att redigera förändringar i eget kapital i förvaltningsberättelsen.
 * Visar en tabell med kolumner för olika typer av eget kapital och rader för olika förändringar.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import {
  createBelopprad,
  createBeloppradInList,
  deleteBelopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import BaseEditBeloppradDeleteButton from "@/components/edit/blocks/belopprad/BaseEditBeloppradDeleteButton.vue";
import { getForandringarAsTable } from "@/util/forandringarUtils.ts";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

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

const belopprader = computed(() =>
  arsredovisning.value.forvaltningsberattelse.filter((belopprad) =>
    isBeloppradInTaxonomyItemList(
      groupTaxonomyItemFull.value.childrenFlat,
      belopprad,
    ),
  ),
);

const forandringarTable = computed(() =>
  getForandringarAsTable(
    props.taxonomyManager,
    groupTaxonomyItemFull.value,
    belopprader.value,
  ),
);

const overgangK2AbstractItem = props.taxonomyManager.getItemByName(
  "se-gen-base:ForandringIngaendeEgetKapitalOvergangK2Abstract",
);

// Hjälpfunktioner
function addBelopprad(taxonomyItem: TaxonomyItem) {
  createBeloppradInList(
    props.taxonomyManager,
    arsredovisning.value.forvaltningsberattelse,
    taxonomyItem,
  );
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <BaseEditBeloppradTitle
            :belopprad="createBelopprad(groupTaxonomyItem)"
            :taxonomy-manager="taxonomyManager"
          />
        </th>
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
          {{ forandringarTable.rowNames[rowIndex] }}
        </td>
        <td
          v-for="(cell, columnIndex) in row"
          :key="columnIndex"
          class="value-container"
        >
          <div v-if="cell != null" class="value-contents">
            <input
              v-model.trim="cell.belopprad.beloppNuvarandeAr"
              class="form-control"
              type="text"
            />
            <BaseEditBeloppradDeleteButton
              @delete="
                () =>
                  deleteBelopprad(
                    taxonomyManager,
                    cell.belopprad,
                    arsredovisning.forvaltningsberattelse,
                  )
              "
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!--
  Vi vill inte ha med "Specifikation av förändringar i ingående eget kapital vid övergång till K2",
  det är extremt osannolikt att någon kommer ha nytta av den numera så det skräpar bara ner.
  -->
  <EditItemSelector
    :taxonomy-items="[
      groupTaxonomyItemFull,
      ...groupTaxonomyItemFull.childrenFlat.filter(
        (child) =>
          child.xmlName !== overgangK2AbstractItem.xmlName &&
          !overgangK2AbstractItem.childrenFlat.includes(child),
      ),
    ]"
    @add-belopprad="addBelopprad"
  />
</template>

<style lang="scss" scoped>
@import "@/assets/extendables.scss";

.value-contents {
  display: flex;

  input {
    flex: 1;
    margin-right: 0.25rem;
    min-width: 100px !important;

    &.form-control {
      @extend %text-input;

      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
}
</style>
