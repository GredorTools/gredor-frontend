<script lang="ts" setup>
/**
 * En komponent för att redigera flerårsöversikten i förvaltningsberättelsen.
 * Visar en tabell med nyckeltal för nuvarande och tidigare räkenskapsår.
 */

import {
  createBelopprad,
  deleteBelopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { type TaxonomyItem, TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { formatDateForFlerarsoversikt } from "@/util/formatUtils.ts";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";

defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt i flerårsöversikten. */
  taxonomyManager: TaxonomyManager;

  /** Taxonomiobjekt som representerar gruppen av nyckeltal som ska visas. */
  groupTaxonomyItem: TaxonomyItem;
}>();

/** Årsredovisningen som innehåller förvaltningsberättelsen med flerårsöversikt. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <BaseEditBeloppradTitle
            :belopprad="createBelopprad(groupTaxonomyItem)"
            :taxonomy-manager="taxonomyManager"
          />
        </th>
        <th class="value-container" scope="col">
          {{
            formatDateForFlerarsoversikt(
              arsredovisning.verksamhetsarNuvarande.slutdatum,
            )
          }}
        </th>
        <th
          v-for="previousYearIndex in arsredovisning.verksamhetsarTidigare
            .length"
          :key="previousYearIndex"
          class="value-container"
          scope="col"
        >
          {{
            formatDateForFlerarsoversikt(
              arsredovisning.verksamhetsarTidigare[previousYearIndex - 1]
                .slutdatum,
            )
          }}
        </th>
        <th scope="col"><!-- Ta bort-knapp --></th>
      </tr>
    </thead>
    <tbody>
      <EditBelopprad
        v-for="[index, belopprad] in [
          ...arsredovisning.forvaltningsberattelse.entries(),
        ].filter(([, b]) =>
          isBeloppradInTaxonomyItemList(
            [groupTaxonomyItem, ...groupTaxonomyItem.childrenFlat],
            b,
          ),
        )"
        :key="belopprad.taxonomyItemName"
        v-model:belopprad="arsredovisning.forvaltningsberattelse[index]"
        v-model:belopprader="arsredovisning.forvaltningsberattelse"
        :comparable-num-previous-years="
          Math.min(arsredovisning.verksamhetsarTidigare.length, 3)
        "
        :string-minimum-level="1"
        :taxonomy-manager="taxonomyManager"
        allow-delete
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
</template>

<style lang="scss" scoped></style>
