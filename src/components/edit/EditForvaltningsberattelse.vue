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
import EditForvaltningsberattelseFlerarsoversikt from "@/components/edit/forvaltningsberattelse/EditForvaltningsberattelseFlerarsoversikt.vue";
import EditForvaltningsberattelseForandringar from "@/components/edit/forvaltningsberattelse/EditForvaltningsberattelseForandringar.vue";
import EditItemSelector from "@/components/edit/blocks/EditItemSelector.vue";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
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

    <EditItemSelector
      :taxonomy-items="[group, ...group.childrenFlat]"
      @add-belopprad="addBelopprad"
    />
  </template>
</template>

<style lang="scss" scoped></style>
