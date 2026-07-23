<script lang="ts" setup>
/**
 * En modal som låter användaren börja på en ny årsredovisning. Användaren
 * fyller i företagets organisationsnummer, och företagets namn och fyra senaste
 * räkenskapsår hämtas automatiskt från Bolagsverket. Användaren har även
 * möjlighet att importera en SIE-fil.
 */

import { ref, unref, watch } from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import CommonFileInput from "@/components/common/CommonFileInput.vue";
import { starterArsredovisning } from "@/templates/starterArsredovisning.ts";
import {
  type Arsredovisning,
  createArsredovisningFromTemplate,
} from "@/model/arsredovisning/Arsredovisning.ts";
import { mapSieFileIntoArsredovisning } from "@/util/sieUtils.ts";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import {
  AvgivandeLikvidator,
  AvgivandeStyrelsen,
  AvgivandeStyrelsenOchVD,
} from "@/data/avgivande.ts";
import { addTodoListItem } from "@/model/todolist/TodoList.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import CommonWizardSteps from "@/components/common/CommonWizardSteps.vue";
import { useCompanyRecordsApi } from "@/api/composables/useCompanyRecordsApi.ts";
import CommonOrgnrInput, {
  type OrgnrValidationStatus,
} from "@/components/common/CommonOrgnrInput.vue";

defineProps<{
  /** ID för modalinstansen som är unikt över hela applikationen. */
  instanceId: string;
}>();

const emit = defineEmits<{
  /** Triggas när användaren är färdig med flödet. */
  (e: "arsredovisningCreated", arsredovisning: Arsredovisning): void;
}>();

const modal = ref<ComponentExposed<typeof CommonModal>>();
defineExpose({
  /** Visar det modala fönstret. */
  show: () => {
    modal.value?.show();
  },
});

const arsredovisning = ref<Arsredovisning>(
  createArsredovisningFromTemplate(starterArsredovisning),
);
const sieFile = ref<File | undefined>();
const sieMessages = ref<string[]>([]);

const currentStep = ref<"sie-import" | "foretagsuppgifter">("sie-import");
const orgnrValidationStatus = ref<OrgnrValidationStatus>("awaiting_input");
const busy = ref<boolean>(false);

const { showMessageModal } = useModalStore();
const { fetchCompanyRecords } = useCompanyRecordsApi({
  apiErrorHandler: (message, statusCode) => {
    if (statusCode >= 400 && statusCode <= 499) {
      showMessageModal(message, "Fel");
    } else {
      throw new Error(message);
    }
  },
  exceptionHandler: (e) => {
    throw e;
  },
});

/**
 * Hanterar SIE-filen som användaren har valt och importerar dess innehåll till
 * årsredovisningen.
 *
 * @param file - SIE-filen som användaren har valt
 */
async function handleSieFile(file: File) {
  busy.value = true;

  try {
    clearSieFileDataFromArsredovisning();

    sieMessages.value = [];

    const sieFileText = await file.text();
    await mapSieFileIntoArsredovisning(
      sieFileText,
      arsredovisning.value,
      (message) => sieMessages.value.push(message),
    );

    if (sieMessages.value.length > 0) {
      showMessageModal(
        sieMessages.value.join("\n") +
          "\n\nVarningarna kommer att dyka upp i din att-åtgärda-lista.",
        "SIE-import",
      );
    }

    // Gå vidare till företagsuppgifterna, där organisationsnumret nu kan vara
    // förifyllt från SIE-filen.
    currentStep.value = "foretagsuppgifter";
  } catch (e) {
    console.error(e);
    showMessageModal(
      `Ett fel uppstod: ${e instanceof Error ? e.message : "Okänt fel"}`,
      "SIE-import",
    );
    sieFile.value = undefined;
  } finally {
    busy.value = false;
  }
}

/**
 * Tar bort allt i årsredovisningen förutom organisationsnumret.
 */
function clearSieFileDataFromArsredovisning() {
  const organisationsnummer =
    arsredovisning.value.foretagsinformation.organisationsnummer;
  arsredovisning.value = createArsredovisningFromTemplate(
    starterArsredovisning,
  ); // Nollställer
  arsredovisning.value.foretagsinformation.organisationsnummer =
    organisationsnummer;
}

/**
 * Skapar upp det "slutliga nya" årsredovisningsobjektet, emittar det och
 * stänger modalen.
 */
