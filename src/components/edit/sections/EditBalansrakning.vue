<script lang="ts" setup>
/**
 * En komponent för att redigera balansräkningen i årsredovisningen.
 * Visar tillgångar och skulder i tabellformat med möjlighet att lägga till, redigera och ta bort belopprader.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import {
  type Belopprad,
  createBelopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import {
  getTaxonomyManager,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";
import { computed } from "vue";

const maxNumPreviousYears = 1;

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.BALANSRAKNING,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

// Data
/** Årsredovisningen som innehåller balansräkningen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

// Förpopulera rader
const { prepopulateSection } = usePrepopulateSection({
  taxonomyManager,
  availableTaxonomyItems,
  arsredovisning: arsredovisning,
  sectionName: "balansrakning",
  maxNumPreviousYears,
});
const belopprader = prepopulateSection();

const groups = [
  [
    ...availableTaxonomyItems.children[0].children[0].childrenFlat,
    availableTaxonomyItems.children[0].children[1],
  ],
  [
    ...availableTaxonomyItems.children[0].children[2].childrenFlat,
    availableTaxonomyItems.children[0].children[3],
  ],
];

const groupedBelopprader = computed(() =>
  belopprader.value.reduce(
    (result: Belopprad[][], belopprad: Belopprad) => {
      let groupIndex = -1;

      for (let i = 0; i < groups.length; i++) {
        if (isBeloppradInTaxonomyItemList(groups[i], belopprad)) {
          groupIndex = i;
          break;
        }
      }

      if (groupIndex > -1) {
        result[groupIndex].push(belopprad);
      }

      return result;
    },
    [[], []],
  ),
);
</script>

<template>
  <template v-for="(group, groupIndex) in groups" :key="groupIndex">
    <table>
      <thead>
        <tr>
          <th scope="col">
            <BaseEditBeloppradTitle
              v-if="group[0].parent"
              :belopprad="createBelopprad(group[0].parent)"
              :taxonomy-manager="taxonomyManager"
            />
          </th>
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
          v-for="(belopprad, index) in groupedBelopprader[groupIndex]"
          :key="belopprad.taxonomyItemName"
          v-model:belopprad="groupedBelopprader[groupIndex][index]"
          v-model:belopprader="groupedBelopprader[groupIndex]"
          :comparable-num-previous-years="
            Math.min(
              arsredovisning.verksamhetsarTidigare.length,
              maxNumPreviousYears,
            )
          "
          :taxonomy-manager="taxonomyManager"
          comparable-allow-not
        />
      </tbody>
    </table>
  </template>
</template>

<style lang="scss" scoped></style>
