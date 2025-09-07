<script lang="ts" setup>
/**
 * En komponent för att redigera flerårsöversikten i förvaltningsberättelsen.
 * Visar en tabell med nyckeltal för nuvarande och tidigare räkenskapsår.
 */

import { createBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { formatDateForFlerarsoversikt } from "@/util/formatUtils.ts";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import { usePrepopulateSection } from "@/components/edit/composables/usePrepopulateSection.ts";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt i flerårsöversikten. */
  taxonomyManager: TaxonomyManager;

  /** Taxonomiobjekt som representerar gruppen av nyckeltal som ska visas. */
  groupTaxonomyItem: TaxonomyItem;
}>();

/** Årsredovisningen som innehåller förvaltningsberättelsen med flerårsöversikt. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

// Förpopulera rader
const maxNumPreviousYears = 3;

const { prepopulateSection } = usePrepopulateSection({
  taxonomyManager: props.taxonomyManager,
  availableTaxonomyItems: props.groupTaxonomyItem,
  arsredovisning: arsredovisning,
  sectionName: "forvaltningsberattelse",
  maxNumPreviousYears,
});

const belopprader = prepopulateSection();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col">
          <BaseEditBeloppradTitle
            :belopprad="createBelopprad(groupTaxonomyItem)"
            :taxonomy-manager="taxonomyManager"
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
        :string-minimum-level="1"
        :taxonomy-manager="taxonomyManager"
      />
    </tbody>
  </table>

  <hr />

  <div class="format-radios">
    <div class="form-check">
      <input
        id="flerarsoversiktFormatRadioNormal"
        v-model="arsredovisning.installningar.flerarsoversiktBeloppFormat"
        :value="BeloppFormat.HELTAL"
        class="form-check-input"
        name="flerarsoversiktFormatRadio"
        type="radio"
      />
      <label class="form-check-label" for="flerarsoversiktFormatRadioNormal">
        Visa belopp i hela
        {{ arsredovisning.redovisningsinformation.redovisningsvaluta.namn }}
      </label>
    </div>
    <div class="form-check">
      <input
        id="flerarsoversiktFormatRadioTusental"
        v-model="arsredovisning.installningar.flerarsoversiktBeloppFormat"
        :value="BeloppFormat.TUSENTAL"
        class="form-check-input"
        name="flerarsoversiktFormatRadio"
        type="radio"
      />
      <label class="form-check-label" for="flerarsoversiktFormatRadioTusental">
        Visa belopp i tusentals
        {{ arsredovisning.redovisningsinformation.redovisningsvaluta.namn }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.format-radios {
  margin: $spacing-lg 0;

  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}
</style>
