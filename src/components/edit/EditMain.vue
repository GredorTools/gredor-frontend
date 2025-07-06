<script lang="ts" setup>
/**
 * Huvudkomponenten för redigering av årsredovisningen.
 * Hanterar navigering mellan olika delar av årsredovisningen samt import och export av data.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditResultatrakning from "@/components/edit/EditResultatrakning.vue";
import {
  parseGredorFile,
  requestOpenFile,
  requestSaveFile,
} from "@/util/fileUtils.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import EditBalansrakning from "@/components/edit/EditBalansrakning.vue";
import { type Ref, ref } from "vue";
import EditNoter from "@/components/edit/EditNoter.vue";
import EditForvaltningsberattelse from "@/components/edit/EditForvaltningsberattelse.vue";
import EditGrunduppgifter from "@/components/edit/EditGrunduppgifter.vue";
import EditSignatures from "@/components/edit/EditSignatures.vue";
import { emptyArsredovisning } from "@/example/EmptyArsredovisning.ts";

/** Årsredovisningen som redigeras i applikationen. */
const arsredovisning = defineModel<Arsredovisning>({
  required: true,
});

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

function clearData() {
  arsredovisning.value = JSON.parse(JSON.stringify(emptyArsredovisning)); // Deep copy;
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
      <button class="btn btn-primary" @click="importFile">Öppna…</button>
      <button class="btn btn-primary" @click="exportFile">Spara som…</button>
    </div>
    <button class="btn btn-danger float-end" @click="clearData">
      Rensa allt
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
      min-width: 40px;
    }

    &.value-container {
      text-align: right;

      input {
        min-width: 100px;
        text-align: right;
      }
    }

    input {
      width: 100%;
    }
  }
}
</style>
