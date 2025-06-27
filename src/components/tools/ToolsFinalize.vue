<script lang="ts" setup>
/**
 * En komponent med verktyg för att slutföra och exportera årsredovisningen.
 * Tillåter användaren att exportera årsredovisningen som en iXBRL-fil.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { requestSaveFile } from "@/util/fileUtils.ts";
import { convertVueHTMLToiXBRL } from "@/util/documentUtils.ts";

const props = defineProps<{
  /** Årsredovisningen som ska exporteras. */
  arsredovisning: Arsredovisning;
}>();

async function exportArsredovisning() {
  const arsredovisningForExport = document.getElementById(
    "arsredovisning-for-export",
  );

  if (arsredovisningForExport) {
    const { foretagsinformation } = props.arsredovisning;
    const xhtml = await convertVueHTMLToiXBRL(
      arsredovisningForExport,
      `${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning`,
    );
    requestSaveFile(xhtml, "arsredovisning.xhtml", "text/html");
  }
}
</script>

<template>
  <div class="finalize-tools d-flex justify-content-end">
    <button class="btn btn-primary" @click="exportArsredovisning()">
      Exportera iXBRL-fil
    </button>
  </div>
</template>

<style lang="scss" scoped>
.finalize-tools {
  /* Matcha pappret ovan */
  width: 210mm;
}
</style>
