<script lang="ts" setup>
/**
 * En komponent för att redigera förvaltningsberättelsen i årsredovisningen.
 * Visar olika delar av förvaltningsberättelsen som flerårsöversikt, förändringar i eget kapital och resultatdisposition.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import {
  createBelopprad,
  createBeloppradInList,
  deleteBelopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import {
  getTaxonomyManager,
  type TaxonomyItem,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import EditForvaltningsberattelseFlerarsoversikt from "@/components/edit/sections/forvaltningsberattelse/EditForvaltningsberattelseFlerarsoversikt.vue";
import EditForvaltningsberattelseForandringar from "@/components/edit/sections/forvaltningsberattelse/EditForvaltningsberattelseForandringar.vue";
import EditItemSelector from "@/components/edit/blocks/EditItemSelector.vue";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

const overgangK2AbstractItem = taxonomyManager.getItemByName(
  "se-gen-base:ForandringIngaendeEgetKapitalOvergangK2Abstract",
);

// Data
/** Årsredovisningen som innehåller förvaltningsberättelsen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

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
      :group-taxonomy-item="
        availableTaxonomyItems.childrenFlat.find(
          (item) => item.xmlName === 'se-gen-base:ForandringEgetKapital',
        )!
      "
      :taxonomy-manager="taxonomyManager"
    />
    <table v-else>
      <thead>
        <tr>
          <th scope="col">
            <BaseEditBeloppradTitle
              :belopprad="createBelopprad(group)"
              :taxonomy-manager="taxonomyManager"
            />
          </th>
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
          :taxonomy-manager="taxonomyManager"
          string-multiline
          @delete="
            () =>
              deleteBelopprad(
                taxonomyManager,
                belopprad,
                arsredovisning.forvaltningsberattelse,
              )
          "
        />
      </tbody>
    </table>

    <!--
    Vi vill inte ha med "Specifikation av förändringar i ingående eget kapital vid övergång till K2",
    det är extremt osannolikt att någon kommer ha nytta av den numera så det skräpar bara ner.
    -->
    <EditItemSelector
      :taxonomy-items="[
        group,
        ...group.childrenFlat.filter(
          (child) =>
            child.xmlName !== overgangK2AbstractItem.xmlName &&
            !overgangK2AbstractItem.childrenFlat.includes(child),
        ),
      ]"
      @add-belopprad="addBelopprad"
    />
  </template>
</template>

<style lang="scss" scoped></style>
