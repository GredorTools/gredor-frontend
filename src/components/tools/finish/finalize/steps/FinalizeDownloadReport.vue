<script lang="ts" setup>
/**
 * En komponent för att ladda ner den färdigställda årsredovisningen som PDF
 * eller skriva ut den.
 */

import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import CommonModalContents from "@/components/common/CommonModalContents.vue";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen i iXBRL-format. */
    ixbrl: string;
  }
>();

/** Huruvida användaren har laddat ned PDF-filen. */
const hasDownloadedPdf = defineModel<boolean>("hasDownloadedPdf", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

async function exportUnsignedPdf() {
  if (!props.ixbrl) {
    return;
  }

  const printWindow = window.open("", "", "popup,width=800,height=800");
  if (!printWindow) {
    return;
  }

  /* eslint-disable no-useless-escape */
  const htmlToWrite = `${props.ixbrl}
  <script type="text/javascript">
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        window.close();
      }, 250);
    }, 250);
  <\/script>
  `;
  /* eslint-enable no-useless-escape */

  printWindow.document.open();
  printWindow.document.write(htmlToWrite);

  hasDownloadedPdf.value = true;
}
</script>

<template>
  <CommonModalContents>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Skriv ut och signera
    </CommonModalSubtitle>

    <div class="file-zone">
      <div class="download-zone">
        <button class="btn btn-primary" @click="exportUnsignedPdf">
          Skriv ut eller spara årsredovisningen
        </button>
      </div>

      <p>
        Efter att du har skrivit ut årsredovisningen är det
        <strong>mycket viktigt</strong> att du signerar den. Gredors
        rekommendation är att skriva ut årsredovisningen till en PDF-fil och
        sedan använda gratistjänten
        <a href="https://elektronisksignering.se/" target="_blank"
          >elektronisksignering.se</a
        >
        för att signera den digitalt (men du kan också skriva ut den på papper
        och signera för hand).
      </p>
    </div>

    <CommonWizardButtons
      :next-button-disabled="!hasDownloadedPdf"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.file-zone {
  border: 1px solid $border-color-dark;
  border-radius: var(--bs-border-radius);
  padding: 0.5rem 1rem;
}

.download-zone {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 5rem;
}

a {
  font-weight: bold;
}
</style>
