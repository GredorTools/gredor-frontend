<script lang="ts" setup>
/**
 * En komponent för att redigera förvaltningsberättelsen i årsredovisningen.
 * Visar olika delar av förvaltningsberättelsen som flerårsöversikt, förändringar i eget kapital och resultatdisposition.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { createBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  getTaxonomyManager,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import EditForvaltningsberattelseFlerarsoversikt from "@/components/edit/sections/forvaltningsberattelse/EditForvaltningsberattelseFlerarsoversikt.vue";
import EditForvaltningsberattelseForandringar from "@/components/edit/sections/forvaltningsberattelse/EditForvaltningsberattelseForandringar.vue";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

// Data
/** Årsredovisningen som innehåller förvaltningsberättelsen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

// Förpopulera rader
const { prepopulateSection, groupPrepopulatedSection } = usePrepopulateSection({
  taxonomyManager,
  availableTaxonomyItems,
  arsredovisning: arsredovisning,
  sectionName: "forvaltningsberattelse",
  maxNumPreviousYears: 0,
});

const belopprader = prepopulateSection();
const groups = availableTaxonomyItems.children[0].children;
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
          :aria-controls="`forvaltningsberattelse-accordion${groupIndex}`"
          :data-bs-target="`#forvaltningsberattelse-accordion${groupIndex}`"
          aria-expanded="true"
          class="accordion-button collapsed"
          data-bs-toggle="collapse"
          type="button"
        >
          {{ group.additionalData.displayLabel }}
        </button>
      </div>
      <div
        :id="`forvaltningsberattelse-accordion${groupIndex}`"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
          <EditForvaltningsberattelseFlerarsoversikt
            v-if="group.xmlName === 'se-gen-base:Flerarsoversikt'"
            :arsredovisning="arsredovisning"
            :group-taxonomy-item="
              availableTaxonomyItems.childrenFlat.find(
                (item) => item.xmlName === 'se-gen-base:Flerarsoversikt',
              )!
            "
            :taxonomy-manager="taxonomyManager"
          />
          <EditForvaltningsberattelseForandringar
            v-else-if="group.xmlName === 'se-gen-base:ForandringEgetKapital'"
            :arsredovisning="arsredovisning"
            :group-taxonomy-item="
              availableTaxonomyItems.childrenFlat.find(
                (item) => item.xmlName === 'se-gen-base:ForandringEgetKapital',
              )!
            "
            :taxonomy-manager="taxonomyManager"
          />
          <table v-else>
            <thead v-if="groupedBelopprader[groupIndex].length > 1">
              <tr>
                <th scope="col">
                  <BaseEditBeloppradTitle
                    :belopprad="createBelopprad(group)"
                    :taxonomy-manager="taxonomyManager"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <EditBelopprad
                v-for="(belopprad, index) in groupedBelopprader[groupIndex]"
                :key="belopprad.taxonomyItemName"
                v-model:belopprad="groupedBelopprader[groupIndex][index]"
                v-model:belopprader="groupedBelopprader[groupIndex]"
                :comparable-num-previous-years="0"
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
