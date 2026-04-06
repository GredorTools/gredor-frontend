<script lang="ts" setup>
import type { components } from "@/api/schema/gredor-backend-v1";
import { computed, onMounted, ref } from "vue";
import linkifyStr from "linkify-string";
import { useMessagesApi } from "@/api/composables/useMessagesApi.ts";

const { fetchMessages } = useMessagesApi({
  apiErrorHandler: console.warn,
  exceptionHandler: (e) => console.warn(e.message),
});

const messages = ref<components["schemas"]["Message"][]>([]);
const dismissedMessages = ref<components["schemas"]["Message"][]>([]);

const visibleMessages = computed(() =>
  messages.value.filter(
    (message) => !dismissedMessages.value.includes(message),
  ),
);

onMounted(async () => {
  messages.value = (await fetchMessages()) ?? [];
});
</script>

<template>
  <div
    v-if="visibleMessages.length > 0"
    class="d-flex flex-column gap-3"
    data-testid="app-messages"
  >
    <div
      v-for="(message, index) in visibleMessages"
      :key="index"
      class="alert alert-primary d-flex align-items-center justify-content-between mb-0"
      role="alert"
    >
      <div class="d-flex gap-2">
        <i class="bi bi-info-circle-fill"></i>
        <!-- eslint-disable vue/no-v-html -->
        <span v-html="linkifyStr(message.text)" />
        <!-- eslint-enable vue/no-v-html -->
      </div>

      <button
        aria-label="Close"
        class="btn-close ms-4"
        type="button"
        @click="dismissedMessages.push(message)"
      />
    </div>
  </div>
</template>
