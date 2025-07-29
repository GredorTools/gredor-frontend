<script lang="ts" setup>
/**
 * En komponent för att redigera noter i årsredovisningen.
 * Visar noter grupperade efter typ och tillåter användaren att lägga till, redigera och ta bort noter.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { createBeloppradInList } from "@/model/arsredovisning/Belopprad.ts";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getValueColumnHeaderCell } from "@/util/noterUtils.ts";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";
import {
  type TaxonomyItem,
  TaxonomyRootName,
} from "@/model/taxonomy/TaxonomyItem.ts";

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

const { prepopulateSection, groupPrepopulatedSection } = usePrepopulateSection({
  taxonomyManager,
  availableTaxonomyItems,
  arsredovisning: arsredovisning,
  sectionName: "noter",
  maxNumPreviousYears: 1,
});

const belopprader = prepopulateSection();
const groups = [
  availableTaxonomyItems.children[0].children[0],
  ...availableTaxonomyItems.children[0].children
    .slice(1)
    .flatMap((c) => c.children),
];
const groupedBelopprader = groupPrepopulatedSection(belopprader, groups);
</script>

<template>
  <div class="accordion">
    <div
      v-for="(group, groupIndex) in groups"
      :key="groupIndex"
      class="accordion-item"
    >
      <div class="accordion-header">
        <button
          :aria-controls="`noter-accordion${groupIndex}`"
          :data-bs-target="`#noter-accordion${groupIndex}`"
          aria-expanded="true"
          class="accordion-button collapsed"
          data-bs-toggle="collapse"
          type="button"
        >
          {{ group.additionalData.displayLabel }}
        </button>
      </div>
      <div
        :id="`noter-accordion${groupIndex}`"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
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
              </tr>
            </thead>
            <tbody>
              <EditBelopprad
                v-for="(belopprad, index) in groupedBelopprader[groupIndex]"
                :key="belopprad.taxonomyItemName"
                v-model:belopprad="groupedBelopprader[groupIndex][index]"
                v-model:belopprader="groupedBelopprader[groupIndex]"
                :comparable-num-previous-years="
                  Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
                "
                :string-minimum-level="1"
                :taxonomy-manager="taxonomyManager"
                string-multiline
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
