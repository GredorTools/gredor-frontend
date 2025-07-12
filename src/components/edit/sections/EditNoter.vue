<script lang="ts" setup>
/**
 * En komponent för att redigera noter i årsredovisningen.
 * Visar noter grupperade efter typ och tillåter användaren att lägga till, redigera och ta bort noter.
 */

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
import { getValueColumnHeaderCell } from "@/util/noterUtils.ts";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);
const availableTaxonomyItems = taxonomyManager.getRoot();

// Data
/** Årsredovisningen som innehåller noterna. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

// Hjälpfunktioner
function addBelopprad(taxonomyItem: TaxonomyItem) {
  createBeloppradInList(
    taxonomyManager,
    arsredovisning.value.noter,
    taxonomyItem,
  );
}
</script>

<template>
  <template
    v-for="(group, groupIndex) in [
      availableTaxonomyItems.children[0].children[0],
      ...availableTaxonomyItems.children[0].children
        .slice(1)
        .flatMap((c) => c.children),
    ]"
    :key="groupIndex"
  >
    <table>
      <thead>
        <tr>
          <th scope="col">{{ group.additionalData.displayLabel }}</th>
          <component
            :is="
              getValueColumnHeaderCell(
                group,
                arsredovisning.verksamhetsarNuvarande,
              )
            "
          />
          <component
            :is="
              getValueColumnHeaderCell(
                group,
                arsredovisning.verksamhetsarTidigare[0],
              )
            "
            v-if="arsredovisning.verksamhetsarTidigare.length > 0"
          />
          <th scope="col"><!-- Ta bort-knapp --></th>
        </tr>
      </thead>
      <tbody>
        <EditBelopprad
          v-for="[index, belopprad] in [
            ...arsredovisning.noter.entries(),
          ].filter(([, b]) =>
            isBeloppradInTaxonomyItemList([group, ...group.childrenFlat], b),
          )"
          :key="belopprad.taxonomyItemName"
          v-model:belopprad="arsredovisning.noter[index]"
          v-model:belopprader="arsredovisning.noter"
          :comparable-num-previous-years="
            Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
          "
          :string-minimum-level="1"
          :taxonomy-manager="taxonomyManager"
          string-multiline
          @delete="
            () =>
              deleteBelopprad(taxonomyManager, belopprad, arsredovisning.noter)
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
