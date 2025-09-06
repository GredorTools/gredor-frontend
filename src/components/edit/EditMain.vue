<script lang="ts" setup>
/**
 * Huvudkomponenten för redigering av årsredovisningen.
 * Hanterar navigering mellan olika delar av årsredovisningen samt import och export av data.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditResultatrakning from "@/components/edit/sections/EditResultatrakning.vue";
import { parseGredorFile, requestOpenFile, requestSaveFile } from "@/util/fileUtils.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import EditBalansrakning from "@/components/edit/sections/EditBalansrakning.vue";
import { nextTick, type Ref, ref } from "vue";
import EditNoter from "@/components/edit/sections/EditNoter.vue";
import EditForvaltningsberattelse from "@/components/edit/sections/EditForvaltningsberattelse.vue";
import EditGrunduppgifter from "@/components/edit/sections/EditGrunduppgifter.vue";
import EditSignatures from "@/components/edit/sections/EditSignatures.vue";
import { mapSieFileIntoArsredovisning } from "@/util/sieUtils.ts";
import EditNewArsredovisningModal from "@/components/edit/EditNewArsredovisningModal.vue";
import type { ComponentExposed } from "vue-component-type-helpers";

/** Årsredovisningen som redigeras i applikationen. */
const arsredovisning = defineModel<Arsredovisning>({
  required: true,
});

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

type Mode =
  | "grunduppgifter"
  | "forvaltningsberattelse"
  | "resultatrakning"
  | "balansrakning"
  | "noter"
  | "faststallande";
const availableModes: { [mode in Mode]: string } = {
  grunduppgifter: "Grunduppgifter",
  forvaltningsberattelse: "Förvaltningsberättelse",
  resultatrakning: "Resultaträkning",
  balansrakning: "Balansräkning",
  noter: "Noter",
  faststallande: "Fastställande",
};
const currentMode: Ref<Mode> = ref("grunduppgifter");
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="d-flex gap-2">
      <button
        id="newArsredovisningBtn"
        class="btn btn-primary"
        @click="showNewArsredovisningModal"
      >
        Ny årsredovisning…
      </button>
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
    <button class="btn btn-primary" @click="importSIE">
      Importera SIE-fil…
    </button>
  </div>
  <hr />

  <ul class="nav nav-tabs">
    <li
      v-for="[mode, modeName] in Object.entries(availableModes)"
      :key="mode"
      class="nav-item"
    >
      <a
        :class="{ active: currentMode === mode }"
        class="nav-link"
        href="#"
        @click="currentMode = mode as Mode"
        >{{ modeName }}</a
      >
    </li>
  </ul>

  <div class="editor">
    <Suspense v-if="currentMode === 'grunduppgifter'">
      <EditGrunduppgifter v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'forvaltningsberattelse'">
      <EditForvaltningsberattelse v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'resultatrakning'">
      <EditResultatrakning v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'balansrakning'">
      <EditBalansrakning v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'noter'">
      <EditNoter v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'faststallande'">
      <EditSignatures v-model:arsredovisning="arsredovisning" />
    </Suspense>
  </div>

  <EditNewArsredovisningModal
    :key="`modal-render-${newArsredovisningModalRenderId}`"
    ref="newArsredovisningModal"
    @arsredovisning-created="(value) => (arsredovisning = value)"
  />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.nav {
  margin-top: $spacing-xl;
  border-bottom: 1px solid $border-color-normal;
}

.nav-tabs {
  .nav-item {
    margin-bottom: -1px;

    .nav-link {
      color: $medium;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      font-weight: 500;
      transition: $transition-base;

      &:hover {
        color: $primary-color;
        background-color: rgba($primary-color, 0.2);
      }

      &.active {
        color: $primary-color;
        background-color: $background-light;
        border-color: $border-color-normal $border-color-normal
          $background-light;
      }
    }
  }
}

.editor {
  padding: $spacing-lg $spacing-md;
  background-color: $background-light;
  border: 1px solid $border-color-normal;
  border-top: none;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
}

:deep(table) {
  width: 100%;
  margin-top: $spacing-md;
  margin-bottom: $spacing-md;

  &:not(:first-of-type) {
    margin-top: $spacing-xxl;
  }

  th {
    vertical-align: bottom;
  }

  th,
  td {
    border-style: hidden;
    text-align: left;
    padding: $spacing-xs $spacing-sm;

    &:first-child {
      width: 99%;
    }

    &:not(:first-child) {
      white-space: nowrap;
    }

    &.not-container {
      min-width: 54px;
    }

    &.value-container {
      input,
      select {
        min-width: 120px;
      }

      &:not(.text-left) {
        text-align: right;

        input {
          text-align: right;
        }
      }
    }

    input,
    select {
      width: 100%;
    }
  }

  // Avstånd mellan belopprader
  tr.abstract.level-1:not(:first-child) td {
    padding-top: $spacing-xxl;
  }

  tr.abstract.level-2 td {
    padding-top: $spacing-xl;
  }

  tr.abstract.level-3 td {
    padding-top: $spacing-lg;
  }

  tr.abstract.level-4 td {
    padding-top: $spacing-md;
  }

  tr.abstract.level-1 + tr.abstract.level-2 td {
    padding-top: $spacing-md;
  }

  tr.abstract.level-2 + tr.abstract.level-3 td {
    padding-top: $spacing-sm;
  }

  tr.abstract.level-3 + tr.abstract.level-4 td {
    padding-top: $spacing-xs;
  }
}
</style>
