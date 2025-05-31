<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { FileUtil } from "@/util/FileUtil.ts";
import { DocumentUtil } from "@/util/DocumentUtil.ts";

const props = defineProps<{
  arsredovsining: Arsredovisning;
}>();

function exportArsredovisning() {
  const arsredovisningForExport = document.getElementById(
    "arsredovisning-for-export",
  );

  if (arsredovisningForExport) {
    const { foretagsinformation } = props.arsredovsining;
    const xhtml = DocumentUtil.convertVueHTMLToiXBRL(
      arsredovisningForExport,
      `${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning`,
    );
    FileUtil.exportFile(xhtml, "arsredovisning.xhtml", "text/html");
  }
}
</script>

<template>
  <button @click="exportArsredovisning()">Exportera</button>
</template>

<style lang="scss" scoped></style>
