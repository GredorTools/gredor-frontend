<script lang="ts" setup>
/**
 * En komponent för att hantera avtalet från Bolagsverket för användning av eget
 * utrymme vid kontroll eller inlämning av årsredovisning.
 */

import { onMounted, ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import { usePrepareSubmissionApi } from "@/api/composables/usePrepareSubmissionApi.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const { showMessageModal } = useModalStore();
const { loading, prepareSubmission } = usePrepareSubmissionApi({
  apiErrorHandler: (error) =>
    showMessageModal(error, "Fel vid kommunikation med Bolagsverket"),
  exceptionHandler: (e) =>
    showMessageModal(
      `Teknisk information: ${e.message}`,
      "Fel vid kommunikation med Bolagsverket",
    ),
});

const result = ref<Awaited<ReturnType<typeof prepareSubmission>>>();
const userAgreed = ref<boolean>(false);

async function performRequest() {
  result.value = await prepareSubmission({
    arsredovisning: props.arsredovisning,
  });
}

onMounted(() => {
  // Timeout så att komponenten hinner renderas och man hinner uppfatta
  // "laddar"-texten
  setTimeout(() => {
    performRequest();
  }, 250);
});
</script>

<template>
  <CommonModalContents>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Information från Bolagsverket
    </CommonModalSubtitle>

    <div v-if="loading">Laddar…</div>

    <div v-if="result != null && result.avtalstext">
      <p
        v-for="(line, index) in result.avtalstext
          .split(/\r?\n/)
          .filter((l: string) => l.trim().length > 0)"
        :key="index"
      >
        {{ line }}
      </p>

      <div class="d-flex align-items-center justify-content-center">
        <div class="checkbox-container">
          <div class="form-check">
            <input
              id="bolagsverketAgreementCheck"
              v-model="userAgreed"
              class="form-check-input"
              type="checkbox"
            />
            <label class="form-check-label" for="bolagsverketAgreementCheck"
              >Jag godkänner Bolagsverkets villkor
            </label>
          </div>
        </div>
      </div>
    </div>

    <CommonWizardButtons
      :next-button-disabled="!userAgreed"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.checkbox-container {
  border: 1px solid #c0c0c0;
  border-radius: $border-radius-lg;
  padding: $spacing-sm;
  display: inline-block;
}
</style>
