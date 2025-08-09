<script lang="ts" setup>
/**
 * En komponent för att rendera flerårsöversikten i förvaltningsberättelsen.
 * Visar en tabell med nyckeltal för nuvarande och tidigare räkenskapsår.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/blocks/RenderBelopprad.vue";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { formatDateForFlerarsoversikt } from "@/util/formatUtils.ts";
import { isBeloppradInTaxonomyItemList } from "@/model/arsredovisning/Belopprad.ts";
import BaseRenderBeloppradLevel1Header from "@/components/render/blocks/belopprad/BaseRenderBeloppradLevel1Header.vue";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

defineProps<{
  /** Årsredovisningen som innehåller förvaltningsberättelsen med flerårsöversikt. */
  arsredovisning: Arsredovisning;

  /** Taxonomiobjekt som representerar gruppen av nyckeltal som ska visas. */
  groupTaxonomyItem: TaxonomyItem;

  /** TaxonomyManager för att hantera taxonomiobjekt i flerårsöversikten. */
  taxonomyManager: TaxonomyManager;
}>();
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th scope="col">
            <BaseRenderBeloppradLevel1Header
              :taxonomy-item="groupTaxonomyItem"
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
        </tr>
      </thead>
      <tbody>
        <RenderBelopprad
          v-for="[index, belopprad] in [
            ...arsredovisning.forvaltningsberattelse.entries(),
          ].filter(([, b]) =>
            isBeloppradInTaxonomyItemList(
              [groupTaxonomyItem, ...groupTaxonomyItem.childrenFlat],
              b,
            ),
          )"
          :key="belopprad.taxonomyItemName"
          :belopprad="belopprad"
          :comparable-num-previous-years="
            Math.min(arsredovisning.verksamhetsarTidigare.length, 3)
          "
          :display-format="arsredovisning.installningar.flerarsoversiktFormat"
          :taxonomy-manager="taxonomyManager"
        />
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>
