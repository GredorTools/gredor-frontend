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

async function handleSieFile(file: File) {
  busy.value = true;
  setTimeout(async () => {
    try {
      const sieFileText = await file.text();
      await mapSieFileIntoArsredovisning(sieFileText, arsredovisning.value);
    } finally {
      busy.value = false;
    }
  }, 100);
}

function fetchRecordsAndEmit() {
  busy.value = true;
  setTimeout(async () => {
    try {
      await fetchRecords();
    } catch (error) {
      console.error(error);
      alert(
        "Misslyckades med att hämta företagets namn och räkenskapsår från Bolagsverket.",
      );
    } finally {
      modal.value?.hide();
      emit(
        "arsredovisningCreated",
        JSON.parse(JSON.stringify(arsredovisning.value)),
      ); // Deep copy
      busy.value = false;
    }
  }, 100);
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

const orgnrRegex = /^\d{6}-\d{4}$/;
</script>

<template>
  <CommonModal
    id="new-arsredovisning-modal"
    ref="modal"
    title="Ny årsredovisning"
  >
    <div class="limit-width">
      <h5>Organisationsnummer</h5>

      <p>
        Skriv in företagets organisationsnummer nedan. Gredor kommer att hämta
        företagets namn och senaste räkenskapsår från Bolagsverket.
      </p>

      <p>Format: XXXXXX-XXXX (10 siffror med bindestreck)</p>

      <input
        v-model.trim="arsredovisning.foretagsinformation.organisationsnummer"
        :disabled="busy"
        maxlength="11"
        placeholder="Skriv företagets organisationsnummer här…"
        type="text"
      />

      <h5>Bokföringsimport (frivilligt)</h5>

      <p>
        Om du har en SIE-fil från ditt bokföringssystem kan du importera den här
        och få resultaträkningen, balansräkningen samt delar av
        förvaltningsberättelsen ifyllda automatiskt.
      </p>

      <p>
        Tänk på att kontrollera i efterhand att fälten blev korrekt ifyllda, och
        att själv fylla i de uppgifter som återstår (bland annat noter).
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
.limit-width {
  width: var(--bs-modal-width);
}

h5:not(:first-of-type) {
  margin-top: 1.5rem;
}

input {
  width: 75%;
}
</style>
