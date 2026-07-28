<script lang="ts" setup>
/**
 * En komponent som är en slags verktygslåda med verktyg för att färdigställa
 * och lämna in årsredovisningen till Bolagsverket.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { nextTick, ref } from "vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import SendWizard from "@/components/tools/finish/send/SendWizard.vue";
import FinalizeWizard from "@/components/tools/finish/finalize/FinalizeWizard.vue";
import type { TodoList } from "@/model/todolist/TodoList.ts";

defineProps<{
  /** Årsredovisningen som ska exporteras. */
  arsredovisning: Arsredovisning;
}>();

/** Att-åtgärda-lista där fel/varningar kan läggas till av denna komponent. */
const todoList = defineModel<TodoList>("todoList", {
  required: true,
});

const finalizeWizardRenderId = ref<number>(0);
const finalizeWizard = ref<ComponentExposed<typeof FinalizeWizard>>();
const sendWizardRenderId = ref<number>(0);
const sendWizard = ref<ComponentExposed<typeof SendWizard>>();

async function showFinalizeWizard() {
  finalizeWizardRenderId.value++; // Så att komponenten nollställs
  await nextTick(); // Vänta tills den har uppdaterats
  finalizeWizard.value?.show(); // Nu kan vi visa modalen
}

async function showSendWizard() {
  sendWizardRenderId.value++; // Så att komponenten nollställs
  await nextTick(); // Vänta tills den har uppdaterats
  sendWizard.value?.show(); // Nu kan vi visa modalen
}
</script>

<template>
  <div class="d-inline-flex justify-content-end gap-2">
    <button
      class="btn btn-primary"
      data-testid="show-finalize-wizard-button"
      @click="showFinalizeWizard"
    >
      Färdigställ inför årsstämma
    </button>
    <button
      class="btn btn-primary d-flex align-items-center"
      data-testid="show-send-wizard-button"
      @click="showSendWizard"
    >
      <img
        alt="Kräver BankID"
        src="/src/assets/img/BankID_logo_white.svg"
        style="width: 1.5rem; height: auto"
      />
      Ladda upp till Bolagsverket efter årsstämma
    </button>
  </div>

  <FinalizeWizard
    :key="finalizeWizardRenderId"
    ref="finalizeWizard"
    v-model:todo-list="todoList"
    :arsredovisning="arsredovisning"
    instance-id="ToolsFinish"
  />
  <SendWizard
    :key="sendWizardRenderId"
    ref="sendWizard"
    instance-id="ToolsFinish"
  />
</template>

<style lang="scss" scoped></style>
