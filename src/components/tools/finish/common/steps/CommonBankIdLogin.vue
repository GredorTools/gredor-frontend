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
import { useModalStore } from "@/components/common/composables/useModalStore.ts";

const props = defineProps<
  CommonStepProps & {
    /** Användarens personnummer. */
    personalNumber: string;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const state = ref<
  | "checkAuthStatus" // kollar om redan legitimerad
  | "showInfo" // visar info om legitimering
  | "loadingQrCode" // laddar QR-koden
  | "showQrCodeOrResult" // visar QR-koden eller resultatet av legitimeringen
  | "callFailure" // anrop till BankID misslyckades
>("checkAuthStatus");
const result = ref<components["schemas"]["BankIdStatusResponse"] | undefined>();
const orderRef = ref<string | null | undefined>();
const autoStartToken = ref<string | null | undefined>();

const { showMessageModal } = useModalStore();

let unmounted: boolean = false;

const client = createClient<paths>({
  baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
});

async function checkAuthStatus() {
  const {
    data: authStatusData, // only present if 2XX response
    error: authStatusError, // only present if 4XX or 5XX response
  } = await client.POST("/v1/auth/status", {
    body: {
      personalNumber: props.personalNumber,
    },
    credentials: "include", // Viktigt för att cookies ska funka
  });

  if (authStatusError) {
    console.error(authStatusError);
    state.value = "callFailure";
  } else if (authStatusData?.loggedIn) {
    result.value = {
      status: "COMPLETE",
    };
    state.value = "showQrCodeOrResult";
  } else {
    state.value = "showInfo";
  }
}

async function performInitRequest() {
  state.value = "loadingQrCode";
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
      showMessageModal(initError, "Fel vid BankID-legitimering");
      state.value = "callFailure";
    } else if (initData) {
      result.value = initData;
      orderRef.value = initData.orderRef;
      autoStartToken.value = initData.autoStartToken;
      state.value = "showQrCodeOrResult";
      setTimeout(() => {
        performStatusRequest();
      }, 1000);
    }
  } catch {
    state.value = "callFailure";
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
    checkAuthStatus();
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

    <div v-if="state === 'checkAuthStatus'">Laddar…</div>

    <div v-if="state === 'showInfo' || state === 'loadingQrCode'">
      <p>
        I syfte att förhindra spam tillåter vi maximalt 10 inloggningar per
        person och vecka. Ditt personnummer kommer att sparas på Gredors servrar
        i 7 dygn dels för att vi ska kunna kontrollera detta, och dels så att du
        under denna period inte ska behöva legitimera dig på nytt varje gång.
      </p>

      <div class="d-flex align-items-center justify-content-center pt-4 pb-4">
        <button
          :disabled="state === 'loadingQrCode'"
          class="btn btn-primary"
          @click="performInitRequest"
        >
          {{
            state === "loadingQrCode"
              ? "Laddar…"
              : "Starta legitimering med BankID"
          }}
        </button>
      </div>
    </div>

    <div v-if="state === 'callFailure'">
      Något gick fel vid hämtning av data från BankID. Prova att gå tillbaka ett
      steg och sedan försöka igen.
    </div>

    <template v-if="state === 'showQrCodeOrResult'">
      <div
        v-if="result?.status === 'PENDING' && result.statusPendingData != null"
        class="d-flex flex-column align-items-center justify-content-center gap-3 pt-3"
      >
        <img
          :src="result.statusPendingData.qrCodeImageBase64"
          alt="QR-kod för BankID"
        />

        <p class="text-center">
          Skanna QR-koden ovan med BankID-appen på din mobila enhet.
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

      <div v-if="result?.status === 'FAILED'">
        Något gick fel vid legitimering. Prova att gå tillbaka ett steg och
        sedan försöka igen.
      </div>
    </template>

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
