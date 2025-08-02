<script lang="ts" setup>
/**
 * En komponent för att redigera resultaträkningen i årsredovisningen.
 * Visar intäkter och kostnader i tabellformat med möjlighet att lägga till, redigera och ta bort belopprader.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";
import CommonAccordion from "@/components/common/CommonAccordion.vue";
import CommonAccordionItem from "@/components/common/CommonAccordionItem.vue";

const maxNumPreviousYears = 1;

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
);
const availableTaxonomyItems = taxonomyManager.getRoot().children[0];

// Data
/** Årsredovisningen som innehåller resultaträkningen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

// Förpopulering
const { prepopulateSection } = usePrepopulateSection({
  taxonomyManager,
  availableTaxonomyItems,
  arsredovisning: arsredovisning,
  sectionName: "resultatrakning",
  maxNumPreviousYears,
});
const belopprader = prepopulateSection();
</script>

<template>
  <CommonAccordion>
    <CommonAccordionItem id="resultatrakning-accordion" title="Resultaträkning">
      <table>
        <thead>
          <tr>
            <th scope="col"></th>
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
          <EditBelopprad
            v-for="(belopprad, index) in belopprader"
            :key="belopprad.taxonomyItemName"
            v-model:belopprad="belopprader[index]"
            v-model:belopprader="belopprader"
            :comparable-num-previous-years="
              Math.min(
                arsredovisning.verksamhetsarTidigare.length,
                maxNumPreviousYears,
              )
            "
            :taxonomy-manager="taxonomyManager"
            comparable-allow-not
            monetary-show-balance-sign
          />
        </tbody>
      </table>
    </CommonAccordionItem>
  </CommonAccordion>
</template>

<style lang="scss" scoped></style>
