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
import FinalizeDownloadReport from "@/components/tools/finish/finalize/steps/FinalizeDownloadReport.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import CommonModal from "@/components/common/CommonModal.vue";
import CommonBankIdLogin from "@/components/tools/finish/common/steps/CommonBankIdLogin.vue";
import {
  useGredorStorage,
  type WrappedType,
} from "@/components/common/composables/useGredorStorage.ts";
import FinalizeReminder from "@/components/tools/finish/finalize/steps/FinalizeReminder.vue";
import FinalizeDownloadGredor from "@/components/tools/finish/finalize/steps/FinalizeDownloadGredor.vue";
import FinalizeFinish from "@/components/tools/finish/finalize/steps/FinalizeFinish.vue";
import type { TodoList } from "@/model/todolist/TodoList.ts";

defineProps<{
  /** Årsredovisningen som ska skickas in till Bolagsverket. */
  arsredovisning: Arsredovisning;

  /** ID för modalinstansen som är unikt över hela applikationen. */
  instanceId: string;
}>();

/** Att-åtgärda-lista där fel/varningar kan läggas till av denna komponent. */
const todoList = defineModel<TodoList>("todoList", {
  required: true,
});

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
const hasDownloadedGredorfardig = ref<boolean>(false);
const hasDownloadedPdf = ref<boolean>(false);

const numSteps = computed(() => (callBolagsverket.value.wrappedValue ? 8 : 5));

const currentStep = ref<
  | "reminder"
  | "requestInformation"
  | "bankIdLogin"
  | "bolagsverketAgreement"
  | "validateReport"
  | "downloadGredor"
  | "downloadReport"
  | "finish"
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
      v-model:ixbrl="ixbrl"
      :arsredovisning="arsredovisning"
      :current-step-number="1"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-next-step="currentStep = 'requestInformation'"
    />
    <FinalizeRequestInformation
      v-if="currentStep === 'requestInformation'"
      v-model:call-bolagsverket="callBolagsverket.wrappedValue"
      v-model:personal-number="personalNumber"
      :arsredovisning="arsredovisning"
      :current-step-number="2"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'reminder'"
      @go-to-next-step="
        currentStep = callBolagsverket.wrappedValue
          ? 'bankIdLogin'
          : 'downloadGredor'
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
      v-model:todo-list="todoList"
      :arsredovisning="arsredovisning"
      :current-step-number="5"
      :ixbrl="ixbrl"
      :num-steps="numSteps"
      class="limit-width"
      discard-faststallelseintyg-validations
      @go-to-previous-step="currentStep = 'bolagsverketAgreement'"
      @go-to-next-step="currentStep = 'downloadGredor'"
    />
    <FinalizeDownloadGredor
      v-if="currentStep === 'downloadGredor'"
      v-model:has-downloaded-gredorfardig="hasDownloadedGredorfardig"
      :arsredovisning="arsredovisning"
      :current-step-number="callBolagsverket.wrappedValue ? 6 : 3"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="
        currentStep = callBolagsverket.wrappedValue
          ? 'validateReport'
          : 'requestInformation'
      "
      @go-to-next-step="currentStep = 'downloadReport'"
    />
    <FinalizeDownloadReport
      v-if="currentStep === 'downloadReport' && ixbrl != null"
      v-model:has-downloaded-pdf="hasDownloadedPdf"
      :current-step-number="callBolagsverket.wrappedValue ? 7 : 4"
      :ixbrl="ixbrl"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'downloadGredor'"
      @go-to-next-step="currentStep = 'finish'"
    />
    <FinalizeFinish
      v-if="currentStep === 'finish'"
      :arsredovisning="arsredovisning"
      :current-step-number="callBolagsverket.wrappedValue ? 8 : 5"
      :ixbrl="ixbrl"
      :num-steps="numSteps"
      class="limit-width"
      @go-to-previous-step="currentStep = 'downloadReport'"
      @go-to-next-step="modal?.hide()"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
.limit-width {
  width: var(--bs-modal-width);
}
</style>
