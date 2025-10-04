<script lang="ts" setup>
/**
 * Applikationens sidhuvud inklusive huvudmeny.
 */

import { getConfigValue } from "@/util/configUtils.ts";
import { nextTick, onMounted, ref, useTemplateRef } from "vue";
import { parseGredorFile, requestOpenFile, requestSaveFile } from "@/util/fileUtils.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import { mapSieFileIntoArsredovisning } from "@/util/sieUtils.ts";
import EditNewArsredovisningModal from "@/components/edit/EditNewArsredovisningModal.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import { useGredorStorage } from "@/components/common/composables/useGredorStorage.ts";
import { Tooltip } from "bootstrap";
import type VueOnboardingTour from "vue-onboarding-tour";
import { tourSteps } from "@/tourSteps.ts";

/** Årsredovisningen som redigeras i applikationen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

const environmentName = getConfigValue("VITE_ENV_NAME");

// Tooltip för rundtur - visas automatiskt när sidan laddas första gången
const tourBtn = useTemplateRef("tour-btn");
const tourTooltipHasBeenDisplayed = useGredorStorage(
  "AppTourTooltipHasBeenDisplayed",
  false,
);
if (!tourTooltipHasBeenDisplayed.value) {
  onMounted(() => {
    const element = tourBtn.value;
    if (element) {
      const tooltip = new Tooltip(element);
      setTimeout(() => {
        tooltip.show();
        setTimeout(() => {
          tooltip.hide();
          tourTooltipHasBeenDisplayed.value = true;
        }, 5000);
      }, 500);
    }
  });
}

// Rundtur
const tour = ref<ComponentExposed<typeof VueOnboardingTour>>();

function startTour() {
  // @ts-expect-error Något fel med typerna i VueOnboardingTour - nedan ska fungera
  tour.value?.startTour();
}

function endTour() {
  window.scrollTo(0, 0);
}

// I/O
const newArsredovisningModalRenderId = ref<number>(0);
const newArsredovisningModal =
  ref<ComponentExposed<typeof EditNewArsredovisningModal>>();

async function showNewArsredovisningModal() {
  newArsredovisningModalRenderId.value++; // Så att komponenten nollställs
  await nextTick(); // Vänta tills den har uppdaterats
  newArsredovisningModal.value?.show(); // Nu kan vi visa modalen
}

async function importFile() {
  const file = await requestOpenFile(".gredorutkast,.gredorfardig");
  const json = await file?.text();
  if (json) {
    arsredovisning.value = parseGredorFile<Arsredovisning>(json, [
      "arsredovisning_utkast",
      "arsredovisning_fardig",
    ]).data;
  }
}

function exportFile() {
  const dataContainer: DataContainer<Arsredovisning> = {
    dataType: "arsredovisning_utkast",
    version: 1,
    data: arsredovisning.value,
  };

  requestSaveFile(
    JSON.stringify(dataContainer),
    `Arsredovisning_${new Date().getTime()}.gredorutkast`,
    "application/json",
  );
}

async function importSIE() {
  // TODO: Visa meddelande om att saker rensas...
  const file = await requestOpenFile(".se,.si,.sie");
  const text = await file?.text();
  if (text) {
    await mapSieFileIntoArsredovisning(text, arsredovisning.value);
  }
}
</script>

<template>
  <header class="d-flex flex-row justify-content-between">
    <div class="d-flex">
      <h1>
        <img
          alt="Gredor – gratis årsredovisning"
          src="/src/assets/img/logo.svg"
        />
        <span v-if="environmentName" aria-label="Miljö" class="environment">{{
          environmentName
        }}</span>
      </h1>

      <div class="d-flex gap-2 menu">
        <button
          id="newArsredovisningBtn"
          class="btn btn-primary"
          @click="showNewArsredovisningModal"
        >
          Ny årsredovisning…
        </button>
        <div id="openAndSaveArsredovisningBtns" class="d-flex gap-2">
          <button
            id="openArsredovisningBtn"
            class="btn btn-primary"
            @click="importFile"
          >
            Öppna…
          </button>
          <button
            id="saveArsredovisningBtn"
            class="btn btn-primary"
            @click="exportFile"
          >
            Spara som…
          </button>
        </div>
        <button
          v-if="getConfigValue('VITE_TEST_MODE') === 'true'"
          class="btn btn-outline-primary"
          @click="importSIE"
        >
          Importera SIE-fil… (test)
        </button>
      </div>
    </div>

    <button
      id="tour-btn"
      ref="tour-btn"
      aria-label="Starta rundtur genom applikationen"
      class="btn btn-secondary"
      data-bs-offset="[0, 12]"
      data-bs-placement="left"
      data-bs-title="Första gången här? Ta rundturen!"
      data-bs-toggle="tooltip"
      data-bs-trigger="manual"
      @click="startTour"
    >
      Rundtur
    </button>
  </header>

  <EditNewArsredovisningModal
    :key="`modal-render-${newArsredovisningModalRenderId}`"
    ref="newArsredovisningModal"
    @arsredovisning-created="(value) => (arsredovisning = value)"
  />

  <VueOnboardingTour
    ref="tour"
    :steps="tourSteps"
    label-terminate="Avsluta rundtur"
    tour-id="appTour"
    @end-tour="endTour"
  />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

header {
  grid-column: 1 / span 2;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid rgba($primary-color, 0.2);

  h1 {
    margin-bottom: 0;
    display: flex;
    align-items: center;

    img {
      height: 52px;
    }

    .environment {
      position: relative;
      left: 16px;
      top: -3px;
      color: $secondary-color;
      font-weight: 600;
      font-style: italic;
      font-size: 18pt;
    }
  }

  .menu {
    padding-left: $spacing-xl;
    border-left: 1px solid $border-color-normal;
    margin-left: $spacing-xl;
  }
}
</style>
