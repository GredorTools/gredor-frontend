<script lang="ts" setup>
/**
 * En wizard för att dirigera användaren genom processen att färdigställa
 * årsredovisningen inför årsstämma.
 *
 * Wizarden är en modal som stegvis guidar användaren genom uppladdning av
 * signerad PDF, inmatning av uppgifter, acceptering av Bolagsverkets avtal,
 * validering och nedladdning av nödvändiga filer.
 */

import { defineAsyncComponent, ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type { ComponentExposed } from "vue-component-type-helpers";
import CommonModal from "@/components/common/CommonModal.vue";
import type { TodoList } from "@/model/todolist/TodoList.ts";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import CommonComponentLoadError from "@/components/common/CommonComponentLoadError.vue";

const FinalizeWizardSteps = defineAsyncComponent({
  loader: () =>
    import("@/components/tools/finish/finalize/FinalizeWizardSteps.vue"),
  errorComponent: CommonComponentLoadError,
});

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
</script>

<template>
  <CommonModal
    :id="`finalize-wizard-modal-${instanceId}`"
    ref="modal"
    show-close-button
    title="Färdigställ inför årsstämma"
  >
    <Suspense>
      <FinalizeWizardSteps
        v-model:todo-list="todoList"
        :arsredovisning="arsredovisning"
        :modal="modal"
      />

      <template #fallback>
        <CommonModalContents>
          Laddar…

          <CommonWizardButtons next-button-disabled previous-button-hidden />
        </CommonModalContents>
      </template>
    </Suspense>
  </CommonModal>
</template>

<style lang="scss" scoped></style>
