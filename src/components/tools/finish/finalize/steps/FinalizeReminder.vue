<script lang="ts" setup>
/**
 * En komponent för att visa villkor för inlämning av årsredovisning med
 * Gredor.
 */

import CommonWizardButtons, { type CommonWizardButtonsEmits } from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";
import { getHeaderBeloppraderForNoter } from "@/util/noterUtils.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

// Räkna ut notkopplingar
const noterTaxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);
const beloppradLists = [
  {
    beloppradList: props.arsredovisning.forvaltningsberattelse,
    beloppradListTaxonomyManager: await getTaxonomyManager(
      TaxonomyRootName.FORVALTNINGSBERATTELSE,
    ),
  },
  {
    beloppradList: props.arsredovisning.resultatrakning,
    beloppradListTaxonomyManager: await getTaxonomyManager(
      TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
    ),
  },
  {
    beloppradList: props.arsredovisning.balansrakning,
    beloppradListTaxonomyManager: await getTaxonomyManager(
      TaxonomyRootName.BALANSRAKNING,
    ),
  },
  {
    beloppradList: props.arsredovisning.noter,
    beloppradListTaxonomyManager: await getTaxonomyManager(
      TaxonomyRootName.NOTER,
    ),
  },
];
const noterConnections = computed(() =>
  getHeaderBeloppraderForNoter(
    props.arsredovisning.noter.map((belopprad) => ({
      belopprad,
      taxonomyItem: getTaxonomyItemForBelopprad(
        noterTaxonomyManager,
        belopprad,
      ),
    })),
  ).map((headerBelopprad, i) => {
    const notnummer = i + 1;
    const resultForNot = {
      notnummer,
      notLabel: headerBelopprad.taxonomyItem.additionalData.displayLabel,
      connections: new Array<string>(),
    };
    for (const {
      beloppradList,
      beloppradListTaxonomyManager,
    } of beloppradLists) {
      for (const belopprad of beloppradList) {
        if (
          isBeloppradComparable(belopprad) &&
          belopprad.not === notnummer.toString()
        ) {
          const beloppradDisplayLabel = getTaxonomyItemForBelopprad(
            beloppradListTaxonomyManager,
            belopprad,
          ).additionalData.displayLabel;
          if (beloppradDisplayLabel) {
            resultForNot.connections.push(beloppradDisplayLabel);
          }
        }
      }
    }
    return resultForNot;
  }),
);
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Glöm inte…
    </CommonModalSubtitle>

    <div>
      <p>
        Innan du går vidare vill vi bara påminna om ett par detaljer som kan
        vara lätta att missa! Glöm inte att kolla att…
      </p>

      <ul>
        <li>
          …alla noter är korrekt kopplade, om de ska ha någon koppling
          <ul>
            <li
              v-for="resultForNot in noterConnections"
              :key="resultForNot.notnummer"
            >
              Not {{ resultForNot.notnummer }} ({{ resultForNot.notLabel }}) är
              just nu
              <template v-if="resultForNot.connections.length > 0">
                kopplad till "{{ resultForNot.connections.join('", "') }}"
              </template>
              <template v-else>inte kopplad till någon belopprad</template>
            </li>
          </ul>
        </li>
        <li>
          …fastställandedatum för årsredovisningen och underskriftsdatumen
          stämmer. Du har fyllt i:
          <ul>
            <li>
              Datering:
              {{
                arsredovisning.redovisningsinformation.datering ||
                "inget ifyllt"
              }}
            </li>
            <li
              v-for="(underskrift, i) in props.arsredovisning
                .redovisningsinformation.underskrifter"
              :key="i"
            >
              Underskrift,
              {{ underskrift.tilltalsnamn || "< tilltalsnamn saknas >" }}
              {{ underskrift.efternamn || "< efternamn saknas >" }}:
              {{ underskrift.datum || "inget ifyllt" }}
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <CommonWizardButtons
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

li {
  margin-bottom: $spacing-md;

  ul {
    // Nästlade listor
    margin-top: $spacing-sm;

    li {
      margin-bottom: $spacing-sm;
      font-size: $font-size-sm;
      color: $mediumdark;
    }
  }
}
</style>
