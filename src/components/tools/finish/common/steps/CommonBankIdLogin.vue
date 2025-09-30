<script lang="ts" setup>
/**
 * En komponent för att legitimera användaren med BankID.
 */

import { onBeforeUnmount, onMounted, ref } from "vue";
import type { components, paths } from "@/openapi/gredor-backend-v1";
import createClient from "openapi-fetch";
import { getConfigValue } from "@/util/configUtils.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";

const props = defineProps<
  CommonStepProps & {
    /** Användarens personnummer. */
    personalNumber: string;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const loading = ref<boolean>(true);
const result = ref<components["schemas"]["BankIdStatusResponse"] | undefined>();
const orderRef = ref<string | null | undefined>();
const autoStartToken = ref<string | null | undefined>();

let unmounted: boolean = false;

const client = createClient<paths>({
  baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
});

async function performInitRequest() {
  loading.value = true;
  try {
    const {
      data: initData, // only present if 2XX response
      error: initError, // only present if 4XX or 5XX response
    } = await client.POST("/v1/bankid/init", {
      body: {
        personalNumber: props.personalNumber,
      },
      credentials: "include", // Viktigt för att cookies ska funka
    });

    if (initError) {
      alert("initError");
      alert(initError);
    } else if (initData) {
      result.value = initData;
      orderRef.value = initData.orderRef;
      autoStartToken.value = initData.autoStartToken;
      setTimeout(() => {
        performStatusRequest();
      }, 1000);
    }
  } finally {
    loading.value = false;
  }
}

async function performStatusRequest() {
  if (unmounted || !orderRef.value) {
    return;
  }

  const {
    data: initData, // only present if 2XX response
  } = await client.POST("/v1/bankid/status", {
    body: {
      orderRef: orderRef.value,
    },
    credentials: "include", // Viktigt för att cookies ska funka
  });

  if (initData) {
    result.value = initData;
    if (initData.status === "PENDING") {
      setTimeout(() => {
        performStatusRequest();
      }, 1000);
    }
  }
}

onMounted(() => {
  // Timeout så att komponenten hinner renderas och man hinner uppfatta
  // "laddar"-texten
  setTimeout(() => {
    performInitRequest();
  }, 250);
});

onBeforeUnmount(() => {
  unmounted = true;
});
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Legitimera med BankID
    </CommonModalSubtitle>

    <div v-if="loading">Laddar…</div>

    <div
      v-if="result?.status === 'PENDING' && result.statusPendingData != null"
      class="d-flex flex-column align-items-center justify-content-center gap-3 pt-3"
    >
      <img
        :src="result.statusPendingData.qrCodeImageBase64"
        alt="QR-kod för BankID"
      />

      <p class="text-center">
        Skanna QR-koden ovan med BankID-appen på din mobil.
      </p>

      <p class="text-center">
        <a
          v-if="autoStartToken"
          :href="`bankid:///?autostarttoken=${autoStartToken}`"
          >Öppna BankID på denna enhet</a
        >
      </p>
    </div>

    <div v-if="result?.status === 'COMPLETE'">Du är legitimerad.</div>

    <CommonWizardButtons
      :next-button-disabled="result?.status !== 'COMPLETE'"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
a {
  font-weight: bold;
}
</style>
