<script lang="ts" setup>
/**
 * En komponent som hanterar att faktiskt överföra årsredovisningen till
 * Bolagsverket. Användaren får även en länk till det egna utrymmet hos
 * Bolagsverket för att signera årsredovisningen.
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
import { useSubmitSubmissionApi } from "@/api/composables/useSubmitSubmissionApi.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;

    /** Årsredovisningen i iXBRL-format. */
    ixbrl: string;

    /** Användarens e-postadress för aviseringar från Bolagsverket. */
    notificationEmail: string;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const { showMessageModal } = useModalStore();
const { loading, submitSubmission } = useSubmitSubmissionApi({
  apiErrorHandler: (error) =>
    showMessageModal(error, "Fel vid kommunikation med Bolagsverket"),
  exceptionHandler: (e) =>
    showMessageModal(
      `Teknisk information: ${e.message}`,
      "Fel vid kommunikation med Bolagsverket",
    ),
});

const result = ref<Awaited<ReturnType<typeof submitSubmission>>>();

async function performRequest() {
  result.value = await submitSubmission({
    arsredovisning: props.arsredovisning,
    ixbrl: props.ixbrl,
    notificationEmail: props.notificationEmail,
  });
}

onMounted(() => {
  // Timeout så att komponenten hinner renderas
  setTimeout(() => {
    performRequest();
  }, 100);
});
</script>

<template>
  <CommonModalContents>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda upp
    </CommonModalSubtitle>

    <div v-if="loading">Laddar upp – det kan ta några sekunder…</div>

    <div v-if="result != null">
      <p>
        Årsredovisningen är nu uppladdad till ditt egna utrymme hos
        Bolagsverket.
      </p>

      <p>
        <a :href="result.url" target="_blank">
          Du kan nu klicka här för att signera den.
        </a>
      </p>

      <p class="mb-0">
        <strong>
          Observera att årsredovisningen inte är mottagen av Bolagsverket förrän
          du har signerat den i deras e-tjänst.
        </strong>
      </p>
    </div>

    <CommonWizardButtons
      :next-button-disabled="result == null"
      next-button-text="Stäng"
      previous-button-disabled
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
