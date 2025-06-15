<script lang="ts" setup>
import { ref } from "vue";
import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/EditBelopprad.vue";
import {
  createBeloppradInList,
  deleteBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import {
  getTaxonomyManager,
  type TaxonomyItem,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

// Data
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
const beloppItemToAdd = ref<TaxonomyItem | null>(null);

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
        :delete-callback="
          () =>
            deleteBelopprad(
              taxonomyManager,
              belopprad,
              arsredovisning.resultatrakning,
            )
        "
        :taxonomy-manager="taxonomyManager"
        comparable-allow-not
        monetary-show-balance-sign
      />
    </tbody>
  </table>

  <select v-model="beloppItemToAdd" class="form-select">
    <option
      v-for="taxonomyItem in availableTaxonomyItems.childrenFlat"
      :key="taxonomyItem.xmlName"
      :disabled="taxonomyItem.properties.abstract === 'true'"
      :value="taxonomyItem"
    >
      {{
        "\u00a0".repeat(taxonomyItem.level * 4) +
        taxonomyItem.additionalData.displayLabel
      }}
    </option>
  </select>
  <button
    :disabled="beloppItemToAdd === null"
    @click="beloppItemToAdd != null && addBelopprad(beloppItemToAdd)"
  >
    Lägg till rad
  </button>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  margin-bottom: 1rem;

  &:deep(th),
  &:deep(td) {
    border-style: hidden;
    text-align: left;
    padding: 0.25rem 0.5rem;

    &:first-child {
      width: 99%;
    }

    &:not(:first-child) {
      white-space: nowrap;
    }

    &:nth-child(2) {
      min-width: 40px;
    }

    &:nth-child(3),
    &:nth-child(4) {
      text-align: right;
      min-width: 100px;

      input {
        text-align: right;
      }
    }

    input {
      width: 100%;
    }
  }
}
</style>
