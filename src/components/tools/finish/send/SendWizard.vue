<script lang="ts" setup>
/**
 * Wizard för att dirigera användaren genom processen att skicka in
 * årsredovisningen till sitt egna utrymme hos Bolagsverket.
 *
 * Komponenten innehåller en modal som stegvis guidar användaren genom
 * uppladdning av filer, inmatning av uppgifter, acceptering av avtal, tillägg
 * av fastställelseintyg, generering och validering av årsredovisningen, samt
 * slutgiltig bekräftelse och överföring till Bolagsverket.
 */

import SendRequestFiles from "@/components/tools/finish/send/steps/SendRequestFiles.vue";
import { onMounted, provide, ref, useTemplateRef } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { Modal } from "bootstrap";
import SendAddFaststallelseintyg from "@/components/tools/finish/send/steps/SendAddFaststallelseintyg.vue";
import SendRequestInformation from "@/components/tools/finish/send/steps/SendRequestInformation.vue";
import SendUploadReport from "@/components/tools/finish/send/steps/SendUploadReport.vue";
import SendFinalConfirmation from "@/components/tools/finish/send/steps/SendFinalConfirmation.vue";
import SendGenerateReport from "@/components/tools/finish/send/steps/SendGenerateReport.vue";
import CommonValidateReport from "@/components/tools/finish/common/steps/CommonValidateReport.vue";
import CommonSignAgreement from "@/components/tools/finish/common/steps/CommonSignAgreement.vue";

const arsredovisning = ref<Arsredovisning | undefined>();
const signedPdf = ref<Uint8Array | undefined>();
const signerPnr = ref<string>("");
const notificationEmail = ref<string>("");
const ixbrl = ref<string | undefined>();

const currentStep = ref<
  | "sendRequestFiles"
  | "requestInformation"
  | "signAgreement"
  | "addFaststallelseintyg"
  | "generateReport"
  | "validateReport"
  | "finalConfirmation"
  | "uploadReport"
>("sendRequestFiles");
const numSteps = 8;

provide("footerTeleportPoint", "#send-wizard-modal-footer");

const modalRef = useTemplateRef("modal-div");
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
  },
});
</script>

<template>
  <div ref="modal-div" class="modal fade" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Skicka in till Bolagsverket</h3>
        </div>
        <div class="modal-body">
          <SendRequestFiles
            v-if="currentStep === 'sendRequestFiles'"
            v-model:arsredovisning="arsredovisning"
            v-model:signed-pdf="signedPdf"
            :current-step-number="1"
            :num-steps="numSteps"
            class="limit-width"
            @go-to-next-step="currentStep = 'requestInformation'"
          />
          <SendRequestInformation
            v-if="currentStep === 'requestInformation'"
            v-model:notification-email="notificationEmail"
            v-model:signer-pnr="signerPnr"
            :current-step-number="2"
            :num-steps="numSteps"
            class="limit-width"
            @go-to-previous-step="currentStep = 'sendRequestFiles'"
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
            @go-to-next-step="currentStep = 'addFaststallelseintyg'"
          />
          <SendAddFaststallelseintyg
            v-if="currentStep === 'addFaststallelseintyg'"
            :arsredovisning="arsredovisning"
            :current-step-number="4"
            :num-steps="numSteps"
            @go-to-previous-step="currentStep = 'signAgreement'"
            @go-to-next-step="currentStep = 'generateReport'"
          />
          <SendGenerateReport
            v-if="currentStep === 'generateReport' && arsredovisning != null"
            v-model:ixbrl="ixbrl"
            :arsredovisning="arsredovisning"
            :current-step-number="5"
            :include-faststallelseintyg="true"
            :num-steps="numSteps"
            @go-to-previous-step="currentStep = 'addFaststallelseintyg'"
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
            :current-step-number="6"
            :ixbrl="ixbrl"
            :num-steps="numSteps"
            :signed-pdf="signedPdf"
            :signer-pnr="signerPnr"
            class="limit-width"
            @go-to-previous-step="currentStep = 'generateReport'"
            @go-to-next-step="currentStep = 'finalConfirmation'"
          />
          <SendFinalConfirmation
            v-if="currentStep === 'finalConfirmation'"
            :current-step-number="7"
            :num-steps="numSteps"
            class="limit-width"
            @go-to-previous-step="currentStep = 'validateReport'"
            @go-to-next-step="currentStep = 'uploadReport'"
          />
          <SendUploadReport
            v-if="
              currentStep === 'uploadReport' &&
              arsredovisning != null &&
              signedPdf != null &&
              ixbrl != null
            "
            :arsredovisning="arsredovisning"
            :current-step-number="8"
            :ixbrl="ixbrl"
            :notification-email="notificationEmail"
            :num-steps="numSteps"
            :signed-pdf="signedPdf"
            :signer-pnr="signerPnr"
            class="limit-width"
            @go-to-previous-step="currentStep = 'finalConfirmation'"
            @go-to-next-step="modal?.hide()"
          />
        </div>
        <div id="send-wizard-modal-footer" class="modal-footer"></div>
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
