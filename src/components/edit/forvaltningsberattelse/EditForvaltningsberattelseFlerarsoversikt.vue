<script lang="ts" setup>
import {
  deleteBelopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { type TaxonomyItem, TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { FormatUtil } from "../../../util/FormatUtil.ts";

defineProps<{
  taxonomyManager: TaxonomyManager;
  groupTaxonomyItem: TaxonomyItem;
}>();

const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col">
          {{ groupTaxonomyItem.additionalData.displayLabel }}
        </th>
        <th class="value-container" scope="col">
          {{
            FormatUtil.formatDateForFlerarsoversikt(
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
            FormatUtil.formatDateForFlerarsoversikt(
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
        :taxonomy-manager="taxonomyManager"
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
