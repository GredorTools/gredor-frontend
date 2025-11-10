<script lang="ts" setup>
/**
 * En wizard för att dirigera användaren genom processen att färdigställa
 * årsredovisningen inför årsstämma.
 *
 * Wizarden är en modal som stegvis guidar användaren genom uppladdning av
 * signerad PDF, inmatning av uppgifter, acceptering av Bolagsverkets avtal,
 * validering och nedladdning av nödvändiga filer.
 */

import { computed, ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonValidateReport from "@/components/tools/finish/common/steps/CommonValidateReport.vue";
import CommonBolagsverketAgreement from "@/components/tools/finish/common/steps/CommonBolagsverketAgreement.vue";
import FinalizeRequestInformation from "@/components/tools/finish/finalize/steps/FinalizeRequestInformation.vue";
import FinalizeDownloadFiles from "@/components/tools/finish/finalize/steps/FinalizeDownloadFiles.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import CommonModal from "@/components/common/CommonModal.vue";
import CommonBankIdLogin from "@/components/tools/finish/common/steps/CommonBankIdLogin.vue";
import { useGredorStorage, type WrappedType } from "@/components/common/composables/useGredorStorage.ts";
import FinalizeReminder from "@/components/tools/finish/finalize/steps/FinalizeReminder.vue";

defineProps<{
  /** Årsredovisningen som ska skickas in till Bolagsverket. */
  arsredovisning: Arsredovisning;

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

const callBolagsverket = useGredorStorage<WrappedType<boolean | null>>(
  "FinalizeCallBolagsverket",
  { wrappedValue: null },
);
const personalNumber = useGredorStorage<string>("UserPersonalNumber", "");
const ixbrl = ref<string | undefined>();
const numSteps = computed(() => (callBolagsverket.value.wrappedValue ? 6 : 3));

const currentStep = ref<
  | "reminder"
  | "requestInformation"
  | "bankIdLogin"
  | "bolagsverketAgreement"
  | "validateReport"
  | "downloadFiles"
>("reminder");
</script>

<template>
  <CommonModal
    :id="`finalize-wizard-modal-${instanceId}`"
    ref="modal"
    show-close-button
    title="Färdigställ inför årsstämma"
  >
    <FinalizeReminder
      v-if="currentStep === 'reminder'"
      :arsredovisning="arsredovisning"
      :current-step-number="1"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-next-step="currentStep = 'requestInformation'"
    />
    <FinalizeRequestInformation
      v-if="currentStep === 'requestInformation'"
      v-model:call-bolagsverket="callBolagsverket.wrappedValue"
      v-model:ixbrl="ixbrl"
      v-model:personal-number="personalNumber"
      :arsredovisning="arsredovisning"
      :current-step-number="2"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'reminder'"
      @go-to-next-step="
        currentStep = callBolagsverket.wrappedValue
          ? 'bankIdLogin'
          : 'downloadFiles'
      "
    />
    <CommonBankIdLogin
      v-if="currentStep === 'bankIdLogin'"
      :current-step-number="3"
      :num-steps="numSteps"
      :personal-number="personalNumber"
      allow-skip
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
      @go-to-next-step="currentStep = 'validateReport'"
    />
    <CommonValidateReport
      v-if="
        currentStep === 'validateReport' &&
        arsredovisning != null &&
        ixbrl != null
      "
      :arsredovisning="arsredovisning"
      :current-step-number="5"
      :ixbrl="ixbrl"
      :num-steps="numSteps"
      class="limit-width"
      discard-faststallelseintyg-validations
      @go-to-previous-step="currentStep = 'bolagsverketAgreement'"
      @go-to-next-step="currentStep = 'downloadFiles'"
    />
    <FinalizeDownloadFiles
      v-if="currentStep === 'downloadFiles' && ixbrl != null"
      :arsredovisning="arsredovisning"
      :current-step-number="callBolagsverket ? 6 : 3"
      :ixbrl="ixbrl"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="
        currentStep = callBolagsverket ? 'validateReport' : 'requestInformation'
      "
      @go-to-next-step="modal?.hide()"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
.limit-width {
  width: var(--bs-modal-width);
}
</style>
