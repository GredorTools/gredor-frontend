<script lang="ts" setup>
/**
 * Wizard för att dirigera användaren genom processen att ladda upp
 * årsredovisningen till sitt egna utrymme hos Bolagsverket.
 *
 * Komponenten innehåller en modal som stegvis guidar användaren genom
 * uppladdning av filer, inmatning av uppgifter, acceptering av avtal, tillägg
 * av fastställelseintyg, generering och validering av årsredovisningen, samt
 * slutgiltig bekräftelse och överföring till Bolagsverket.
 */

import { ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import SendRequestFiles from "@/components/tools/finish/send/steps/SendRequestFiles.vue";
import SendAddFaststallelseintyg from "@/components/tools/finish/send/steps/SendAddFaststallelseintyg.vue";
import SendRequestInformation from "@/components/tools/finish/send/steps/SendRequestInformation.vue";
import SendUploadReport from "@/components/tools/finish/send/steps/SendUploadReport.vue";
import SendFinalConfirmation from "@/components/tools/finish/send/steps/SendFinalConfirmation.vue";
import SendGenerateReport from "@/components/tools/finish/send/steps/SendGenerateReport.vue";
import CommonValidateReport from "@/components/tools/finish/common/steps/CommonValidateReport.vue";
import CommonBolagsverketAgreement from "@/components/tools/finish/common/steps/CommonBolagsverketAgreement.vue";
import CommonModal from "@/components/common/CommonModal.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import SendGredorAgreement from "@/components/tools/finish/send/steps/SendGredorAgreement.vue";
import CommonBankIdLogin from "@/components/tools/finish/common/steps/CommonBankIdLogin.vue";
import { useGredorStorage } from "@/components/common/composables/useGredorStorage.ts";

defineProps<{
  /** ID för modalinstansen som är unikt över hela applikationen. */
  instanceId: string;
}>();

const modal = ref<ComponentExposed<typeof CommonModal>>();
defineExpose({
  /** Visar det modala fönstret. */
  show: () => {
    modal.value?.show();
  },
});

const arsredovisning = ref<Arsredovisning | undefined>();
const personalNumber = useGredorStorage<string>("UserPersonalNumber", "");
const notificationEmail = useGredorStorage<string>("UserNotificationEmail", "");
const ixbrl = ref<string | undefined>();

const currentStep = ref<
  | "sendRequestFiles"
  | "bankIdLogin"
  | "requestInformation"
  | "bolagsverketAgreement"
  | "addFaststallelseintyg"
  | "generateReport"
  | "validateReport"
  | "gredorAgreement"
  | "finalConfirmation"
  | "uploadReport"
>("sendRequestFiles");
const numSteps = 10;
</script>

<template>
  <CommonModal
    :id="`send-wizard-modal-${instanceId}`"
    ref="modal"
    show-close-button
    title="Ladda upp till Bolagsverket"
  >
    <SendRequestFiles
      v-if="currentStep === 'sendRequestFiles'"
      v-model:arsredovisning="arsredovisning"
      :current-step-number="1"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-next-step="currentStep = 'requestInformation'"
    />
    <SendRequestInformation
      v-if="currentStep === 'requestInformation'"
      v-model:notification-email="notificationEmail"
      v-model:personal-number="personalNumber"
      :current-step-number="2"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'sendRequestFiles'"
      @go-to-next-step="currentStep = 'bankIdLogin'"
    />
    <CommonBankIdLogin
      v-if="currentStep === 'bankIdLogin'"
      :current-step-number="3"
      :num-steps="numSteps"
      :personal-number="personalNumber"
      class="limit-width"
      @go-to-previous-step="currentStep = 'requestInformation'"
      @go-to-next-step="currentStep = 'bolagsverketAgreement'"
    />
    <CommonBolagsverketAgreement
      v-if="currentStep === 'bolagsverketAgreement' && arsredovisning != null"
      :arsredovisning="arsredovisning"
      :current-step-number="4"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'bankIdLogin'"
      @go-to-next-step="currentStep = 'addFaststallelseintyg'"
    />
    <SendAddFaststallelseintyg
      v-if="currentStep === 'addFaststallelseintyg'"
      :arsredovisning="arsredovisning"
      :current-step-number="5"
      :num-steps="numSteps"
      @go-to-previous-step="currentStep = 'bolagsverketAgreement'"
      @go-to-next-step="currentStep = 'generateReport'"
    />
    <SendGenerateReport
      v-if="currentStep === 'generateReport' && arsredovisning != null"
      v-model:ixbrl="ixbrl"
      :arsredovisning="arsredovisning"
      :current-step-number="6"
      :include-faststallelseintyg="true"
      :num-steps="numSteps"
      @go-to-previous-step="currentStep = 'addFaststallelseintyg'"
      @go-to-next-step="currentStep = 'validateReport'"
    />
    <CommonValidateReport
      v-if="
        currentStep === 'validateReport' &&
        arsredovisning != null &&
        ixbrl != null
      "
      :arsredovisning="arsredovisning"
      :current-step-number="7"
      :ixbrl="ixbrl"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'generateReport'"
      @go-to-next-step="currentStep = 'gredorAgreement'"
    />
    <SendGredorAgreement
      v-if="currentStep === 'gredorAgreement'"
      :current-step-number="8"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'validateReport'"
      @go-to-next-step="currentStep = 'finalConfirmation'"
    />
    <SendFinalConfirmation
      v-if="currentStep === 'finalConfirmation'"
      :current-step-number="9"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'gredorAgreement'"
      @go-to-next-step="currentStep = 'uploadReport'"
    />
    <SendUploadReport
      v-if="
        currentStep === 'uploadReport' &&
        arsredovisning != null &&
        ixbrl != null
      "
      :arsredovisning="arsredovisning"
      :current-step-number="10"
      :ixbrl="ixbrl"
      :notification-email="notificationEmail"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'finalConfirmation'"
      @go-to-next-step="modal?.hide()"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
.limit-width {
  width: var(--bs-modal-width);
}
</style>
