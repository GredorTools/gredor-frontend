<script lang="ts" setup>
/**
 * En komponent för att ladda ner en .gredorfardig-fil som innehåller den
 * färdiga årsredovisningen.
 *
 * Komponenten ger användaren möjlighet att ladda ner en JSON-fil med
 * årsredovisningsdata, som kommer att behövas efter årsstämman, när
 * årsredovisningen skickas in till Bolagsverket
 */

import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";

defineProps<CommonStepProps>();

const emit = defineEmits<CommonWizardButtonsEmits>();
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Redo för årsstämma!
    </CommonModalSubtitle>

    <p>
      Har du signerat årsredovisningen? I så fall är företaget redo för
      årsstämma! Efter årsstämman kan du använda Gredor-funktionen "Ladda upp
      till Bolagsverket efter årsstämma" för att gå vidare med inlämningen.
    </p>

    <CommonWizardButtons
      :previous-button-hidden="currentStepNumber === 1"
      next-button-text="Klar"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped></style>
