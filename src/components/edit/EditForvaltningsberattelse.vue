<script lang="ts" setup>
import { ref } from "vue";
import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/EditBelopprad.vue";
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
import EditForvaltningsberattelseFlerarsoversikt from "@/components/edit/forvaltningsberattelse/EditForvaltningsberattelseFlerarsoversikt.vue";
import EditForvaltningsberattelseForandringar from "@/components/edit/forvaltningsberattelse/EditForvaltningsberattelseForandringar.vue";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
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
    arsredovisning.value.forvaltningsberattelse,
    taxonomyItem,
  );
}
</script>

<template>
  <h3>Förvaltningsberättelse</h3>
  <template
    v-for="(group, groupIndex) in availableTaxonomyItems.children[0].children"
    :key="groupIndex"
  >
    <EditForvaltningsberattelseFlerarsoversikt
      v-if="group.xmlName === 'se-gen-base:Flerarsoversikt'"
      :arsredovisning="arsredovisning"
      :group-taxonomy-item="
        availableTaxonomyItems.childrenFlat.find(
          (item) => item.xmlName === 'se-gen-base:Flerarsoversikt',
        )!
      "
      :taxonomy-manager="taxonomyManager"
    />
    <EditForvaltningsberattelseForandringar
      v-else-if="group.xmlName === 'se-gen-base:ForandringEgetKapital'"
      :arsredovisning="arsredovisning"
      :taxonomy-manager="taxonomyManager"
    />
    <table v-else>
      <thead>
        <tr>
          <th scope="col">{{ group.additionalData.displayLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <EditBelopprad
          v-for="[index, belopprad] in [
            ...arsredovisning.forvaltningsberattelse.entries(),
          ].filter(([, b]) =>
            isBeloppradInTaxonomyItemList([group, ...group.childrenFlat], b),
          )"
          :key="belopprad.taxonomyItemName"
          v-model:belopprad="arsredovisning.forvaltningsberattelse[index]"
          v-model:belopprader="arsredovisning.forvaltningsberattelse"
          :comparable-num-previous-years="0"
          :delete-callback="
            () =>
              deleteBelopprad(
                taxonomyManager,
                belopprad,
                arsredovisning.forvaltningsberattelse,
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

    &.not-container {
      min-width: 40px;
    }

    &.value-container {
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
