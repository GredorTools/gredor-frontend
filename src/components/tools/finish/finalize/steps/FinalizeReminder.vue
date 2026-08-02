<script lang="ts" setup>
/**
 * En komponent som påminner användaren om några saker som kan vara lätta att
 * missa.
 */

import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import { getHeaderBeloppraderForNoter } from "@/util/noterUtils.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  type BaseBeloppradComparable,
  isBeloppradComparable,
} from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import type { Underskrift } from "@/model/arsredovisning/Underskrift.ts";
import { useGetBeloppradLists } from "@/components/tools/finish/finalize/steps/useGetBeloppradLists.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

// Räkna ut senaste underskriftsdatum
const latestSignatureDate = computed(() => {
  const signatures = props.arsredovisning.redovisningsinformation.underskrifter;
  if (!signatures || signatures.length === 0) {
    return null;
  }

  const result = signatures.reduce(
    (
      {
        maxDate,
        maxDateSignature,
      }: { maxDate: Date; maxDateSignature: Underskrift | null },
      signature: Underskrift,
    ) => {
      if (!signature.datum.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return { maxDate, maxDateSignature };
      }
      const signatureDate = new Date(signature.datum);
      return signatureDate > maxDate
        ? { maxDate: signatureDate, maxDateSignature: signature }
        : { maxDate, maxDateSignature };
    },
    { maxDate: new Date(0), maxDateSignature: null },
  );

  return result.maxDateSignature?.datum || null;
});

// Räkna ut notkopplingar
const { noterTaxonomyManager, beloppradLists } = await useGetBeloppradLists(
  props.arsredovisning,
);
const headerBeloppraderForNoter = computed(() =>
  getHeaderBeloppraderForNoter(
    noterTaxonomyManager,
    props.arsredovisning.noter,
  ),
);
const noterConnections = computed(() =>
  headerBeloppraderForNoter.value.map(
    ({ taxonomyItem: headerTaxonomyItem }, i) => {
      const notnummer = i + 1;
      const resultForNot = {
        notnummer,
        notLabel: headerTaxonomyItem.additionalData.displayLabel,
        connections: new Array<string>(),
      };
      for (const {
        beloppradList,
        beloppradListTaxonomyManager,
      } of beloppradLists.value) {
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
    },
  ),
);

const beloppraderWithNonexistingNoter = computed(() => {
  const result = new Array<{
    belopprad: BaseBeloppradComparable;
    beloppradLabel: string;
  }>();

  for (const {
    beloppradList,
    beloppradListTaxonomyManager,
  } of beloppradLists.value) {
    for (const belopprad of beloppradList) {
      if (isBeloppradComparable(belopprad) && belopprad.not) {
        const notNumber = Number.parseInt(belopprad.not, 10);
        if (notNumber < 1 || notNumber > noterConnections.value.length) {
          result.push({
            belopprad,
            beloppradLabel:
              getTaxonomyItemForBelopprad(
                beloppradListTaxonomyManager,
                belopprad,
              ).additionalData.displayLabel ?? "< okänd belopprad >",
          });
        }
      }
    }
  }

  return result;
});
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Glöm inte…
    </CommonModalSubtitle>

    <div>
      <p>
        Innan du går vidare vill vi bara påminna om ett par detaljer som kan
        vara lätta att missa! Glöm inte att kontrollera…
      </p>

      <ul>
        <li>
          …att alla noter är korrekt kopplade, om de ska ha någon koppling
          <ul data-testid="finalize-reminder-noter-connections-list">
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
            <li
              v-for="beloppradWithNonexistingNot in beloppraderWithNonexistingNoter"
              :key="beloppradWithNonexistingNot.belopprad.taxonomyItemName"
            >
              Belopprad "{{ beloppradWithNonexistingNot.beloppradLabel }}" är
              kopplad till not
              {{ beloppradWithNonexistingNot.belopprad.not }} som inte finns
            </li>
          </ul>
        </li>
        <li>
          …att fastställandedatum för årsredovisningen och underskriftsdatumen
          stämmer. Du har fyllt i:
          <ul data-testid="finalize-reminder-redovisningsinformation-list">
            <li>
              Datering:
              <template v-if="arsredovisning.redovisningsinformation.datering">
                {{ arsredovisning.redovisningsinformation.datering }}
              </template>
              <strong v-else>Inget ifyllt!</strong>
            </li>
            <li
              v-for="(underskrift, i) in props.arsredovisning
                .redovisningsinformation.underskrifter"
              :key="i"
            >
              Underskrift,

              <template v-if="underskrift.tilltalsnamn">
                {{ underskrift.tilltalsnamn }}
              </template>
              <strong v-else>&lt;tilltalsnamn saknas!&gt;</strong>
              {{ " " }}
              <template v-if="underskrift.efternamn">
                {{ underskrift.efternamn }}:
              </template>
              <strong v-else>&lt;efternamn saknas!&gt;:</strong>
              {{ " " }}
              <template v-if="underskrift.datum">
                {{ underskrift.datum }}
              </template>
              <strong v-else>&lt;datum saknas!&gt;</strong>
            </li>
          </ul>
          <div
            v-if="latestSignatureDate"
            data-testid="finalize-reminder-latest-signature-date"
          >
            Årsstämman får därmed hållas
            <strong>tidigast {{ latestSignatureDate }}</strong
            >.
          </div>
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
