<script lang="ts" setup>
/**
 * En komponent för att visa villkor för inlämning av årsredovisning med
 * Gredor.
 */

import { ref } from "vue";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";

defineProps<CommonStepProps>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const userAgreed = ref<boolean>(false);
</script>

<template>
  <div>
    <h4>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Information från Gredor
    </h4>

    <div>
      <p>
        Gredor är ett gratisverktyg. I slutet av flödet kommer din
        årsredovisning att skickas in till Bolagsverket i iXBRL-format, ett
        speciellt format som används för bland annat årsredovisningar och bör
        motsvara det som har visats i förhandsgranskningen tidigare i flödet. Vi
        som utvecklar Gredor har testat vektyget noggrannt för att minimera
        risken för att något ska bli fel då, men tänk på att vi inte lämnar
        några garantier.
      </p>

      <p>Genom att kryssa i rutan nedan godtar du detta.</p>

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
              >Jag godkänner Gredors villkor
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
  </div>
</template>

<style lang="scss" scoped>
.checkbox-container {
  border: 1px solid #c0c0c0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: inline-block;
}
</style>
