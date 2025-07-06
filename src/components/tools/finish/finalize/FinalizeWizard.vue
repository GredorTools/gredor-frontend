<script lang="ts" setup>
/**
 * En wizard för att dirigera användaren genom processen att färdigställa
 * årsredovisningen inför årsstämma.
 *
 * Wizarden är en modal som stegvis guidar användaren genom uppladdning av
 * signerad PDF, inmatning av uppgifter, acceptering av Bolagsverkets avtal,
 * validering och nedladdning av nödvändiga filer.
 */

import { onMounted, provide, ref, useTemplateRef } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { Modal } from "bootstrap";
import CommonValidateReport from "@/components/tools/finish/common/steps/CommonValidateReport.vue";
import CommonSignAgreement from "@/components/tools/finish/common/steps/CommonSignAgreement.vue";
import FinalizeSignPdf from "@/components/tools/finish/finalize/steps/FinalizeSignPdf.vue";
import FinalizeRequestInformation from "@/components/tools/finish/finalize/steps/FinalizeRequestInformation.vue";
import FinalizeDownloadFiles from "@/components/tools/finish/finalize/steps/FinalizeDownloadFiles.vue";

defineProps<{
  /** Årsredovisningen som ska skickas in till Bolagsverket. */
  arsredovisning: Arsredovisning;
}>();

const signedPdf = ref<Uint8Array | undefined>();
const signerPnr = ref<string>("");
const ixbrl = ref<string | undefined>();

const currentStep = ref<
  | "signPdf"
  | "requestInformation"
  | "signAgreement"
  | "validateReport"
  | "downloadFiles"
>("signPdf");
const numSteps = 5;

provide("footerTeleportPoint", "#finalize-wizard-modal-footer");

const modalRef = useTemplateRef("modal-div");
const modalHasBeenShown = ref<boolean>(false);
let modal: Modal | undefined;
onMounted(() => {
  const element = modalRef.value;
  if (element) {
    modal = new Modal(element);
  }
});

defineExpose({
  show: () => {
    modal?.show();
    modalHasBeenShown.value = true;
  },
});
</script>

<template>
  <div ref="modal-div" class="modal fade" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Färdigställ inför årsstämma</h3>
        </div>
        <div v-if="modalHasBeenShown" class="modal-body">
          <!-- TODO: Ladda om ifall rutan öppnas igen -->
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
            @go-to-next-step="currentStep = 'signAgreement'"
          />
          <CommonSignAgreement
            v-if="
              currentStep === 'signAgreement' &&
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
            @go-to-previous-step="currentStep = 'signAgreement'"
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
        </div>
        <div id="finalize-wizard-modal-footer" class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-dialog {
  min-width: var(--bs-modal-width) !important;
  width: fit-content !important;
  max-width: unset !important;
}

.modal-body {
  max-height: 75vh;
  overflow-y: auto;
}

.limit-width {
  width: var(--bs-modal-width);
}
</style>
