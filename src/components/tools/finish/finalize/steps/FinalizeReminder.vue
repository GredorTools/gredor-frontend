<script lang="ts" setup>
/**
 * En komponent för att visa villkor för inlämning av årsredovisning med
 * Gredor.
 */

import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import {
  type TaxonomyItem,
  TaxonomyRootName,
} from "@/model/taxonomy/TaxonomyItem.ts";
import { getHeaderBeloppraderForNoter } from "@/util/noterUtils.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  type BaseBeloppradComparable,
  isBeloppradComparable,
} from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import { useIXBRLGenerator } from "@/components/tools/finish/common/composables/useIXBRLGenerator.ts";
import type { ComponentExposed } from "vue-component-type-helpers";
import RenderMain from "@/components/render/RenderMain.vue";
import { XMLParser } from "fast-xml-parser";
import { convertiXBRLToXBRL } from "@/util/convertiXBRLToXBRL.ts";
import type { Underskrift } from "@/model/arsredovisning/Underskrift.ts";
import LuhnAlgorithm from "@designbycode/luhn-algorithm";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

/** Årsredovisningen i iXBRL-format. */
const ixbrl = defineModel<string | undefined>("ixbrl", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

// Generering av iXBRL - sker i bakgrunden
const renderMain = ref<ComponentExposed<typeof RenderMain>>();

const { tryGenerateIXBRLInInterval } = useIXBRLGenerator({
  renderMain,
  arsredovisning: props.arsredovisning,
  ixbrlOutput: ixbrl,
});
let reportGeneratorIntervalId: number | undefined;
onMounted(() => {
  // Timeout så att förhandsgranskningen hinner ladda in innan vi skapar iXBRL
  setTimeout(async () => {
    // Konvertera renderad HTML till iXBRL
    reportGeneratorIntervalId = tryGenerateIXBRLInInterval();
  }, 250);
});

onBeforeUnmount(() => {
  if (reportGeneratorIntervalId != null) {
    clearInterval(reportGeneratorIntervalId);
  }
});

// Kolla att nödvändiga fält är ifyllda
const orgnrIsFilledAndValid = computed(() => {
  return (
    props.arsredovisning.foretagsinformation.organisationsnummer &&
    props.arsredovisning.foretagsinformation.organisationsnummer.match(
      /^\d{6}-?\d{4}$/,
    ) &&
    LuhnAlgorithm.isValid(
      props.arsredovisning.foretagsinformation.organisationsnummer.replace(
        "-",
        "",
      ),
    )
  );
});

const verksamhetsarDatesAreFilled = computed(() => {
  return (
    props.arsredovisning.verksamhetsarNuvarande &&
    props.arsredovisning.verksamhetsarNuvarande.startdatum &&
    props.arsredovisning.verksamhetsarNuvarande.slutdatum &&
    (!props.arsredovisning.verksamhetsarTidigare ||
      props.arsredovisning.verksamhetsarTidigare.every(
        (verksamhetsar) => verksamhetsar.startdatum && verksamhetsar.slutdatum,
      ))
  );
});

const requiredFieldsAreFilled = computed(() => {
  return (
    orgnrIsFilledAndValid.value &&
    verksamhetsarDatesAreFilled.value &&
    props.arsredovisning.redovisningsinformation.datering &&
    props.arsredovisning.redovisningsinformation.underskrifter.length > 0 &&
    props.arsredovisning.redovisningsinformation.underskrifter.every(
      (signature) =>
        signature.tilltalsnamn && signature.efternamn && signature.datum,
    )
  );
});

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
const forvaltningsberattelseTaxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
);
const resultatrakningTaxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
);
const balansrakningTaxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.BALANSRAKNING,
);
const noterTaxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);
const beloppradLists = computed(() => [
  {
    beloppradList: props.arsredovisning.forvaltningsberattelse,
    beloppradListTaxonomyManager: forvaltningsberattelseTaxonomyManager,
  },
  {
    beloppradList: props.arsredovisning.resultatrakning,
    beloppradListTaxonomyManager: resultatrakningTaxonomyManager,
  },
  {
    beloppradList: props.arsredovisning.balansrakning,
    beloppradListTaxonomyManager: balansrakningTaxonomyManager,
  },
  {
    beloppradList: props.arsredovisning.noter,
    beloppradListTaxonomyManager: noterTaxonomyManager,
  },
]);
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

