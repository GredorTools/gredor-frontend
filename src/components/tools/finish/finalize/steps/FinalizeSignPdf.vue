<script lang="ts" setup>
/**
 * En komponent som genererar en PDF-fil för signering, och sedan ber användaren
 * signera den och ladda upp den signerade versionen av filen. Samtidigt
 * genereras iXBRL-data från den renderade HTML-filen, vilket krävs för vidare
 * processsteg. Den signerade PDF-filen används för verifiering av behörighet.
 */

import { onBeforeUnmount, onMounted, ref } from "vue";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type { ComponentExposed } from "vue-component-type-helpers";
import RenderMain from "@/components/render/RenderMain.vue";
import { useIXBRLGenerator } from "@/components/tools/finish/common/composables/useIXBRLGenerator.ts";
import CommonFileInput from "@/components/common/CommonFileInput.vue";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

/** Årsredovisningen som en signerad PDF, används av backend för att verifiera
 * behörighet. */
const signedPdf = defineModel<Uint8Array | undefined>("signedPdf", {
  required: true,
});

/** Årsredovisningen i iXBRL-format. */
const ixbrl = defineModel<string | undefined>("ixbrl", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

const hasPickedSignedPdfFile = ref<boolean>(false);

const renderMain = ref<ComponentExposed<typeof RenderMain>>();

async function exportUnsignedPdf() {
  if (!ixbrl.value) {
    return;
  }

  const printWindow = window.open("", "", "popup,width=800,height=800");
  if (!printWindow) {
    return;
  }

  const htmlToWrite = `${ixbrl.value}
  <script type="text/javascript">
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        window.close();
      }, 250);
    }, 250);
  <\/script>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlToWrite);
}

async function handleSignedPdfFile(file: File) {
  signedPdf.value = await file.bytes();
  hasPickedSignedPdfFile.value = true;
}

const { tryGenerateIXBRLInInterval } = useIXBRLGenerator({
  renderMain,
  arsredovisning: props.arsredovisning,
  ixbrlOutput: ixbrl,
});
let reportGeneratorIntervalId: number | undefined;
onMounted(() => {
  // Timeout så att förhandsgranskningen hinner ladda in innan vi skapar iXBRL
  setTimeout(async () => {
    // Konvertera renderad HTML till iXBRL
    reportGeneratorIntervalId = tryGenerateIXBRLInInterval();
  }, 250);
});

onBeforeUnmount(() => {
  if (reportGeneratorIntervalId != null) {
    clearInterval(reportGeneratorIntervalId);
  }
});
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Signera årsredovisningen
    </CommonModalSubtitle>

    <div v-if="arsredovisning" hidden>
      <RenderMain
        ref="renderMain"
        :arsredovisning="arsredovisning"
        :show-faststallelseintyg="false"
      />
    </div>

    <p>
      Vi börjar med att signera årsredovisningen. Bla bla... Kör skriv ut som
      PDF...
    </p>

    <div class="download-zone">
      <button
        :disabled="!ixbrl"
        class="btn btn-primary"
        @click="exportUnsignedPdf"
      >
        {{
          ixbrl
            ? "Ladda ner årsredovisningen i PDF-format"
            : "Bearbetar – du kan snart ladda ner årsredovisningen…"
        }}
      </button>
    </div>

    <CommonFileInput
      :allowed-data-types="['application/pdf']"
      :allowed-file-extensions="['.pdf']"
      drag-and-drop-text-override="Dra och släpp din signerade .pdf-fil här"
      @file-picked="handleSignedPdfFile"
    />

    <CommonWizardButtons
      :next-button-disabled="!hasPickedSignedPdfFile"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
.download-zone {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 10rem;
}
</style>