async function createArsredovisning() {
  busy.value = true;
  try {
    // Hämta uppgifter från Bolagsverket
    await fetchRecords();
  } catch (error) {
    console.error(error);
    showMessageModal(
      "Misslyckades med att hämta företagets namn och räkenskapsår från" +
        " Bolagsverket. Du kan ändå gå vidare och arbeta på din" +
        " årsredovisning, förutsatt att du redovisar för ett K2-aktiebolag " +
        " utan revisor.",
      "Varning",
    );
  }

  // Lägg till uppgifter i att-åtgärda-listan
  populateTodoList();

  // Nu är vi klara
  emit(
    "arsredovisningCreated",
    JSON.parse(JSON.stringify(arsredovisning.value)), // Deep copy
  );
  modal.value?.hide();
}

/**
 * Fyller i företagsnamn, avgivandeinformation och verksamhetsår i
 * årsredovisningen utifrån aktuellt organisationsnummer. Kontrollerar även om
 * bolaget har krav på revisionsberättelse och visar ett meddelande i så fall.
 */
async function fetchRecords() {
  const data = await fetchCompanyRecords({
    organisationsnummer:
      arsredovisning.value.foretagsinformation.organisationsnummer,
  });

  if (!data) {
    return;
  }

  // Uppdatera årsredovisningen med data från Bolagsverket
  arsredovisning.value.foretagsinformation.foretagsnamn = data.foretagsnamn;

  if (data.harLikvidator) {
    arsredovisning.value.redovisningsinformation.avgivande =
      AvgivandeLikvidator;
  } else if (data.harVerkstallandeDirektor) {
    arsredovisning.value.redovisningsinformation.avgivande =
      AvgivandeStyrelsenOchVD;
  } else {
    arsredovisning.value.redovisningsinformation.avgivande = AvgivandeStyrelsen;
  }

  arsredovisning.value.verksamhetsarNuvarande.startdatum =
    data.rakenskapsperioder[0]?.from || "";
  arsredovisning.value.verksamhetsarNuvarande.slutdatum =
    data.rakenskapsperioder[0]?.tom || "";

  arsredovisning.value.verksamhetsarTidigare = data.rakenskapsperioder
    .slice(1)
    .map((r) => ({
      startdatum: r.from || "",
      slutdatum: r.tom || "",
    }));

  if (data.rakenskapsperioder[0].kravPaRevisionsberattelse === "ja") {
    showMessageModal(
      "Bolaget har krav på revisionsberättelse det senaste" +
        " räkenskapsåret. Observera att Gredor ej har stöd för " +
        "revisionsberättelser; du kommer ändå kunna skapa en årsredovsining i" +
        " Gredor, men du kommer inte kunna ladda upp den till Bolagsverket.",
      "OBS!",
    );
  }
}

/**
 * Populerar att-åtgärda-listan i årsredovisningen utifrån aktuellt värde på
 * arsredovisning, sieFile och sieMessages.
 */
function populateTodoList() {
  if (arsredovisning.value.verksamhetsarTidigare.length === 2) {
    // Pga ett fel hos Bolagsverket hämtas inte alltid det tredje senaste
    // (före det aktuella) räkenskapsåret automatiskt
    addTodoListItem(arsredovisning.value.gredorState.todoList, {
      id: "bolagsverket-tidigare-verksamhetsar-warning",
      title: "Antal tidigare räkenskapsår",
      timestamp: Date.now(),
      tasks: [
        {
          text:
            "Kontrollera under fliken Grunduppgifter att antalet tidigare" +
            " räkenskapsår stämmer, och korrigera det annars. (På grund av" +
            " ett fel hos Bolagsverket hämtas inte alltid alla automatiskt.)",
          complete: false,
        },
      ],
    });
  }

  if (sieFile.value != null) {
    // Vanliga att göra-uppgifter efter varje SIE-import
    addTodoListItem(arsredovisning.value.gredorState.todoList, {
      id: "sie-import-after",
      title: "Att göra efter SIE-import",
      description:
        "SIE-importen fyller inte i allt automatiskt. Följande (och" +
        " eventuellt mer) behöver du göra själv.",
      timestamp: Date.now(),
      tasks: [
        // Information om verksamheten behöver alltid fyllas i
        "Förvaltningsberättelse: Fyll i information om verksamheten",
        // Flerårsöversikten behöver kompletteras om företaget har haft mer än
        // ett tidigare räkenskapsår
        ...(arsredovisning.value.verksamhetsarTidigare.length > 1
          ? [
              "Förvaltningsberättelse: Komplettera flerårsöversikten med" +
                " tidigare räkenskapsår",
            ]
          : []),
        // Förändringar i eget kapital kan behöva kompletteras
        "Förvaltningsberättelse: Komplettera förändringar i eget kapital om" +
          " det behövs",
        // Resultatdispositionen behöver alltid kompletteras
        "Förvaltningsberättelse: Komplettera resultatdisposition med" +
          " styrelsens förslag",
        // Noter som t.ex. medelantalet anställda kan behöva läggas till
        "Noter: Lägg till eventuella noter om det behövs",
        // Underskrifter behöver alltid läggas till
        "Underskrifter: Lägg till underskrifter",
      ].map((message) => ({
        text: message,
        complete: false,
      })),
    });
  }

  if (sieMessages.value.length > 0) {
    // Varningar från SIE-importen
    addTodoListItem(arsredovisning.value.gredorState.todoList, {
      id: "sie-import-warnings",
      title: "Varningar från SIE-import",
      description: "Följande varningar uppstod när du importerade din SIE-fil.",
      timestamp: Date.now(),
      tasks: unref(sieMessages.value).map((message) => ({
        text: message,
        complete: false,
      })),
    });
  }
}

