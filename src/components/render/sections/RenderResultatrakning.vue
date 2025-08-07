<script lang="ts" setup>
/**
 * En komponent för att rendera resultaträkningen i årsredovisningen.
 * Visar intäkter och kostnader i tabellformat med jämförelsetal för föregående år.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/blocks/RenderBelopprad.vue";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";

const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
);

defineProps<{
  /** Årsredovisningen som innehåller resultaträkningen. */
  arsredovisning: Arsredovisning;
}>();

function getDisplayAsLevelForBelopprad(
  belopprad: Belopprad,
): number | undefined {
  if (belopprad.type === "xbrli:stringItemType") {
    // Alla rubriker ska se likadana ut
    return 2;
  }

  if (
    [
      "se-gen-base:FinansiellaPoster",
      "se-gen-base:Bokslutsdispositioner",
    ].includes(belopprad.taxonomyItemName)
  ) {
    // Dessa summarader ska renderas som nivå 2-belopprader för att se bra ut
    // (de ska se ut som summaraderna för rörelseintäker och röreleskostnader)
    return 2;
  }

  return undefined; // Låt RenderBelopprad bestämma baserat på egentliga nivån
}
</script>

<template>
  <div>
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
            return ![
              // Dessa vill vi inte ska renderas
              'se-gen-base:RorelseresultatAbstract',
              'se-gen-base:SkatterAbstract',
            ].includes(b.taxonomyItemName);
          })"
          :key="belopprad.taxonomyItemName"
          :belopprad="belopprad"
          :comparable-num-previous-years="
            Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
          "
          :display-as-level="getDisplayAsLevelForBelopprad(belopprad)"
          :taxonomy-manager="taxonomyManager"
          comparable-allow-not
          monetary-show-balance-sign
          string-show-header
        />
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
table {
  margin-bottom: 1rem;

  th {
    padding-bottom: 1.5rem !important;
  }
}
</style>
