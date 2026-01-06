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
      </ul>
    </div>

    <CommonWizardButtons
      :next-button-disabled="!ixbrl"
      :next-button-text="ixbrl ? 'Nästa' : 'Vänta – arbetar i bakgrunden…'"
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
