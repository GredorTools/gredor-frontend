<script lang="ts" setup>
/**
 * En komponent med verktyg för att slutföra och exportera årsredovisningen.
 * Tillåter användaren att exportera årsredovisningen som en ixbrl-fil.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { requestOpenFile, requestSaveFile } from "@/util/fileUtils.ts";
import { convertVueHTMLToiXBRL } from "@/util/documentUtils.ts";
import { base64encode, bytesToBase64 } from "byte-base64";
import createClient from "openapi-fetch";
import type { paths } from "@/openapi/gredor-backend-v1";

const props = defineProps<{
  /** Årsredovisningen som ska exporteras. */
  arsredovisning: Arsredovisning;
}>();

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

async function sendArsredovisning() {
  const ixbrl = await getIXBRL();
  if (!ixbrl) {
    return;
  }

  const signedPdfBytes = await requestOpenFile(".pdf", "bytes");
  if (!signedPdfBytes) {
    return;
  }

  const client = createClient<paths>({
    baseUrl: import.meta.env.VITE_GREDOR_BACKEND_BASEURL,
  });

  const {
    data: prepareData, // only present if 2XX response
    error: prepareError, // only present if 4XX or 5XX response
  } = await client.POST("/v1/submission-flow/prepare", {
    body: {
      companyOrgnr:
        props.arsredovisning.foretagsinformation.organisationsnummer.replace(
          "-",
          "",
        ),
      signerPnr: "191212121212", // TODO
      signedPdf: bytesToBase64(signedPdfBytes),
    },
  });

  if (prepareError) {
    alert("prepareError");
    alert(prepareError);
  } else if (prepareData) {
    const ok =
      prompt(
        prepareData?.avtalstext + "\n\nSkriv OK nedan om du godkänner:",
      ) === "OK";
    if (ok) {
      const {
        data: submitData, // only present if 2XX response
        error: submitError, // only present if 4XX or 5XX response
      } = await client.POST("/v1/submission-flow/submit", {
        body: {
          companyOrgnr:
            props.arsredovisning.foretagsinformation.organisationsnummer.replace(
              "-",
              "",
            ),
          signerPnr: "191212121212", // TODO
          signedPdf: bytesToBase64(signedPdfBytes),
          ixbrl: base64encode(ixbrl),
        },
      });

      if (submitError) {
        alert("submitError");
        alert(submitError);
      } else if (submitData) {
        alert(submitData.url);
      } else {
        throw new Error("No submitData or submitError received");
      }
    }
  } else {
    throw new Error("No prepareData or prepareError received");
  }
}
</script>

<template>
  <div class="finalize-tools d-flex justify-content-end gap-2">
    <button class="btn btn-primary" @click="exportArsredovisning()">
      Exportera iXBRL-fil
    </button>
    <button class="btn btn-primary" @click="sendArsredovisning()">
      Skicka in till Bolagsverket
    </button>
  </div>
</template>

<style lang="scss" scoped>
.finalize-tools {
  /* Matcha pappret ovan */
  width: 210mm;
}
</style>
