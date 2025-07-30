<script lang="ts" setup>
/**
 * En komponent tar emot ett slutgiltigt bekräftande från användaren inför
 * överföring av årsredovisningen till eget utrymme hos Bolagsverket.
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
      Steg {{ currentStepNumber }}/{{ numSteps }}: Bekräfta överföring
    </CommonModalSubtitle>

    <p>
      Du är på väg att skicka in årsredovisningen till ditt egna utrymme hos
      Bolagsverket.
      <strong>
        Observera att årsredovisningen inte är mottagen av Bolagsverket förrän
        du har signerat den i deras e-tjänst.
      </strong>
    </p>

    <CommonWizardButtons
      next-button-text="Skicka in"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped></style>