// Hitta eventuella belopprader med samma koncept men olika värden
const mismatchingValueBelopprader = computed(() => {
  if (!ixbrl.value) {
    return [];
  }

  const xbrl = convertiXBRLToXBRL(ixbrl.value);
  const xbrlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    preserveOrder: false,
  });
  const parsedXbrl = xbrlParser.parse(xbrl);

  const result: {
    taxonomyItem: TaxonomyItem;
    values: string[];
  }[] = [];

  const rowValueMap = new Map<
    string,
    {
      taxonomyItemName: string;
      values: string[];
    }
  >();
  for (const [xbrlItemKey, xbrlItemValue] of Object.entries(
    parsedXbrl["xbrli:xbrl"],
  )) {
    if (
      !xbrlItemKey.startsWith("se-gen-base:") ||
      typeof xbrlItemValue !== "object" ||
      xbrlItemValue == null
    ) {
      continue;
    }

    function handleXbrlItemValueItem(xbrlItemValueItem: object) {
      if (!("#text" in xbrlItemValueItem)) {
        return;
      }

      const xbrlItemValueWithoutText = { ...xbrlItemValueItem };
      delete xbrlItemValueWithoutText["#text"];

      const rowValueMapKey =
        xbrlItemKey + JSON.stringify(xbrlItemValueWithoutText);
      if (!rowValueMap.has(rowValueMapKey)) {
        rowValueMap.set(rowValueMapKey, {
          taxonomyItemName: xbrlItemKey,
          values: [],
        });
      }

      rowValueMap
        .get(rowValueMapKey)!
        .values.push(xbrlItemValueItem["#text"] as string);
    }

    if (Array.isArray(xbrlItemValue)) {
      xbrlItemValue.forEach(handleXbrlItemValueItem);
    } else {
      handleXbrlItemValueItem(xbrlItemValue);
    }
  }

  for (const { taxonomyItemName, values } of rowValueMap.values()) {
    if (values.length > 1 && !values.every((belopp) => belopp === values[0])) {
      let taxonomyItem: TaxonomyItem | null = null;
      for (const taxonomyManager of beloppradLists.value.map(
        (x) => x.beloppradListTaxonomyManager,
      )) {
        try {
          taxonomyItem = taxonomyManager.getItemByName(taxonomyItemName);
        } catch {
          // Gör inget
        }
      }
      if (taxonomyItem == null) {
        console.warn(`Taxonomy item not found for ${taxonomyItemName}`);
        continue;
      }

      result.push({
        taxonomyItem,
        values,
      });
    }
  }

  return result;
});
</script>

<template>
  <CommonModalContents>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Glöm inte…
    </CommonModalSubtitle>

    <div hidden>
      <RenderMain
        ref="renderMain"
        :arsredovisning="arsredovisning"
        :show-faststallelseintyg="false"
      />
    </div>

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
        <li v-if="mismatchingValueBelopprader.length > 0">
          …beloppen för följande fält; det förekommer olika värden på olika
          ställen och du bör korrigera detta:
          <ul data-testid="finalize-reminder-mismatching-values-list">
            <li v-for="(belopprad, i) in mismatchingValueBelopprader" :key="i">
              {{ belopprad.taxonomyItem.properties.label }}: [{{
                belopprad.values.join(" / ")
              }}]
              {{
                arsredovisning.redovisningsinformation.redovisningsvaluta
                  .namnKort
              }}
            </li>
          </ul>
        </li>
        <li
          v-if="!orgnrIsFilledAndValid"
          data-testid="finalize-reminder-invalid-orgnr"
        >
          …att organisationsnumret är korrekt ifyllt under fliken
          "Grunduppgifter"; <strong>just nu är det inte korrekt ifyllt.</strong>
        </li>
        <li
          v-if="!verksamhetsarDatesAreFilled"
          data-testid="finalize-reminder-invalid-verksamhetsar"
        >
          …att verksamhetsåren är korrekt ifyllda under fliken "Grunduppgifter";
          <strong>just nu är de inte korrekt ifyllda.</strong>.
        </li>
      </ul>
    </div>

    <CommonWizardButtons
      :next-button-disabled="!ixbrl || !requiredFieldsAreFilled"
      :next-button-text="
        ixbrl
          ? requiredFieldsAreFilled
            ? 'Nästa'
            : 'Nödvändiga uppgifter saknas!'
          : 'Vänta – arbetar i bakgrunden…'
      "
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
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
