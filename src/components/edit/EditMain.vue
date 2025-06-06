<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditResultatrakning from "@/components/edit/EditResultatrakning.vue";
import { FileUtil } from "@/util/FileUtil.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import EditBalansrakning from "@/components/edit/EditBalansrakning.vue";
import { type Ref, ref } from "vue";
import EditNoter from "@/components/edit/EditNoter.vue";
import EditForvaltningsberattelse from "@/components/edit/EditForvaltningsberattelse.vue";
import EditGrunduppgifter from "@/components/edit/EditGrunduppgifter.vue";
import EditSignatures from "@/components/edit/EditSignatures.vue";
import EditFaststallelseintyg from "@/components/edit/EditFaststallelseintyg.vue";
import { emptyArsredovisning } from "@/example/EmptyArsredovisning.ts";

const arsredovsining = defineModel<Arsredovisning>({
  required: true,
});

async function importFile() {
  const file = await FileUtil.importFile(".gredor");
  if (file) {
    const dataContainer: DataContainer<Arsredovisning> = JSON.parse(file);
    // TODO: Validera
    arsredovsining.value = dataContainer.data;
  }
}

function exportFile() {
  const dataContainer: DataContainer<Arsredovisning> = {
    dataType: "Arsredovisning",
    version: 1,
    data: arsredovsining.value,
  };

  FileUtil.exportFile(
    JSON.stringify(dataContainer),
    `Arsredovisning_${new Date().getTime()}.gredor`,
    "application/json",
  );
}

function clearData() {
  arsredovsining.value = JSON.parse(JSON.stringify(emptyArsredovisning)); // Deep copy;
}

type Mode =
  | "grunduppgifter"
  | "forvaltningsberattelse"
  | "resultatrakning"
  | "balansrakning"
  | "noter"
  | "signaturer"
  | "faststallelseintyg";
const availableModes: { [mode in Mode]: string } = {
  grunduppgifter: "Grunduppgifter",
  forvaltningsberattelse: "Förvaltningsberättelse",
  resultatrakning: "Resultaträkning",
  balansrakning: "Balansräkning",
  noter: "Noter",
  signaturer: "Signaturer",
  faststallelseintyg: "Fastställelseintyg",
};
const currentMode: Ref<Mode> = ref("grunduppgifter");
</script>

<template>
  <button class="btn btn-primary" @click="importFile">Öppna…</button>
  <button class="btn btn-primary" @click="exportFile">Spara som…</button>
  <button class="btn btn-danger float-end" @click="clearData">
    Rensa allt
  </button>

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
      <EditGrunduppgifter v-model:arsredovisning="arsredovsining" />
    </Suspense>
    <Suspense v-if="currentMode === 'forvaltningsberattelse'">
      <EditForvaltningsberattelse v-model:arsredovisning="arsredovsining" />
    </Suspense>
    <Suspense v-if="currentMode === 'resultatrakning'">
      <EditResultatrakning v-model:arsredovisning="arsredovsining" />
    </Suspense>
    <Suspense v-if="currentMode === 'balansrakning'">
      <EditBalansrakning v-model:arsredovisning="arsredovsining" />
    </Suspense>
    <Suspense v-if="currentMode === 'noter'">
      <EditNoter v-model:arsredovisning="arsredovsining" />
    </Suspense>
    <Suspense v-if="currentMode === 'signaturer'">
      <EditSignatures v-model:arsredovisning="arsredovsining" />
    </Suspense>
    <Suspense v-if="currentMode === 'faststallelseintyg'">
      <EditFaststallelseintyg v-model:arsredovisning="arsredovsining" />
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
.mode-selector {
  margin-top: 3rem;
}

.editor {
  margin-top: 1rem;
}
</style>
