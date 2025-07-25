<script lang="ts" setup>
/**
 * En wizard för att dirigera användaren genom processen att färdigställa
 * årsredovisningen inför årsstämma.
 *
 * Wizarden är en modal som stegvis guidar användaren genom uppladdning av
 * signerad PDF, inmatning av uppgifter, acceptering av Bolagsverkets avtal,
 * validering och nedladdning av nödvändiga filer.
 */

import { ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonValidateReport from "@/components/tools/finish/common/steps/CommonValidateReport.vue";
import CommonBolagsverketAgreement from "@/components/tools/finish/common/steps/CommonBolagsverketAgreement.vue";
import FinalizeSignPdf from "@/components/tools/finish/finalize/steps/FinalizeSignPdf.vue";
import FinalizeRequestInformation from "@/components/tools/finish/finalize/steps/FinalizeRequestInformation.vue";
import FinalizeDownloadFiles from "@/components/tools/finish/finalize/steps/FinalizeDownloadFiles.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import CommonModal from "@/components/common/CommonModal.vue";

defineProps<{
  /** Årsredovisningen som ska skickas in till Bolagsverket. */
  arsredovisning: Arsredovisning;
}>();

const modal = ref<ComponentExposed<typeof CommonModal>>();
defineExpose({
  /** Visar det modala fönstret. */
  show: () => {
    modal.value?.show();
  },
});

const signedPdf = ref<Uint8Array | undefined>();
const signerPnr = ref<string>("");
const ixbrl = ref<string | undefined>();

const currentStep = ref<
  | "signPdf"
  | "requestInformation"
  | "bolagsverketAgreement"
  | "validateReport"
  | "downloadFiles"
>("signPdf");
const numSteps = 5;
</script>

<template>
  <CommonModal
    id="finalize-wizard-modal"
    ref="modal"
    title="Färdigställ inför årsstämma"
  >
    <FinalizeSignPdf
      v-if="currentStep === 'signPdf' && arsredovisning"
      v-model:ixbrl="ixbrl"
      v-model:signed-pdf="signedPdf"
      :arsredovisning="arsredovisning"
      :current-step-number="1"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-next-step="currentStep = 'requestInformation'"
    />
    <FinalizeRequestInformation
      v-if="currentStep === 'requestInformation'"
      v-model:signer-pnr="signerPnr"
      :current-step-number="2"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'signPdf'"
      @go-to-next-step="currentStep = 'bolagsverketAgreement'"
    />
    <CommonBolagsverketAgreement
      v-if="
        currentStep === 'bolagsverketAgreement' &&
        arsredovisning != null &&
        signedPdf != null
      "
      :arsredovisning="arsredovisning"
      :current-step-number="3"
      :num-steps="numSteps"
      :signed-pdf="signedPdf"
      :signer-pnr="signerPnr"
      class="limit-width"
      @go-to-previous-step="currentStep = 'requestInformation'"
      @go-to-next-step="currentStep = 'validateReport'"
    />
    <CommonValidateReport
      v-if="
        currentStep === 'validateReport' &&
        arsredovisning != null &&
        signedPdf != null &&
        ixbrl != null
      "
      :arsredovisning="arsredovisning"
      :current-step-number="4"
      :ixbrl="ixbrl"
      :num-steps="numSteps"
      :signed-pdf="signedPdf"
      :signer-pnr="signerPnr"
      class="limit-width"
      @go-to-previous-step="currentStep = 'bolagsverketAgreement'"
      @go-to-next-step="currentStep = 'downloadFiles'"
    />
    <FinalizeDownloadFiles
      v-if="currentStep === 'downloadFiles'"
      :arsredovisning="arsredovisning"
      :current-step-number="5"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'validateReport'"
      @go-to-next-step="modal?.hide()"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
.limit-width {
  width: var(--bs-modal-width);
}
</style>
