<script lang="ts" setup>
/**
 * En komponent för att fylla i användarens uppgifter, för användning vid anrop
 * till backend/Bolagsverket.
 */

import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/tools/finish/common/blocks/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";

defineProps<CommonStepProps>();

/** Användarens personnummer. Måste stämma överens med personnumret i den
 * signerade PDF-årsredovisningsfilen. */
const signerPnr = defineModel<string>("signerPnr", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

const personnummerRegex = /^\d{12}$/;
</script>

<template>
  <div>
    <h4>Steg {{ currentStepNumber }}/{{ numSteps }}: Fyll i uppgifter</h4>

    <div>
      <p>
        Bekräfta ditt personnummer nedan. I de följande stegen kommer Gredor att
        låta Bolagsverkets kontrollera din årsredovisning, och du som initierar
        detta måste vara samma person som har signerat PDF-filen som du laddade
        upp i föregående steg.
      </p>
      <p>Format: ÅÅÅÅMMDDXXXX (12 siffror utan bindestreck)</p>
      <input
        v-model.trim="signerPnr"
        maxlength="12"
        placeholder="Skriv personnummer här…"
        type="text"
      />
    </div>

    <CommonWizardButtons
      :next-button-disabled="!personnummerRegex.test(signerPnr)"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
input {
  width: 50%;
}
</style>
