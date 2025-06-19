<script lang="ts" setup>
import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import {
  createBeloppradInList,
  deleteBelopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import {
  getTaxonomyManager,
  type TaxonomyItem,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import EditItemSelector from "@/components/edit/blocks/EditItemSelector.vue";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);
const availableTaxonomyItems = taxonomyManager.getRoot();

// Data
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

// Hjälpfunktioner
function addBelopprad(taxonomyItem: TaxonomyItem) {
  createBeloppradInList(
    taxonomyManager,
    arsredovisning.value.noter,
    taxonomyItem,
  );
}
</script>

<template>
  <h3>Noter</h3>
  <template
    v-for="(
      group, groupIndex
    ) in availableTaxonomyItems.children[0].children.flatMap((c) => c.children)"
    :key="groupIndex"
  >
    <table>
      <thead>
        <tr>
          <th scope="col">{{ group.additionalData.displayLabel }}</th>
          <th class="value-container" scope="col">
            {{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
          </th>
          <th
            v-if="arsredovisning.verksamhetsarTidigare.length > 0"
            class="value-container"
            scope="col"
          >
            {{ arsredovisning.verksamhetsarTidigare[0].slutdatum }}
          </th>
          <th scope="col"><!-- Ta bort-knapp --></th>
        </tr>
      </thead>
      <tbody>
        <EditBelopprad
          v-for="[index, belopprad] in [
            ...arsredovisning.noter.entries(),
          ].filter(([, b]) =>
            isBeloppradInTaxonomyItemList([group, ...group.childrenFlat], b),
          )"
          :key="belopprad.taxonomyItemName"
          v-model:belopprad="arsredovisning.noter[index]"
          v-model:belopprader="arsredovisning.noter"
          :comparable-num-previous-years="
            Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
          "
          :delete-callback="
            () =>
              deleteBelopprad(taxonomyManager, belopprad, arsredovisning.noter)
          "
          :taxonomy-manager="taxonomyManager"
          string-multiline
        />
      </tbody>
    </table>

    <EditItemSelector
      :taxonomy-items="[group, ...group.childrenFlat]"
      @add-belopprad="addBelopprad"
    />
  </template>
</template>

<style lang="scss" scoped></style>
