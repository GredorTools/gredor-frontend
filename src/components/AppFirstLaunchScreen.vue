<script lang="ts" setup>
/**
 * Välkomstskärm som visas första gången användaren öppnar applikationen.
 * Visar valmöjligheter för att skapa ny, öppna befintlig eller visa exempel
 * på årsredovisning. Skärmen visas endast vid första användning.
 */

import { useGredorStorage } from "@/components/common/composables/useGredorStorage.ts";
import { parseGredorFile, requestOpenFile } from "@/util/fileUtils.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { exampleArsredovisning } from "@/example/exampleArsredovisning.ts";
import EditNewArsredovisningModal from "@/components/edit/EditNewArsredovisningModal.vue";
import { nextTick, ref } from "vue";
import type { ComponentExposed } from "vue-component-type-helpers";

/** Årsredovisningen som redigeras i applikationen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

const showFirstLaunchScreen = useGredorStorage(
  "AppShowFirstLaunchScreen",
  true,
);

const newArsredovisningModalRenderId = ref<number>(0);
const newArsredovisningModal =
  ref<ComponentExposed<typeof EditNewArsredovisningModal>>();

// Hantering av knappar
async function showNewArsredovisningModal() {
  if (!showFirstLaunchScreen.value) {
    return; // Förhindra flera klick
  }

  newArsredovisningModalRenderId.value++; // Så att komponenten nollställs
  await nextTick(); // Vänta tills den har uppdaterats
  newArsredovisningModal.value?.show(); // Nu kan vi visa modalen
}

async function importFile() {
  if (!showFirstLaunchScreen.value) {
    return; // Förhindra flera klick
  }

  const file = await requestOpenFile(".gredorutkast,.gredorfardig");
  const json = await file?.text();
  if (json) {
    arsredovisning.value = parseGredorFile<Arsredovisning>(json, [
      "arsredovisning_utkast",
      "arsredovisning_fardig",
    ]).data;
    showFirstLaunchScreen.value = false;
  }
}

function showExampleArsredovisning() {
  if (!showFirstLaunchScreen.value) {
    return; // Förhindra flera klick
  }

  arsredovisning.value = exampleArsredovisning;
  showFirstLaunchScreen.value = false;
}

// Callbacks
function onArsredovisningCreated(value: Arsredovisning) {
  if (!showFirstLaunchScreen.value) {
    return; // Förhindra flera klick
  }

  arsredovisning.value = value;
  showFirstLaunchScreen.value = false;
}
</script>

<template>
  <transition appear name="fade">
    <div v-if="showFirstLaunchScreen" class="first-launch-container">
      <div class="card text-center d-flex flex-column align-items-center gap-3">
        <h2>Välkommen till Gredor!</h2>
        <p>
          Ett verktyg för att skapa årsredovisningar<br />
          och ladda upp dem till Bolagsverket, helt gratis.
        </p>
        <h4>Vad vill du göra?</h4>
        <div class="d-flex flex-column gap-3">
          <button class="btn btn-primary" @click="showNewArsredovisningModal">
            <i class="bi bi-file-earmark"></i>Börja på en ny årsredovisning
          </button>
          <button class="btn btn-primary" @click="importFile">
            <i class="bi bi-folder2-open"></i>Öppna en sparad årsredovisning
          </button>
          <button class="btn btn-primary" @click="showExampleArsredovisning">
            <i class="bi bi-eye"></i>Visa en exempel-årsredovisning
          </button>
        </div>
        <hr />
        <p>
          <strong>Tips!</strong> Efter att du har börjat på en årsredovisning
          kommer det att finnas en knapp i övre högra hörnet, som ger dig en
          rundtur av Gredor.
        </p>
        <p>
          Mer information om Gredor finns nedan – det är bara att skrolla ner
          lite.
        </p>
      </div>
    </div>
  </transition>

  <EditNewArsredovisningModal
    :key="`modal-render-${newArsredovisningModalRenderId}`"
    ref="newArsredovisningModal"
    instance-id="AppFirstLaunchScreen"
    @arsredovisning-created="onArsredovisningCreated"
  />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.first-launch-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    padding: $spacing-xxl $spacing-xl;

    button {
      width: 100%;
    }

    hr {
      width: 100%;
    }

    p {
      max-width: 60ch;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;

    background: $background-medium;
    mask: linear-gradient(to bottom, transparent 75%, black 100%);
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
