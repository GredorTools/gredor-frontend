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
import CommonModalContents from "@/components/common/CommonModalContents.vue";

defineProps<CommonStepProps>();

const emit = defineEmits<CommonWizardButtonsEmits>();
</script>

<template>
  <CommonModalContents>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Bekräfta överföring
    </CommonModalSubtitle>

    <p class="mb-0">
      Du är på väg att ladda upp årsredovisningen till ditt egna utrymme hos
      Bolagsverket.
      <strong class="text-decoration-underline">
        Observera att årsredovisningen inte är mottagen av Bolagsverket förrän
        du har signerat den i deras e-tjänst.
      </strong>
    </p>

    <CommonWizardButtons
      next-button-text="Ladda upp"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
</template>

<style lang="scss" scoped></style>
