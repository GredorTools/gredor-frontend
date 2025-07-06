<script lang="ts" setup>
/**
 * En komponent för att rendera resultaträkningen i årsredovisningen.
 * Visar intäkter och kostnader i tabellformat med jämförelsetal för föregående år.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/blocks/RenderBelopprad.vue";
import {
  getTaxonomyManager,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";

const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
);

defineProps<{
  /** Årsredovisningen som innehåller resultaträkningen. */
  arsredovisning: Arsredovisning;
}>();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col"><h2>Resultaträkning</h2></th>
        <th class="not-container" scope="col">Not</th>
        <th class="value-container" scope="col">
          {{ arsredovisning.verksamhetsarNuvarande.startdatum }}<br />
          –{{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
        </th>
        <th
          v-if="arsredovisning.verksamhetsarTidigare.length > 0"
          class="value-container"
          scope="col"
        >
          {{ arsredovisning.verksamhetsarTidigare[0].startdatum }}<br />
          –{{ arsredovisning.verksamhetsarTidigare[0].slutdatum }}
        </th>
      </tr>
    </thead>
    <tbody>
      <RenderBelopprad
        v-for="belopprad in arsredovisning.resultatrakning.filter((b) => {
          const taxonomyItem = getTaxonomyItemForBelopprad(taxonomyManager, b);
          return (
            taxonomyItem.level > 1 ||
            taxonomyItem.properties.abstract !== 'true'
          );
        })"
        :key="belopprad.taxonomyItemName"
        :belopprad="belopprad"
        :comparable-num-previous-years="
          Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
        "
        :taxonomy-manager="taxonomyManager"
        comparable-allow-not
        monetary-show-balance-sign
        string-show-header
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  margin-bottom: 1rem;
}
</style>
