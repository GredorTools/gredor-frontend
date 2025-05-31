<script lang="ts" setup>
import { ref } from "vue";
import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";
import EditBelopprad from "@/components/edit/EditBelopprad.vue";
import {
  createBelopprad,
  deleteBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";

const arsredovsining = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

const taxonomyItemsFromData: TaxonomyItem<TaxonomyItemType>[] = await (
  await fetch("data/taxonomy/k2/2021-10-31/Kostnadsslagsindelad resultatr.json")
).json();

const beloppItemToAdd = ref<TaxonomyItem<TaxonomyItemType> | null>(null);

function addBelopprad(
  taxonomyItem: TaxonomyItem<TaxonomyItemType>,
  sort: boolean = true,
) {
  if (
    arsredovsining.value.resultatrakning.some(
      (belopprad) => belopprad.taxonomyItem.id === taxonomyItem.id,
    )
  ) {
    // Finns redan
    return;
  }

  arsredovsining.value.resultatrakning.push(createBelopprad(taxonomyItem));

  if (taxonomyItem.__ParentId != null) {
    for (const possibleParentTaxonomyItem of taxonomyItemsFromData) {
      if (
        possibleParentTaxonomyItem.__Level > 0 &&
        possibleParentTaxonomyItem.id === taxonomyItem.__ParentId
      ) {
        addBelopprad(possibleParentTaxonomyItem, false);
      }
    }
  }

  if (sort) {
    arsredovsining.value.resultatrakning.sort(
      (a, b) =>
        parseInt(a.taxonomyItem.rowNumber, 10) -
        parseInt(b.taxonomyItem.rowNumber, 10),
    );
  }
}
</script>

<template>
  <h3>Resultaträkning</h3>
  <table>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Eget namn</th>
        <th scope="col">Not</th>
        <th scope="col">
          {{ arsredovsining.verksamhetsarNuvarande.startdatum }}<br />
          –{{ arsredovsining.verksamhetsarNuvarande.slutdatum }}
        </th>
        <th scope="col">
          {{ arsredovsining.verksamhetsarTidigare[0].startdatum }}<br />
          –{{ arsredovsining.verksamhetsarTidigare[0].slutdatum }}
        </th>
        <th scope="col"><!-- Ta bort-knapp --></th>
      </tr>
    </thead>
    <tbody>
      <EditBelopprad
        v-for="(belopprad, index) in arsredovsining.resultatrakning"
        :key="belopprad.taxonomyItem.id"
        v-model:belopprad="arsredovsining.resultatrakning[index]"
        :delete-callback="
          () => deleteBelopprad(belopprad, arsredovsining.resultatrakning)
        "
        monetary-show-saldo
      />
    </tbody>
  </table>

  <select v-model="beloppItemToAdd">
    <option
      v-for="taxonomyItem in taxonomyItemsFromData"
      :key="taxonomyItem.id"
      :disabled="taxonomyItem.abstrakt === 'true'"
      :value="taxonomyItem"
    >
      {{ "\u00a0".repeat(taxonomyItem.__Level * 4) + taxonomyItem.radrubrik }}
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
  width: 800px;
  margin-bottom: 1rem;

  th,
  &:deep(td) {
    text-align: left;
    padding: 0.25rem 0.5rem;

    &:first-child {
      width: 99%;
    }

    &:not(:first-child) {
      white-space: nowrap;
    }

    &:nth-child(2) {
      min-width: 120px;
    }

    &:nth-child(3) {
      min-width: 40px;
    }

    &:nth-child(4),
    &:nth-child(5) {
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
