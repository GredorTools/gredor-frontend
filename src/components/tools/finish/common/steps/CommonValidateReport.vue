<script lang="ts" setup>
/**
 * En komponent för att validera årsredovisningen och hämta kontrollresultat
 * från Bolagsverket.
 *
 * Komponenten skickar en signerad PDF-fil, iXBRL-data och användarens
 * personnummer till backend (som i sin tur anropar Bolagsverket). Sedan visas
 * resultatet av den valideringen.
 */

import { onMounted, ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import { addTodoListItem, type TodoList } from "@/model/todolist/TodoList.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import { useValidateSubmissionApi } from "@/api/composables/useValidateSubmissionApi.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;

    /** Årsredovisningen i iXBRL-format. */
    ixbrl: string;

    /** Huruvida kontroller för fastställelseintyget ska förkastas. */
    discardFaststallelseintygValidations?: boolean;
  }
>();

/** Eventuell att-åtgärda-lista där fel/varningar från Bolagsverket kan läggas
 * till av denna komponent. */
const todoList = defineModel<TodoList | undefined>("todoList", {
  required: false,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

const { showMessageModal } = useModalStore();
const { loading, validateSubmission } = useValidateSubmissionApi({
  apiErrorHandler: (error) =>
    showMessageModal(error, "Fel vid kommunikation med Bolagsverket"),
  exceptionHandler: (e) =>
    showMessageModal(
      `Teknisk information: ${e.message}`,
      "Fel vid kommunikation med Bolagsverket",
    ),
});

const result = ref<Awaited<ReturnType<typeof validateSubmission>>>();

async function performRequest() {
  result.value = await validateSubmission({
    arsredovisning: props.arsredovisning,
    ixbrl: props.ixbrl,
    discardFaststallelseintygValidations:
      props.discardFaststallelseintygValidations,
  });
  updateTodoList();
}

function updateTodoList() {
  if (todoList.value == null) {
    return;
  }

  const errorsAndWarnings = result.value?.utfall?.filter(
    (utfall) => utfall.typ && ["error", "warn"].includes(utfall.typ),
  );
  if (errorsAndWarnings && errorsAndWarnings.length > 0) {
    addTodoListItem(todoList.value, {
      id: "bolagsverkets-kontroller",
      title: "Bolagsverkets kontroller",
      description: "Följande fel/varningar upptäcktes av Bolagsverket.",
      timestamp: Date.now(),
      tasks: errorsAndWarnings
        .map((utfall) => utfall.text || "")
        .filter((text) => !!text)
        .map((text) => ({ text, complete: false })),
    });
  }
}

onMounted(() => {
  // Timeout så att komponenten hinner renderas
  setTimeout(() => {
    performRequest();
  }, 100);
});
</script>

<template>
  <CommonModalContents>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Bolagsverkets kontroller
    </CommonModalSubtitle>

    <div v-if="loading">Kontrollerar – det kan ta några sekunder…</div>

    <div v-if="result != null">
      <h5>Kontrollresultat</h5>

      <div
        v-for="(utfall, index) in result.utfall"
        :key="index"
        :class="{
          'alert-danger': utfall.typ === 'error',
          'alert-warning': utfall.typ === 'warn',
          'alert-info': utfall.typ === 'info',
        }"
        class="alert"
        role="alert"
      >
        <strong v-if="utfall.typ === 'error'">Fel:</strong>
        <strong v-if="utfall.typ === 'warn'">Varning:</strong>
        <strong v-if="utfall.typ === 'info'">Information:</strong>
        {{ utfall.text }}
      </div>

      <template v-if="(result.utfall?.length ?? 0) > 0">
        <h5>Hur man tolkar kontrollresultatet</h5>
        <ul>
          <li v-if="result.utfall?.some((utfall) => utfall.typ === 'error')">
            <!-- Vi borde aldrig få typ "error" i utfallen eftersom det bara ska
                 vara tekniska fel och de bör fångas upp på annat sätt, men
                 ifall det skulle dyka upp av någon anledning har vi ett färdigt
                 meddelande för det. -->
            <strong>Fel</strong>
            <span class="text-decoration-underline">måste</span> åtgärdas innan
            du fortsätter; vid tekniska fel, mejla
            <a href="mailto:gredor@potatiz.com">gredor@potatiz.com</a> för hjälp
          </li>
          <li>
            <strong>Varningar</strong> bör om möjligt åtgärdas innan du
            fortsätter, för att minimera risken för att du får ett föreläggande
            från Bolagsverket
          </li>
          <li>
            <strong>Informationsmeddelanden</strong> är endast för upplysning
          </li>
        </ul>

        <p
          v-if="
            todoList != null &&
            result.utfall?.some(
              (utfall) => utfall.typ && ['error', 'warn'].includes(utfall.typ),
            )
          "
          class="mb-0"
        >
          Varningarna har lagts till i din att-åtgärda-lista.
        </p>
      </template>
      <template v-else>
        Bolagsverkets automatiska kontroller hittade inga anmärkningar.
      </template>
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        result == null || result.utfall?.some((item) => item.typ === 'error')
      "
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

h5 {
  font-size: 1.15rem;
  margin-top: $spacing-lg;
}
</style>