watch(sieFile, () => {
  if (sieFile.value) {
    handleSieFile(sieFile.value);
  } else {
    clearSieFileDataFromArsredovisning();
  }
});
</script>

<template>
  <CommonModal
    :id="`new-arsredovisning-modal-${instanceId}`"
    ref="modal"
    show-close-button
    title="Ny årsredovisning"
  >
    <CommonModalContents class="limit-width">
      <CommonWizardSteps
        :steps="['SIE-import', 'Företagsuppgifter']"
        :current-step-number="currentStep === 'sie-import' ? 1 : 2"
      />

      <template v-if="currentStep === 'sie-import'">
        <h5>Importera bokföring (frivilligt)</h5>

        <p>
          Har du en SIE-fil från ditt bokföringssystem kan du importera den för
          att få resultaträkningen, balansräkningen och delar av
          förvaltningsberättelsen ifyllda automatiskt. Om SIE-filen innehåller
          ett organisationsnummer fylls även det i automatiskt.
        </p>

        <p>
          Efter import bör du kontrollera att fälten blev korrekt ifyllda samt
          fylla i de uppgifter som återstår – oftast delar av
          förvaltningsberättelsen och noterna.
        </p>

        <CommonFileInput
          v-model="sieFile"
          :allowed-file-extensions="['.se', '.si', '.sie']"
          :disabled="busy"
          data-testid="new-arsredovisning-sie-file-input"
          allow-delete
        />
      </template>

      <template v-else>
        <h5>Organisationsnummer</h5>

        <p>
          Skriv in företagets organisationsnummer nedan. Gredor hämtar
          företagets namn och senaste räkenskapsår från Bolagsverket.
        </p>

        <CommonOrgnrInput
          v-model.trim="arsredovisning.foretagsinformation.organisationsnummer"
          data-testid="new-arsredovisning-modal-orgnr"
          :disabled="busy"
          placeholder="Skriv företagets organisationsnummer här…"
          class="orgnr-input"
          @validation-status-change="
            (validationStatus) => (orgnrValidationStatus = validationStatus)
          "
        />
      </template>
    </CommonModalContents>

    <CommonWizardButtons
      v-if="currentStep === 'sie-import'"
      :next-button-disabled="busy"
      :next-button-text="
        busy
          ? 'Vänta – arbetar…'
          : sieFile != null
            ? 'Nästa'
            : 'Hoppa över import'
      "
      previous-button-hidden
      @go-to-next-step="currentStep = 'foretagsuppgifter'"
    />

    <CommonWizardButtons
      v-else
      :next-button-disabled="
        busy ||
        (orgnrValidationStatus !== 'ok' &&
          orgnrValidationStatus !== 'likely_not_aktiebolag')
      "
      :next-button-text="busy ? 'Vänta – arbetar…' : 'Skapa'"
      :previous-button-disabled="busy"
      @go-to-previous-step="currentStep = 'sie-import'"
      @go-to-next-step="createArsredovisning"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.limit-width {
  width: var(--bs-modal-width);
}

:deep(.orgnr-input) {
  width: 75%;
}
</style>
