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
  TaxonomyRootName.BALANSRAKNING,
);
const taxonomyItemsFromData = taxonomyManager.getRoot();

// Data
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
const beloppItemToAdd = ref<TaxonomyItem | null>(null);

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
        taxonomyItemsFromData.children[0].children[0],
        taxonomyItemsFromData.children[0].children[1],
      ],
      [
        taxonomyItemsFromData.children[0].children[2],
        taxonomyItemsFromData.children[0].children[3],
      ],
    ]"
    :key="groupIndex"
  >
    <table>
      <thead>
        <tr>
          <th scope="col">{{ group[0].additionalData.displayLabel }}</th>
          <th scope="col">Eget namn</th>
          <th scope="col">Not</th>
          <th scope="col">
            {{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
          </th>
          <th scope="col">
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
            [...group[0].childrenFlat, group[1]].some(
              (groupMember) => groupMember.xmlName === b.taxonomyItemName,
            ),
          )"
          :key="belopprad.taxonomyItemName"
          v-model:belopprad="arsredovisning.balansrakning[index]"
          v-model:belopprader="arsredovisning.balansrakning"
          :delete-callback="
            () =>
              deleteBelopprad(
                taxonomyManager,
                belopprad,
                arsredovisning.balansrakning,
              )
          "
          :taxonomy-manager="taxonomyManager"
        />
      </tbody>
    </table>

    <select v-model="beloppItemToAdd" class="form-select">
      <option
        v-for="taxonomyItem in [...group[0].childrenFlat, group[1]]"
        :key="taxonomyItem.xmlName"
        :disabled="taxonomyItem.properties.abstract === 'true'"
        :value="taxonomyItem"
      >
        {{
          "\u00a0".repeat((taxonomyItem.level - 1) * 4) +
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
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  margin-bottom: 1rem;

  th,
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
