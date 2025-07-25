<script lang="ts" setup>
/**
 * En komponent för att rendera balansräkningen i årsredovisningen.
 * Visar tillgångar och skulder i tabellformat med jämförelsetal för föregående år.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/blocks/RenderBelopprad.vue";
import {
  getTaxonomyManager,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";

const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.BALANSRAKNING,
);

defineProps<{
  /** Årsredovisningen som innehåller balansräkningen. */
  arsredovisning: Arsredovisning;
}>();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col"><h2>Balansräkning</h2></th>
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
      </tr>
    </thead>
    <tbody>
      <RenderBelopprad
        v-for="belopprad in arsredovisning.balansrakning"
        :key="belopprad.taxonomyItemName"
        :belopprad="belopprad"
        :comparable-num-previous-years="
          Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
        "
        :taxonomy-manager="taxonomyManager"
        comparable-allow-not
        string-show-header
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  th {
    padding-bottom: 1.5rem !important;
  }
}
</style>
