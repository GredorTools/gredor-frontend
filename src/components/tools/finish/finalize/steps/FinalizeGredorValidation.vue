<script lang="ts" setup>
/**
 * En komponent för att köra vissa egna (ej Bolagsverkets) valideringar på
 * årsredovisningen.
 */

import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed, watch } from "vue";
import { type TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { XMLParser } from "fast-xml-parser";
import { convertiXBRLToXBRL } from "@/util/convertiXBRLToXBRL.ts";
import LuhnAlgorithm from "@designbycode/luhn-algorithm";
import { equalsWithDecimals } from "@/util/compareUtils.ts";
import { formatNumber } from "@/util/formatUtils.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { useGetBeloppradLists } from "@/components/tools/finish/finalize/steps/useGetBeloppradLists.ts";
import { addTodoListItem, type TodoList } from "@/model/todolist/TodoList.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;

    /** Årsredovisningen i iXBRL-format. Får vara null under tiden den
     * genereras. */
    ixbrl: string | null;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

/** Eventuell att-åtgärda-lista där fel/varningar från Bolagsverket kan läggas
 * till av denna komponent. */
const todoList = defineModel<TodoList | undefined>("todoList", {
  required: false,
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

const invalidVerksamhetsar = computed(() => {
  return [
    props.arsredovisning.verksamhetsarNuvarande,
    ...props.arsredovisning.verksamhetsarTidigare,
  ].filter((verksamhetsar) => {
    if (
      !verksamhetsar ||
      !verksamhetsar.startdatum ||
      !verksamhetsar.slutdatum
    ) {
      return true;
    }

    const startdatumDate = new Date(verksamhetsar.startdatum);
    const slutdatumDate = new Date(verksamhetsar.slutdatum);

    return (
      !isValidVerksamhetsarDate(startdatumDate) ||
      !isValidVerksamhetsarDate(slutdatumDate) ||
      startdatumDate > slutdatumDate
    );
  });
});
function isValidVerksamhetsarDate(date: Date) {
  return (
    date != null &&
    date instanceof Date &&
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() > 2010 &&
    date.getFullYear() < 3000
  );
}

const dateIsFilledAndValid = computed(() => {
  return props.arsredovisning.redovisningsinformation.datering;
});

const signaturesAreFilledAndValid = computed(() => {
  return (
    props.arsredovisning.redovisningsinformation.underskrifter.length > 0 &&
    props.arsredovisning.redovisningsinformation.underskrifter.every(
      (signature) =>
        signature.tilltalsnamn && signature.efternamn && signature.datum,
    )
  );
});

const requiredFieldsAreFilled = computed(() => {
  return (
    orgnrIsFilledAndValid.value &&
    invalidVerksamhetsar.value.length < 1 &&
    dateIsFilledAndValid.value &&
    signaturesAreFilledAndValid.value
  );
});

// Hitta eventuella belopprader med samma koncept men olika värden
const { beloppradLists } = await useGetBeloppradLists(props.arsredovisning);
const mismatchingValueBelopprader = computed(() => {
  if (!props.ixbrl) {
    return [];
  }

  const xbrl = convertiXBRLToXBRL(props.ixbrl);
  const xbrlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    preserveOrder: false,
  });
  const parsedXbrl = xbrlParser.parse(xbrl);

  const result: {
    taxonomyItem: TaxonomyItem;
    values: {
      belopp: string;
      decimals: string;
    }[];
  }[] = [];

  const rowValueMap = new Map<
    string,
    {
      taxonomyItemName: string;
      values: {
        belopp: string;
        decimals: string;
      }[];
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

      if ("@_decimals" in xbrlItemValueWithoutText) {
        delete xbrlItemValueWithoutText["@_decimals"];
      }

      const rowValueMapKey =
        xbrlItemKey + JSON.stringify(xbrlItemValueWithoutText);
      if (!rowValueMap.has(rowValueMapKey)) {
        rowValueMap.set(rowValueMapKey, {
          taxonomyItemName: xbrlItemKey,
          values: [],
        });
      }

      rowValueMap.get(rowValueMapKey)!.values.push({
        belopp: String(xbrlItemValueItem["#text"]),
        decimals:
          "@_decimals" in xbrlItemValueItem
            ? String(xbrlItemValueItem["@_decimals"])
            : "INF",
      });
    }

    if (Array.isArray(xbrlItemValue)) {
      xbrlItemValue.forEach(handleXbrlItemValueItem);
    } else {
      handleXbrlItemValueItem(xbrlItemValue);
    }
  }

  for (const { taxonomyItemName, values } of rowValueMap.values()) {
    const baseValue =
      values.find((value) => value.decimals === "INF") ?? values[0];

    if (
      values.length > 1 &&
      !values.every((value) =>
        equalsWithDecimals(
          value.belopp,
          value.decimals,
          baseValue.belopp,
          baseValue.decimals,
        ),
      )
    ) {
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

watch(
  [
    orgnrIsFilledAndValid,
    invalidVerksamhetsar,
    dateIsFilledAndValid,
    signaturesAreFilledAndValid,
    mismatchingValueBelopprader,
  ],
  () => {
    if (todoList.value == null) {
      return;
    }

    const errorsAndWarnings = [];
    if (!orgnrIsFilledAndValid.value) {
      errorsAndWarnings.push({
        text: "Grunduppgifter: Organisationsnummer saknas eller är ogiltigt.",
        complete: false,
      });
    }
    if (invalidVerksamhetsar.value.length > 0) {
      errorsAndWarnings.push({
        text: "Grunduppgifter: Verksamhetsåren är inte korrekt ifyllda.",
        complete: false,
      });
    }
    if (!dateIsFilledAndValid.value) {
      errorsAndWarnings.push({
        text: "Underskrifter: Datering saknas eller är inte korrekt ifylld.",
        complete: false,
      });
    }
    if (!signaturesAreFilledAndValid.value) {
      errorsAndWarnings.push({
        text: "Underskrifter: Underskrifter saknas eller är inte korrekt ifyllda.",
        complete: false,
      });
    }
    if (mismatchingValueBelopprader.value.length > 0) {
      errorsAndWarnings.push({
        text:
          `På följande poster förekommer det olika belopp i olika delar` +
          ` av årsredovisningen:` +
          ` "${mismatchingValueBelopprader.value
            .map((belopprad) => belopprad.taxonomyItem.properties.label)
            .join('", "')}"`,
        complete: false,
      });
    }

    if (errorsAndWarnings?.length > 0) {
      addTodoListItem(todoList.value, {
        id: "gredor-forkontroller",
        title: "Gredors förkontroller",
        description: "Följande fel/varningar upptäcktes av Gredor.",
        timestamp: Date.now(),
        tasks: errorsAndWarnings
          .map((utfall) => utfall.text || "")
          .filter((text) => !!text)
          .map((text) => ({ text, complete: false })),
      });
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Gredors förkontroller
    </CommonModalSubtitle>

    <div v-if="!ixbrl">Kontrollerar – det kan ta några sekunder…</div>

    <template
      v-else-if="
        !requiredFieldsAreFilled || mismatchingValueBelopprader.length > 0
      "
    >
      <h5>Kontrollresultat</h5>

      <div
        v-if="!orgnrIsFilledAndValid"
        class="alert alert-danger required-fields-not-filled"
        role="alert"
        data-testid="finalize-gredor-validation-invalid-orgnr"
      >
        <strong>Fel:</strong> Organisationsnumret är inte korrekt ifyllt under
        fliken "Grunduppgifter".
      </div>

      <div
        v-if="invalidVerksamhetsar.length > 0"
        class="alert alert-danger required-fields-not-filled"
        role="alert"
        data-testid="finalize-gredor-validation-invalid-verksamhetsar"
      >
        <strong>Fel:</strong> Verksamhetsåren är inte korrekt ifyllda under
        fliken "Grunduppgifter". Det gäller följande verksamhetsår:
        <ul>
          <li
            v-for="(verksamhetsar, verksamhetsarIndex) in invalidVerksamhetsar"
            :key="verksamhetsarIndex"
            :data-testid="`finalize-gredor-validation-invalid-verksamhetsar-${verksamhetsarIndex}`"
          >
            <template v-if="verksamhetsar.startdatum">
              {{ verksamhetsar.startdatum }}
            </template>
            <strong v-else>&lt;startdatum saknas!&gt;</strong>
            {{ "-" }}
            <template v-if="verksamhetsar.slutdatum">
              {{ verksamhetsar.slutdatum }}
            </template>
            <strong v-else>&lt;slutdatum saknas!&gt;</strong>
          </li>
        </ul>
      </div>

      <div
        v-if="!dateIsFilledAndValid"
        class="alert alert-danger required-fields-not-filled"
        role="alert"
        data-testid="finalize-gredor-validation-invalid-date"
      >
        <strong>Fel:</strong> Dateringen är inte korrekt ifylld under fliken
        "Underskrifter".
      </div>

      <div
        v-if="!signaturesAreFilledAndValid"
        class="alert alert-danger required-fields-not-filled"
        role="alert"
        data-testid="finalize-gredor-validation-invalid-signatures"
      >
        <strong>Fel:</strong> Underskrifterna är inte korrekt ifyllda under
        fliken "Underskrifter".
      </div>

      <div
        v-if="mismatchingValueBelopprader.length > 0"
        class="alert alert-warning mismatching-values"
        role="alert"
      >
        <p>
          <strong>Varning:</strong> På följande poster förekommer det olika
          belopp i olika delar av årsredovisningen. Du bör korrigera detta om
          möjligt.
        </p>

        <ul data-testid="finalize-gredor-validation-mismatching-values-list">
          <li
            v-for="(belopprad, beloppradIndex) in mismatchingValueBelopprader"
            :key="beloppradIndex"
          >
            {{ belopprad.taxonomyItem.properties.label }}
            <ul>
              <li
                v-for="(
                  beloppradValue, beloppradValueIndex
                ) in belopprad.values"
                :key="beloppradValueIndex"
              >
                {{
                  formatNumber(
                    beloppradValue.belopp,
                    null,
                    beloppradValue.decimals === "-3"
                      ? BeloppFormat.TUSENTAL
                      : BeloppFormat.HELTAL,
                  )
                }}<template v-if="beloppradValue.decimals === '-3'"
                  >&nbsp;(tusental)</template
                >
                {{
                  arsredovisning.redovisningsinformation.redovisningsvaluta
                    .namnKort
                }}
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="legend">
        <h5>Hur man tolkar kontrollresultatet</h5>

        <ul>
          <li>
            <strong>Fel</strong>{{ " " }}
            <span class="text-decoration-underline">måste</span> åtgärdas innan
            du fortsätter
          </li>
          <li>
            <strong>Varningar</strong> bör om möjligt åtgärdas innan du
            fortsätter, för att minimera risken för att du får ett föreläggande
            från Bolagsverket
          </li>
        </ul>

        <p v-if="todoList != null">
          Resultatpunkterna har lagts till i din att-åtgärda-lista.
        </p>
      </div>
    </template>

    <div v-else>
      <p>Gredors automatiska förkontroller hittade inga anmärkningar.</p>
    </div>

    <CommonWizardButtons
      :next-button-disabled="!ixbrl || !requiredFieldsAreFilled"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

h5 {
  font-size: 1.15rem;
  margin-top: $spacing-lg;
}

.alert {
  ul,
  li {
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  li {
    margin-bottom: $spacing-md;

    ul {
      // Nästlade listor
      margin-top: $spacing-sm;

      li {
        margin-bottom: $spacing-sm;
        font-size: $font-size-sm;
      }
    }
  }
}

.legend {
  li {
    margin-bottom: $spacing-sm;
  }

  p {
    margin-bottom: 0;
  }
}
</style>
