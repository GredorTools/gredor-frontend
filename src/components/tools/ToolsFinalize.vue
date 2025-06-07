<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { FileUtil } from "@/util/FileUtil.ts";
import { DocumentUtil } from "@/util/DocumentUtil.ts";

const props = defineProps<{
  arsredovisning: Arsredovisning;
}>();

async function exportArsredovisning() {
  const arsredovisningForExport = document.getElementById(
    "arsredovisning-for-export",
  );

  if (arsredovisningForExport) {
    const { foretagsinformation } = props.arsredovisning;
    const xhtml = await DocumentUtil.convertVueHTMLToiXBRL(
      arsredovisningForExport,
      `${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning`,
    );
    FileUtil.exportFile(xhtml, "arsredovisning.xhtml", "text/html");
  }
}
</script>

<template>
  <button class="btn btn-primary" @click="exportArsredovisning()">
    Exportera iXBRL-fil
  </button>
</template>

<style lang="scss" scoped></style>
