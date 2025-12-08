<script lang="ts" setup>
import createClient from "openapi-fetch";
import type { components, paths } from "@/openapi/gredor-backend-v1";
import { getConfigValue } from "@/util/configUtils.ts";
import { computed, onMounted, ref } from "vue";
import linkifyStr from "linkify-string";

const messages = ref<components["schemas"]["Message"][]>([]);
const dismissedMessages = ref<components["schemas"]["Message"][]>([]);

const visibleMessages = computed(() =>
  messages.value.filter(
    (message) => !dismissedMessages.value.includes(message),
  ),
);

async function fetchMessages() {
  const client = createClient<paths>({
    baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
  });

  try {
    const {
      data, // only present if 2XX response
      error, // only present if 4XX or 5XX response
    } = await client.GET("/v1/message/messages");

    if (error) {
      console.warn(error);
    } else {
      messages.value = data;
    }
  } catch (e) {
    console.warn(e);
  }
}

onMounted(() => {
  fetchMessages();
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
