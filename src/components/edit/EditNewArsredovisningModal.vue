<script lang="ts" setup>
/**
 * En modal som låter användaren börja på en ny årsredovisning. Användaren
 * fyller i företagets organisationsnummer, och företagets namn och fyra senaste
 * räkenskapsår hämtas automatiskt från Bolagsverket. Användaren har även
 * möjlighet att importera en SIE-fil.
 */

import { ref } from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import CommonFileInput from "@/components/common/CommonFileInput.vue";
import { starterArsredovisning } from "@/example/starterArsredovisning.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { mapSieFileIntoArsredovisning } from "@/util/sieUtils.ts";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import createClient from "openapi-fetch";
import type { paths } from "@/openapi/gredor-backend-v1";
import { getConfigValue } from "@/util/configUtils.ts";
import type { ComponentExposed } from "vue-component-type-helpers";
import { tryFormatOrgnr } from "@/util/formatUtils.ts";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";

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
  JSON.parse(JSON.stringify(starterArsredovisning)), // Deep copy
);

const busy = ref<boolean>(false);

const { showMessageModal } = useModalStore();

async function handleSieFile(file: File) {
  busy.value = true;
  try {
    const organisationsnummer =
      arsredovisning.value.foretagsinformation.organisationsnummer;
    arsredovisning.value = JSON.parse(JSON.stringify(starterArsredovisning)); // Nollställer
    arsredovisning.value.foretagsinformation.organisationsnummer =
      organisationsnummer;

    const sieFileText = await file.text();
    await mapSieFileIntoArsredovisning(
      sieFileText,
      arsredovisning.value,
      (message) => showMessageModal(message, "SIE-import"),
    );
  } finally {
    busy.value = false;
  }
}

async function fetchRecordsAndEmit() {
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

  arsredovisning.value.foretagsinformation.foretagsnamn = data.foretagsnamn;

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

  // TODO: Om krav på revisionsberättelse, visa meddelande
}

const orgnrRegex = /^\d{6}-?\d{4}$/;
</script>

<template>
  <CommonModal
    :id="`new-arsredovisning-modal-${instanceId}`"
    ref="modal"
    show-close-button
    title="Ny årsredovisning"
  >
    <div class="limit-width">
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
        @file-picked="handleSieFile"
      />
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        busy ||
        !orgnrRegex.test(arsredovisning.foretagsinformation.organisationsnummer)
      "
      :next-button-text="busy ? 'Vänta – arbetar…' : 'Skapa'"
      previous-button-hidden
      @go-to-next-step="fetchRecordsAndEmit"
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

input {
  width: 75%;
}
</style>
