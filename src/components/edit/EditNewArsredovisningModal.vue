<script lang="ts" setup>
/**
 * En modal som låter användaren börja på en ny årsredovisning. Användaren
 * fyller i företagets organisationsnummer, och företagets namn och fyra senaste
 * räkenskapsår hämtas automatiskt från Bolagsverket. Användaren har även
 * möjlighet att importera en SIE-fil.
 */

import { computed, ref, unref } from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import CommonFileInput from "@/components/common/CommonFileInput.vue";
import { starterArsredovisning } from "@/templates/starterArsredovisning.ts";
import {
  type Arsredovisning,
  createArsredovisningFromTemplate,
} from "@/model/arsredovisning/Arsredovisning.ts";
import { mapSieFileIntoArsredovisning } from "@/util/sieUtils.ts";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import createClient from "openapi-fetch";
import type { paths } from "@/openapi/gredor-backend-v1";
import { getConfigValue } from "@/util/configUtils.ts";
import type { ComponentExposed } from "vue-component-type-helpers";
import { tryFormatOrgnr } from "@/util/formatUtils.ts";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import {
  AvgivandeLikvidator,
  AvgivandeStyrelsen,
  AvgivandeStyrelsenOchVD,
} from "@/data/avgivande.ts";
import { addTodoListItem } from "@/model/todolist/TodoList.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import LuhnAlgorithm from "@designbycode/luhn-algorithm";

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
const sieMessages = ref<string[]>([]);

const busy = ref<boolean>(false);

const { showMessageModal } = useModalStore();

async function handleSieFile(file: File) {
  busy.value = true;

  try {
    const organisationsnummer =
      arsredovisning.value.foretagsinformation.organisationsnummer;
    arsredovisning.value = createArsredovisningFromTemplate(
      starterArsredovisning,
    ); // Nollställer
    arsredovisning.value.foretagsinformation.organisationsnummer =
      organisationsnummer;

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
  } finally {
    busy.value = false;
  }
}

async function createArsredovisning() {
  busy.value = true;
  try {
    await fetchRecords();
  } catch (error) {
    console.error(error);
    showMessageModal(
      "Misslyckades med att hämta företagets namn och räkenskapsår från" +
        " Bolagsverket. Du kan ändå gå vidare och arbeta på din årsredovisning.",
      "Varning",
    );
  } finally {
    if (sieMessages.value.length > 0) {
      addTodoListItem(arsredovisning.value.gredorState.todoList, {
        id: "sie-import",
        title: "Varningar från SIE-import",
        description:
          "Följande varningar uppstod när du importerade din SIE-fil.",
        timestamp: Date.now(),
        tasks: unref(sieMessages.value).map((message) => ({
          text: message,
          complete: false,
        })),
      });
    }

    emit(
      "arsredovisningCreated",
      JSON.parse(JSON.stringify(arsredovisning.value)), // Deep copy
    );
    modal.value?.hide();
  }
}

async function fetchRecords() {
  const client = createClient<paths>({
    baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
  });

  const {
    data, // only present if 2XX response
    error, // only present if 4XX or 5XX response
  } = await client.GET("/v1/information/records/{orgnr}", {
    params: {
      path: {
        orgnr:
          arsredovisning.value.foretagsinformation.organisationsnummer.replace(
            "-",
            "",
          ),
      },
    },
  });

  if (error) {
    throw new Error(error);
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

const orgnrRegex = /^\d{6}-?\d{4}$/;

const orgnrCorrectFormatButInvalidLuhn = computed(
  () =>
    orgnrRegex.test(
      arsredovisning.value.foretagsinformation.organisationsnummer,
    ) &&
    !LuhnAlgorithm.isValid(
      arsredovisning.value.foretagsinformation.organisationsnummer.replace(
        "-",
        "",
      ),
    ),
);
</script>

<template>
  <CommonModal
    :id="`new-arsredovisning-modal-${instanceId}`"
    ref="modal"
    show-close-button
    title="Ny årsredovisning"
  >
    <CommonModalContents class="limit-width">
      <h5>Organisationsnummer</h5>

      <p>
        Skriv in företagets organisationsnummer nedan. Gredor kommer att hämta
        företagets namn och senaste räkenskapsår från Bolagsverket.
      </p>

      <input
        v-model.trim="arsredovisning.foretagsinformation.organisationsnummer"
        :disabled="busy"
        data-testid="new-arsredovisning-modal-orgnr"
        maxlength="11"
        name="organisationsnummer"
        placeholder="Skriv företagets organisationsnummer här…"
        type="text"
        @input="
          arsredovisning.foretagsinformation.organisationsnummer =
            tryFormatOrgnr(
              arsredovisning.foretagsinformation.organisationsnummer,
            )
        "
      />
      <strong v-if="orgnrCorrectFormatButInvalidLuhn" class="d-block mt-2"
        >Ogiltigt organisationsnummer.</strong
      >

      <h5>Bokföringsimport (frivilligt)</h5>

      <p>
        Om du har en SIE-fil från ditt bokföringssystem kan du importera den här
        och få resultaträkningen, balansräkningen samt delar av
        förvaltningsberättelsen ifyllda automatiskt.
      </p>

      <p>
        Tänk på att kontrollera efteråt att fälten blev korrekt ifyllda, och att
        själv fylla i de uppgifter som återstår – oftast delar av
        förvaltningsberättelsen och noterna.
      </p>

      <CommonFileInput
        :allowed-file-extensions="['.se', '.si', '.sie']"
        :disabled="busy"
        data-testid="new-arsredovisning-sie-file-input"
        @file-picked="handleSieFile"
      />
    </CommonModalContents>

    <CommonWizardButtons
      :next-button-disabled="
        busy ||
        !orgnrRegex.test(
          arsredovisning.foretagsinformation.organisationsnummer,
        ) ||
        orgnrCorrectFormatButInvalidLuhn
      "
      :next-button-text="busy ? 'Vänta – arbetar…' : 'Skapa'"
      previous-button-hidden
      @go-to-next-step="createArsredovisning"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.limit-width {
  width: var(--bs-modal-width);
}

h5:not(:first-of-type) {
  margin-top: $spacing-xxl;
}

input[type="text"] {
  width: 75%;
}
</style>
