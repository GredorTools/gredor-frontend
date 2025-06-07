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
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
);
const taxonomyItemsFromData = taxonomyManager.getRoot();

// Data
const arsredovsining = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
const beloppItemToAdd = ref<TaxonomyItem | null>(null);

// Hjälpfunktioner
function addBelopprad(taxonomyItem: TaxonomyItem) {
  createBeloppradInList(
    taxonomyManager,
    arsredovsining.value.forvaltningsberattelse,
    taxonomyItem,
  );
}
</script>

<template>
  <h3>Förvaltningsberättelse</h3>
  <template
    v-for="(group, groupIndex) in taxonomyItemsFromData.children[0].children"
    :key="groupIndex"
  >
    <table>
      <thead>
        <tr>
          <th scope="col">{{ group.additionalData.displayLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <EditBelopprad
          v-for="[index, belopprad] in [
            ...arsredovsining.forvaltningsberattelse.entries(),
          ].filter(([, b]) =>
            [group, ...group.childrenFlat].some(
              (groupMember) => groupMember.xmlName === b.taxonomyItemName,
            ),
          )"
          :key="belopprad.taxonomyItemName"
          v-model:belopprad="arsredovsining.forvaltningsberattelse[index]"
          v-model:belopprader="arsredovsining.forvaltningsberattelse"
          :delete-callback="
            () =>
              deleteBelopprad(
                taxonomyManager,
                belopprad,
                arsredovsining.forvaltningsberattelse,
              )
          "
          :taxonomy-manager="taxonomyManager"
          string-multiline
        />
      </tbody>
    </table>

    <select v-model="beloppItemToAdd" class="form-select">
      <option
        v-for="taxonomyItem in [group, ...group.childrenFlat]"
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
