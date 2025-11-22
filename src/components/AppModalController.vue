<script lang="ts" setup>
import { computed, useTemplateRef } from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import type { ComponentExposed } from "vue-component-type-helpers";

const { modalDefinitions, popTopModalDefinition } = useModalStore();

const topModalDefinition = computed(() =>
  modalDefinitions.value.length > 0
    ? modalDefinitions.value[modalDefinitions.value.length - 1]
    : null,
);

const modal = useTemplateRef<ComponentExposed<typeof CommonModal>>("modal");

function nextModal() {
  modal.value?.hide();
  setTimeout(popTopModalDefinition, 500);
}
</script>

<template>
  <CommonModal
    v-if="topModalDefinition"
    :id="`app-modal-controller-${topModalDefinition.id}`"
    :key="`app-modal-controller-${topModalDefinition.id}`"
    ref="modal"
    show-on-mount
  >
    <div class="message-modal-content">
      {{ topModalDefinition.text }}
    </div>

    <CommonWizardButtons
      next-button-text="OK"
      previous-button-hidden
      @go-to-next-step="nextModal"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
.message-modal-content {
  width: calc(var(--bs-modal-width) * 1.25);
}
</style>
