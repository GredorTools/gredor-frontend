<script lang="ts" setup>
/**
 * En komponent som är en slags verktygslåda med verktyg för att färdigställa
 * och lämna in årsredovisningen till Bolagsverket.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { requestSaveFile } from "@/util/fileUtils.ts";
import { convertVueHTMLToiXBRL } from "@/util/documentUtils.ts";
import { ref } from "vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import SendWizard from "@/components/tools/finish/send/SendWizard.vue";
import FinalizeWizard from "@/components/tools/finish/finalize/FinalizeWizard.vue";

const props = defineProps<{
  /** Årsredovisningen som ska exporteras. */
  arsredovisning: Arsredovisning;
}>();

const finalizeWizard = ref<ComponentExposed<typeof FinalizeWizard>>();
const sendWizard = ref<ComponentExposed<typeof SendWizard>>();

async function getIXBRL(): Promise<string | undefined> {
  const arsredovisningForExport = document.getElementById(
    "arsredovisning-for-export",
  );

  if (arsredovisningForExport) {
    const { foretagsinformation } = props.arsredovisning;
    return await convertVueHTMLToiXBRL(
      arsredovisningForExport,
      `${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning`,
    );
  }
}

async function exportArsredovisning() {
  const ixbrl = await getIXBRL();
  if (ixbrl) {
    requestSaveFile(ixbrl, "arsredovisning.xhtml", "text/html");
  }
}
</script>

<template>
  <div class="finalize-tools d-flex justify-content-end gap-2">
    <button class="btn btn-outline-primary" @click="exportArsredovisning()">
      Exportera iXBRL-fil (test)
    </button>
    <button class="btn btn-primary" @click="finalizeWizard?.show()">
      Färdigställ inför årsstämma
    </button>
    <button class="btn btn-primary" @click="sendWizard?.show()">
      Skicka in till Bolagsverket efter årsstämma
    </button>
  </div>
  <FinalizeWizard ref="finalizeWizard" :arsredovisning="arsredovisning" />
  <SendWizard ref="sendWizard" />
</template>

<style lang="scss" scoped>
.finalize-tools {
  /* Matcha pappret ovan */
  width: 210mm;
}
</style>
