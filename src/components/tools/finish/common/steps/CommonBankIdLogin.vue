<script lang="ts" setup>
/**
 * En komponent för att legitimera användaren med BankID.
 */

import { onBeforeUnmount, onMounted } from "vue";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import { useBankIdLoginApi } from "@/api/composables/useBankIdLoginApi.ts";

const props = defineProps<
  CommonStepProps & {
    /** Användarens personnummer. */
    personalNumber: string;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const { showMessageModal } = useModalStore();
const {
  stage,
  authResult,
  autoStartLink,
  checkAuthStatus,
  initLogin,
  abortLogin,
} = useBankIdLoginApi({
  personalNumber: props.personalNumber,
  apiErrorHandler: (error) => {
    showMessageModal(error, "Fel vid BankID-legitimering");
  },
  exceptionHandler: (e) => {
    showMessageModal(
      `Teknisk information: ${e.message}`,
      "Fel vid BankID-legitimering",
    );
  },
});

onMounted(() => {
  // Timeout så att komponenten hinner renderas och man hinner uppfatta
  // "laddar"-texten
  setTimeout(() => {
    checkAuthStatus();
  }, 250);
});

onBeforeUnmount(() => {
  abortLogin();
});
</script>

<template>
  <CommonModalContents>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Legitimera med BankID
    </CommonModalSubtitle>

    <div v-if="stage === 'checkAuthStatus'">Laddar…</div>

    <div v-if="stage === 'showInfo' || stage === 'loadingQrCode'">
      <p>
        Legitimering krävs vid kommunikation med Bolagsverket, för att visa att
        du är den som du uppger dig för att vara.
      </p>

      <p>
        Obs: I syfte att förhindra spam tillåter vi maximalt 10 legitimeringar
        per person och vecka. Ditt personnummer kommer att sparas på Gredors
        servrar i 7 dygn dels för att vi ska kunna kontrollera detta, och dels
        så att du under denna period inte ska behöva legitimera dig på nytt
        varje gång.
      </p>

      <div class="d-flex align-items-center justify-content-center pt-4 pb-4">
        <button
          :disabled="stage === 'loadingQrCode'"
          class="btn btn-primary"
          @click="initLogin"
        >
          {{
            stage === "loadingQrCode"
              ? "Laddar…"
              : "Starta legitimering med BankID"
          }}
        </button>
      </div>
    </div>

    <div v-if="stage === 'callFailure'">
      Något gick fel vid kommunikation med BankID. Prova att gå tillbaka ett
      steg och sedan försöka igen.
    </div>

    <template v-if="stage === 'showQrCodeOrAuthResult'">
      <div
        v-if="
          authResult?.status === 'PENDING' &&
          authResult.statusPendingData != null
        "
        class="d-flex flex-column align-items-center justify-content-center gap-3 pt-3"
      >
        <img
          :src="authResult.statusPendingData.qrCodeImageBase64"
          alt="QR-kod för BankID"
        />

        <p class="text-center">
          Skanna QR-koden ovan med BankID-appen på din mobila enhet.
        </p>

        <p class="text-center">
          <a v-if="autoStartLink" :href="autoStartLink"
            >Öppna BankID på denna enhet</a
          >
        </p>
      </div>

      <div v-if="authResult?.status === 'COMPLETE'">Du är legitimerad.</div>

      <div v-if="authResult?.status === 'FAILED'">
        Något gick fel vid legitimering. Prova att gå tillbaka ett steg och
        sedan försöka igen.
      </div>
    </template>

    <CommonWizardButtons
      :next-button-disabled="authResult?.status !== 'COMPLETE'"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
</template>

<style lang="scss" scoped>
a {
  font-weight: bold;
}
</style>
