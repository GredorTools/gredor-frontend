<script lang="ts" setup>
/**
 * En central controller för att visa köade meddelande‑modals. Tar reaktivt den
 * översta i kön från en store och visar innehåll med en OK‑knapp.
 */

import { computed, useTemplateRef } from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import linkifyStr from "linkify-string";

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
      <h3 v-if="topModalDefinition.title">{{ topModalDefinition.title }}</h3>
      <!-- eslint-disable vue/no-v-html -->
      <p
        v-for="(line, index) in topModalDefinition.text
          .split(/\r?\n/)
          .filter((l) => l.trim().length > 0)"
        :key="index"
        v-html="linkifyStr(line)"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>

    <CommonWizardButtons
      next-button-text="OK"
      previous-button-hidden
      @go-to-next-step="nextModal"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.message-modal-content {
  width: calc(var(--bs-modal-width) * 1.25);

  h3 {
    font-size: $font-size-lg;
  }

  p {
    margin-bottom: $spacing-sm;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
