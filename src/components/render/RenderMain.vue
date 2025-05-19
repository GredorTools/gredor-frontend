<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderResultatrakning from "@/components/render/RenderResultatrakning.vue";
import RenderBalansrakning from "@/components/render/RenderBalansrakning.vue";
import { FileUtil } from "@/util/FileUtil.ts";
import xmlFormat from "xml-formatter";
import { DocumentUtil } from "@/util/DocumentUtil.ts";

const props = defineProps<{
  arsredovsining: Arsredovisning;
}>();

function exportArsredovisning() {
  const arsredovisningForExport = document.getElementById(
    "arsredovisning-for-export",
  );
  if (arsredovisningForExport) {
    let html = arsredovisningForExport.innerHTML;

    // Lägg till CSS
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rulesCss = DocumentUtil.getCssTextForUsedRules(
      doc.querySelectorAll("*"),
    );
    const { foretagsinformation } = props.arsredovsining;
    doc.head.innerHTML += `
      <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
      <title>${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning</title>
      <meta name="programvara" content="Gredor" />
      <meta name="programversion" content="${import.meta.env.VITE_APP_VERSION}" />
      <style>${rulesCss}</style>
    `;

    // Skapa slutlig HTML
    html = new XMLSerializer().serializeToString(doc);
    html = '<?xml version="1.0" encoding="UTF-8"?>\n' + html;
    html = xmlFormat(html, { collapseContent: true });

    // Spara filen
    FileUtil.exportFile(html, "arsredovisning.xhtml", "text/html");
  }
}
</script>

<template>
  <button @click="exportArsredovisning()">Exportera</button>
  <div class="ar-page">
    <div id="arsredovisning-for-export">
      <div class="sections-container">
        <RenderResultatrakning :arsredovsining="arsredovsining" />
        <RenderBalansrakning :arsredovsining="arsredovsining" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ar-page {
  width: 210mm;
  min-height: 297mm;

  margin: 1em 0px;
  padding: 1em 2em 2em;
  border: 1px solid rgb(240, 240, 240);
  border-image: none;
  line-height: 1.2;
  box-shadow: 0.25em 0.25em 0.3em #999;
}

.sections-container {
  width: 100%;

  & > *:not(:last-child) {
    margin-bottom: 2em;
  }
}
</style>
