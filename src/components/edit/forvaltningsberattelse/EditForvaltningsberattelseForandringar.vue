<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { deleteBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";
import { getForandringarAsTable } from "@/util/forandringarUtils.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
}>();

const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

const groupTaxonomyItem = computed(() =>
  props.taxonomyManager.getItem("se-gen-base:ForandringEgetKapitalAbstract"),
);

const belopprader = computed(() =>
  arsredovisning.value.forvaltningsberattelse.filter((belopprad) =>
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
  <table>
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
          <template v-if="cell != null">
            <input
              v-model.trim="cell.belopprad.beloppNuvarandeAr"
              type="text"
            />
            <BaseEditBeloppradDeleteButton
              :delete-callback="
                () =>
                  deleteBelopprad(
                    taxonomyManager,
                    cell.belopprad,
                    arsredovisning.forvaltningsberattelse,
                  )
              "
            />
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped></style>
