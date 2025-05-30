<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderResultatrakning from "@/components/render/RenderResultatrakning.vue";
import RenderBalansrakning from "@/components/render/RenderBalansrakning.vue";
import { FileUtil } from "@/util/FileUtil.ts";
import xmlFormat from "xml-formatter";
import { DocumentUtil } from "@/util/DocumentUtil.ts";
import RenderIXBRLHeader from "@/components/render/RenderIXBRLHeader.vue";
import RenderForvaltningsberattelse from "@/components/render/RenderForvaltningsberattelse.vue";
import RenderNoter from "@/components/render/RenderNoter.vue";

const props = defineProps<{
  arsredovsining: Arsredovisning;
}>();

function exportArsredovisning() {
  const arsredovisningForExport = document.getElementById(
    "arsredovisning-for-export",
  );
  if (arsredovisningForExport) {
    const doc = new DOMParser().parseFromString(
      arsredovisningForExport.innerHTML,
      "text/html",
    );

    // Lägg till CSS
    let rulesCss = DocumentUtil.getCssTextForUsedRules(
      doc.querySelectorAll("*"),
    );

    // Omvandla attribut som börjar på "data-" eftersom de inte är giltig XHTML/iXBRL
    for (const element of doc.querySelectorAll("*")) {
      for (const attribute of [...element.attributes]) {
        if (attribute.name.startsWith("data-")) {
          if (!element.tagName.includes(":")) {
            // För rena HTML-element lägger vi på attributnamnet som en klass
            element.classList.add(attribute.name);
          }
          element.removeAttribute(attribute.name);
        }
      }
    }
    rulesCss = rulesCss.replace(/\[(data-.+?)]/g, ".$1");

    // Fixa versalisering i taggar och attribut (som blir fel pga att vi kör HTML5 i gui:t)
    function fixTag(
      tagName: string,
      attributeNamesToFix: string[],
      namespaceURI: string,
    ) {
      for (const oldElement of [
        ...doc.getElementsByTagName(tagName.toLowerCase()),
      ]) {
        const newElement = document.createElementNS(namespaceURI, tagName);

        // Copy the children
        while (oldElement.firstChild) {
          newElement.appendChild(oldElement.firstChild); // *Moves* the child
        }

        // Copy the attributes
        for (
          let index = oldElement.attributes.length - 1;
          index >= 0;
          --index
        ) {
          let attributeName = oldElement.attributes[index].name;
          for (const fixedAttributeName of attributeNamesToFix) {
            if (attributeName === fixedAttributeName.toLowerCase()) {
              attributeName = fixedAttributeName;
            }
          }
          newElement.setAttribute(
            attributeName,
            oldElement.attributes[index].value,
          );
        }

        // Replace it
        oldElement.parentNode?.replaceChild(newElement, oldElement);
      }
    }

    fixTag(
      "ix:nonNumeric",
      ["contextRef"],
      "http://www.xbrl.org/2013/inlineXBRL",
    );
    fixTag(
      "ix:nonFraction",
      ["contextRef", "unitRef"],
      "http://www.xbrl.org/2013/inlineXBRL",
    );
    fixTag("link:schemaRef", [], "http://www.xbrl.org/2003/linkbase");
    fixTag("xbrli:startDate", [], "http://www.xbrl.org/2003/instance");
    fixTag("xbrli:endDate", [], "http://www.xbrl.org/2003/instance");

    // Skapa slutlig HTML
    const { foretagsinformation } = props.arsredovsining;
    doc.head.innerHTML += `
      <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
      <meta name="programvara" content="Gredor" />
      <meta name="programversion" content="${import.meta.env.VITE_APP_VERSION}" />
      <title>${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning</title>
      <style type="text/css">${rulesCss}</style>
    `;
    let xhtml = new XMLSerializer().serializeToString(doc);
    xhtml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xhtml;
    xhtml = xhtml.replace(
      '<html xmlns="http://www.w3.org/1999/xhtml">',
      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:iso4217="http://www.xbrl.org/2003/iso4217" xmlns:ixt="http://www.xbrl.org/inlineXBRL/transformation/2010-04-20" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL" xmlns:se-gen-base="http://www.taxonomier.se/se/fr/gen-base/2017-09-30" xmlns:se-cd-base="http://www.taxonomier.se/se/fr/cd-base/2017-09-30" xmlns:se-k2-type="http://www.taxonomier.se/se/fr/k2/datatype">',
    );
    xhtml = xmlFormat(xhtml, { collapseContent: true });

    // Spara filen
    FileUtil.exportFile(xhtml, "arsredovisning.xhtml", "text/html");
  }
}
</script>

<template>
  <button @click="exportArsredovisning()">Exportera</button>
  <div class="ar-page">
    <div id="arsredovisning-for-export">
      <RenderIXBRLHeader :arsredovsining="arsredovsining" />
      <div class="sections-container">
        <RenderForvaltningsberattelse :arsredovsining="arsredovsining" />
        <RenderResultatrakning :arsredovsining="arsredovsining" />
        <RenderBalansrakning :arsredovsining="arsredovsining" />
        <RenderNoter :arsredovsining="arsredovsining" />
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
