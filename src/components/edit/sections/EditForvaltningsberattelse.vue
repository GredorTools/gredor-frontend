<script lang="ts" setup>
/**
 * En komponent för att redigera förvaltningsberättelsen i årsredovisningen.
 * Visar olika delar av förvaltningsberättelsen som flerårsöversikt, förändringar i eget kapital och resultatdisposition.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { createBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import EditForvaltningsberattelseFlerarsoversikt from "@/components/edit/sections/forvaltningsberattelse/EditForvaltningsberattelseFlerarsoversikt.vue";
import EditForvaltningsberattelseForandringar from "@/components/edit/sections/forvaltningsberattelse/EditForvaltningsberattelseForandringar.vue";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";
import CommonModal from "@/components/common/CommonModal.vue";
import { useTemplateRef } from "vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import CommonAccordion from "@/components/common/CommonAccordion.vue";
import CommonAccordionItem from "@/components/common/CommonAccordionItem.vue";

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

// Modal för förändringar i eget kapital
const forandringarModal =
  useTemplateRef<ComponentExposed<typeof CommonModal>>("forandringarModal");

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
  <CommonAccordion>
    <CommonAccordionItem
      v-for="(group, groupIndex) in groups"
      :id="`forvaltningsberattelse-accordion-${group.xmlName}`"
      :key="group.xmlName"
      :title="group.additionalData.displayLabel"
    >
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
      <template
        v-else-if="group.xmlName === 'se-gen-base:ForandringEgetKapital'"
      >
        <!-- Vi har denna som en modal pga att den blir för bred annars -->
        <button class="btn btn-primary" @click="forandringarModal?.show()">
          Visa tabell
        </button>
      </template>
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
    </CommonAccordionItem>
  </CommonAccordion>

  <CommonModal
    id="edit-forvaltningsberattelse-forandringar-modal"
    ref="forandringarModal"
    title="Förändringar i eget kapital"
  >
    <EditForvaltningsberattelseForandringar
      :arsredovisning="arsredovisning"
      :group-taxonomy-item="
        availableTaxonomyItems.childrenFlat.find(
          (item) => item.xmlName === 'se-gen-base:ForandringEgetKapital',
        )!
      "
      :taxonomy-manager="taxonomyManager"
    />
    <CommonWizardButtons
      next-button-text="Klar"
      previous-button-hidden
      @go-to-next-step="forandringarModal?.hide()"
    />
  </CommonModal>
</template>

<style lang="scss" scoped></style>
