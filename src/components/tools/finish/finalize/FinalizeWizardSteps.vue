<script lang="ts" setup>
/**
 * En wizard för att dirigera användaren genom processen att färdigställa
 * årsredovisningen inför årsstämma.
 *
 * Wizarden är en modal som stegvis guidar användaren genom uppladdning av
 * signerad PDF, inmatning av uppgifter, acceptering av Bolagsverkets avtal,
 * validering och nedladdning av nödvändiga filer.
 */

import { computed, onBeforeUnmount, onMounted, ref } from "vue";
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
import RenderMain from "@/components/render/RenderMain.vue";
import { useIXBRLGenerator } from "@/components/tools/finish/common/composables/useIXBRLGenerator.ts";
import FinalizeGredorValidation from "@/components/tools/finish/finalize/steps/FinalizeGredorValidation.vue";

const props = defineProps<{
  /** Årsredovisningen som ska skickas in till Bolagsverket. */
  arsredovisning: Arsredovisning;

  /** Modalen som wizarden ligger i. */
  modal?: ComponentExposed<typeof CommonModal>;
}>();

/** Att-åtgärda-lista där fel/varningar kan läggas till av denna komponent. */
const todoList = defineModel<TodoList>("todoList", {
  required: true,
});

const callBolagsverket = useGredorStorage<WrappedType<boolean | null>>(
  "FinalizeCallBolagsverket",
  { wrappedValue: null },
);
const personalNumber = useGredorStorage<string>("UserPersonalNumber", "");
const ixbrl = ref<string | null>(null);
const hasDownloadedGredorfardig = ref<boolean>(false);
const hasDownloadedPdf = ref<boolean>(false);

const numSteps = computed(() => (callBolagsverket.value.wrappedValue ? 9 : 6));

const currentStep = ref<
  | "reminder"
  | "gredorValidation"
  | "requestInformation"
  | "bankIdLogin"
  | "bolagsverketAgreement"
  | "validateReport"
  | "downloadGredor"
  | "downloadReport"
  | "finish"
>("reminder");

// Generering av iXBRL - sker i bakgrunden
const renderMain = ref<ComponentExposed<typeof RenderMain>>();

const { tryGenerateIXBRLInInterval } = useIXBRLGenerator({
  renderMain,
  arsredovisning: props.arsredovisning,
  ixbrlOutput: ixbrl,
});
let reportGeneratorIntervalId: number | undefined;
onMounted(() => {
  ixbrl.value = null;

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
  <div hidden>
    <RenderMain
      ref="renderMain"
      :arsredovisning="arsredovisning"
      :show-faststallelseintyg="false"
    />
  </div>
  <FinalizeReminder
    v-if="currentStep === 'reminder'"
    :arsredovisning="arsredovisning"
    :current-step-number="1"
    :num-steps="numSteps"
    class="limit-width"
    @go-to-next-step="currentStep = 'gredorValidation'"
  />
  <FinalizeGredorValidation
    v-if="currentStep === 'gredorValidation'"
    v-model:todo-list="todoList"
    :arsredovisning="arsredovisning"
    :current-step-number="2"
    :ixbrl="ixbrl"
    :num-steps="numSteps"
    class="limit-width"
    @go-to-previous-step="currentStep = 'reminder'"
    @go-to-next-step="currentStep = 'requestInformation'"
  />
  <FinalizeRequestInformation
    v-if="currentStep === 'requestInformation'"
    v-model:call-bolagsverket="callBolagsverket.wrappedValue"
    v-model:personal-number="personalNumber"
    :arsredovisning="arsredovisning"
    :current-step-number="3"
    :num-steps="numSteps"
    class="limit-width"
    @go-to-previous-step="currentStep = 'gredorValidation'"
    @go-to-next-step="
      currentStep = callBolagsverket.wrappedValue
        ? 'bankIdLogin'
        : 'downloadGredor'
    "
  />
  <CommonBankIdLogin
    v-if="currentStep === 'bankIdLogin'"
    :current-step-number="4"
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
    :current-step-number="5"
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
    :current-step-number="6"
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
    :current-step-number="callBolagsverket.wrappedValue ? 7 : 4"
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
    :current-step-number="callBolagsverket.wrappedValue ? 8 : 5"
    :ixbrl="ixbrl"
    :num-steps="numSteps"
    class="limit-width"
    @go-to-previous-step="currentStep = 'downloadGredor'"
    @go-to-next-step="currentStep = 'finish'"
  />
  <FinalizeFinish
    v-if="currentStep === 'finish'"
    :arsredovisning="arsredovisning"
    :current-step-number="callBolagsverket.wrappedValue ? 9 : 6"
    :ixbrl="ixbrl"
    :num-steps="numSteps"
    class="limit-width"
    @go-to-previous-step="currentStep = 'downloadReport'"
    @go-to-next-step="modal?.hide()"
  />
</template>

<style lang="scss" scoped>
* {
  max-height: 100%;
}

.limit-width {
  width: var(--bs-modal-width, 500px);
}
</style>
