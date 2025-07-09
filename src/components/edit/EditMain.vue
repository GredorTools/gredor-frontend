<script lang="ts" setup>
/**
 * Huvudkomponenten för redigering av årsredovisningen.
 * Hanterar navigering mellan olika delar av årsredovisningen samt import och export av data.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditResultatrakning from "@/components/edit/sections/EditResultatrakning.vue";
import {
  parseGredorFile,
  requestOpenFile,
  requestSaveFile,
} from "@/util/fileUtils.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import EditBalansrakning from "@/components/edit/sections/EditBalansrakning.vue";
import { type Ref, ref } from "vue";
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

const newArsredovisningModal =
  ref<ComponentExposed<typeof EditNewArsredovisningModal>>();

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
  | "signaturer";
const availableModes: { [mode in Mode]: string } = {
  grunduppgifter: "Grunduppgifter",
  forvaltningsberattelse: "Förvaltningsberättelse",
  resultatrakning: "Resultaträkning",
  balansrakning: "Balansräkning",
  noter: "Noter",
  signaturer: "Signaturer",
};
const currentMode: Ref<Mode> = ref("grunduppgifter");
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="d-flex gap-2">
      <button class="btn btn-primary" @click="newArsredovisningModal?.show()">
        Ny årsredovisning…
      </button>
      <button class="btn btn-primary" @click="importFile">Öppna…</button>
      <button class="btn btn-primary" @click="exportFile">Spara som…</button>
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
    <Suspense v-if="currentMode === 'signaturer'">
      <EditSignatures v-model:arsredovisning="arsredovisning" />
    </Suspense>
  </div>

  <EditNewArsredovisningModal
    ref="newArsredovisningModal"
    @arsredovisning-created="(value) => (arsredovisning = value)"
  />
</template>

<style lang="scss" scoped>
.nav {
  margin-top: 2rem;
}

.editor {
  margin-top: 1rem;
}

:deep(table) {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;

  &:not(:first-of-type) {
    margin-top: 3rem;
  }

  th {
    vertical-align: bottom;
  }

  th,
  td {
    border-style: hidden;
    text-align: left;
    padding: 0.25rem 0.5rem;

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
      text-align: right;

      input {
        min-width: 120px;
        text-align: right;
      }
    }

    input {
      width: 100%;
    }
  }
}
</style>
