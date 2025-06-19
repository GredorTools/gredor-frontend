<script lang="ts" setup>
import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import {
  createBeloppradInList,
  deleteBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import {
  getTaxonomyManager,
  type TaxonomyItem,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import EditItemSelector from "@/components/edit/blocks/EditItemSelector.vue";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
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
    arsredovisning.value.resultatrakning,
    taxonomyItem,
    ["se-gen-base:FinansiellaPoster", "se-gen-base:Bokslutsdispositioner"],
  );
}
</script>

<template>
  <h3>Resultaträkning</h3>
  <table>
    <thead>
      <tr>
        <th scope="col"></th>
        <th class="not-container" scope="col">Not</th>
        <th class="value-container" scope="col">
          {{ arsredovisning.verksamhetsarNuvarande.startdatum }}<br />
          –{{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
        </th>
        <th
          v-if="arsredovisning.verksamhetsarTidigare.length > 0"
          class="value-container"
          scope="col"
        >
          {{ arsredovisning.verksamhetsarTidigare[0].startdatum }}<br />
          –{{ arsredovisning.verksamhetsarTidigare[0].slutdatum }}
        </th>
        <th scope="col"><!-- Ta bort-knapp --></th>
      </tr>
    </thead>
    <tbody>
      <EditBelopprad
        v-for="(belopprad, index) in arsredovisning.resultatrakning"
        :key="belopprad.taxonomyItemName"
        v-model:belopprad="arsredovisning.resultatrakning[index]"
        v-model:belopprader="arsredovisning.resultatrakning"
        :comparable-num-previous-years="
          Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
        "
        :taxonomy-manager="taxonomyManager"
        comparable-allow-not
        monetary-show-balance-sign
        @delete="
          () =>
            deleteBelopprad(
              taxonomyManager,
              belopprad,
              arsredovisning.resultatrakning,
            )
        "
      />
    </tbody>
  </table>

  <EditItemSelector
    :taxonomy-items="availableTaxonomyItems.childrenFlat"
    @add-belopprad="addBelopprad"
  />
</template>

<style lang="scss" scoped></style>
