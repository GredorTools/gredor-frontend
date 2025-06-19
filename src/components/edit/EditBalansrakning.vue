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
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.BALANSRAKNING,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

// Data
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

// Hjälpfunktioner
function addBelopprad(taxonomyItem: TaxonomyItem) {
  createBeloppradInList(
    taxonomyManager,
    arsredovisning.value.balansrakning,
    taxonomyItem,
  );
}
</script>

<template>
  <h3>Balansräkning</h3>
  <template
    v-for="(group, groupIndex) in [
      [
        availableTaxonomyItems.children[0].children[0],
        availableTaxonomyItems.children[0].children[1],
      ],
      [
        availableTaxonomyItems.children[0].children[2],
        availableTaxonomyItems.children[0].children[3],
      ],
    ]"
    :key="groupIndex"
  >
    <table>
      <thead>
        <tr>
          <th scope="col">{{ group[0].additionalData.displayLabel }}</th>
          <th class="not-container" scope="col">Not</th>
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
            ...arsredovisning.balansrakning.entries(),
          ].filter(([, b]) =>
            isBeloppradInTaxonomyItemList(
              [...group[0].childrenFlat, group[1]],
              b,
            ),
          )"
          :key="belopprad.taxonomyItemName"
          v-model:belopprad="arsredovisning.balansrakning[index]"
          v-model:belopprader="arsredovisning.balansrakning"
          :comparable-num-previous-years="
            Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
          "
          :taxonomy-manager="taxonomyManager"
          comparable-allow-not
          @delete="
            () =>
              deleteBelopprad(
                taxonomyManager,
                belopprad,
                arsredovisning.balansrakning,
              )
          "
        />
      </tbody>
    </table>

    <EditItemSelector
      :taxonomy-items="[...group[0].childrenFlat, group[1]]"
      @add-belopprad="addBelopprad"
    />
  </template>
</template>

<style lang="scss" scoped></style>
