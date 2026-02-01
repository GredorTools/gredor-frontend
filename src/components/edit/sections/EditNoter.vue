<script lang="ts" setup>
/**
 * En komponent för att redigera noter i årsredovisningen.
 * Visar noter grupperade efter typ och tillåter användaren att lägga till, redigera och ta bort noter.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { createBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getValueColumnHeaderCell } from "@/util/noterUtils.ts";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import CommonAccordion from "@/components/common/CommonAccordion.vue";
import CommonAccordionItem from "@/components/common/CommonAccordionItem.vue";
import { computed, ref } from "vue";
import CommonClearableInput from "@/components/common/CommonClearableInput.vue";

// TaxonomyManager och rader
const taxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);
const availableTaxonomyItems = taxonomyManager.getRoot();

// Data
/** Årsredovisningen som innehåller noterna. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

const { prepopulateSection, groupPrepopulatedSection } = usePrepopulateSection({
  taxonomyManager,
  availableTaxonomyItems,
  arsredovisning: arsredovisning,
  sectionName: "noter",
  maxNumPreviousYears: 1,
});

const groupsOfGroups = availableTaxonomyItems.children[0].children;

const belopprader = prepopulateSection();
const groups = availableTaxonomyItems.children[0].children.flatMap(
  (c) => c.children,
);
const groupedBelopprader = groupPrepopulatedSection(belopprader, groups);

const filter = ref<string>("");
const visibleGroups = computed(() => {
  if (!filter.value) {
    return groups;
  }

  return groups.filter((g) =>
    g.additionalData.displayLabel
      ?.toLowerCase()
      ?.includes(filter.value.toLowerCase()),
  );
});
</script>

<template>
  <div class="d-flex flex-column">
    <div class="filter-container sticky-top">
      <div class="filter-contents">
        <div class="d-flex flex-col align-items-center gap-2">
          <label for="edit-noter-filter">Filtrera noter:</label>
          <CommonClearableInput
            id="edit-noter-filter"
            v-model="filter"
            class="form-control"
            name="edit-noter-filter"
            placeholder='T.ex. "medelantalet anställda"…'
          />
        </div>

        <hr />
      </div>
    </div>

    <div v-if="visibleGroups.length < 1" class="mt-4">
      Inga noter matchade filtreringen.
    </div>

    <div class="d-flex flex-column gap-4 mt-4">
      <div
        v-for="groupOfGroups in groupsOfGroups.filter((gg) =>
          gg.children.some((g) => visibleGroups.includes(g)),
        )"
        :key="groupOfGroups.xmlName"
      >
        <div class="mb-2">
          <BaseEditBeloppradTitle
            :belopprad="createBelopprad(groupOfGroups)"
            :taxonomy-manager="taxonomyManager"
          />
        </div>

        <CommonAccordion>
          <CommonAccordionItem
            v-for="[groupIndex, group] in [...groups.entries()].filter(
              ([, g]) =>
                groupOfGroups.children.includes(g) && visibleGroups.includes(g),
            )"
            :id="`noter-accordion-${group.xmlName}`"
            :key="group.xmlName"
            :title="group.additionalData.displayLabel"
          >
            <table>
              <thead v-if="groupedBelopprader[groupIndex].length > 1">
                <tr>
                  <th scope="col">{{ group.additionalData.displayLabel }}</th>
                  <component
                    :is="
                      getValueColumnHeaderCell(
                        group,
                        arsredovisning.noter,
                        arsredovisning.verksamhetsarNuvarande,
                      )
                    "
                  />
                  <component
                    :is="
                      getValueColumnHeaderCell(
                        group,
                        arsredovisning.noter,
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
                  monetary-show-balance-sign
                  string-multiline
                />
              </tbody>
            </table>
          </CommonAccordionItem>
        </CommonAccordion>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

// Det här är ganska fult...
.filter-container {
  top: $spacing-md;

  .filter-contents {
    background: $background-light;

    margin-top: -$spacing-xl;
    margin-left: -$spacing-md;
    width: calc(100% + 2 * #{$spacing-md});
    padding-left: $spacing-md;
    padding-right: $spacing-md;
    padding-top: $spacing-xl;
  }

  hr {
    margin-top: $spacing-lg;
    margin-bottom: 0;
  }

  :deep(input) {
    flex: 1;
  }
}
</style>
