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

const arsredovsining = defineModel<Arsredovisning>({
  required: true,
});

async function importFile() {
  const file = await FileUtil.importFile();
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
    `Gredor_${new Date().getTime()}.json`,
    "application/json",
  );
}

type Mode =
  | "grunduppgifter"
  | "forvaltningsberattelse"
  | "resultatrakning"
  | "balansrakning"
  | "noter";
const currentMode: Ref<Mode> = ref("grunduppgifter");
</script>

<template>
  <button @click="importFile">Öppna…</button>
  <button @click="exportFile">Spara som…</button>

  <div class="mode-selector">
    <select v-model="currentMode">
      <option value="grunduppgifter">Grunduppgifter</option>
      <option value="forvaltningsberattelse">Förvaltningsberättelse</option>
      <option value="resultatrakning">Resultaträkning</option>
      <option value="balansrakning">Balansräkning</option>
      <option value="noter">Noter</option>
    </select>
  </div>

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
