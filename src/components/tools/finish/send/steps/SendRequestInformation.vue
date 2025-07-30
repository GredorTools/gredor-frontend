<script lang="ts" setup>
/**
 * En komponent för att fylla i användarens uppgifter, för användning vid anrop
 * till backend/Bolagsverket.
 */

import isEmail from "validator/es/lib/isEmail";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";

defineProps<CommonStepProps>();

/** Användarens personnummer. Måste stämma överens med personnumret i den
 * signerade PDF-årsredovisningsfilen. */
const signerPnr = defineModel<string>("signerPnr", {
  required: true,
});

/** Användarens e-postadress för aviseringar från Bolagsverket. */
const notificationEmail = defineModel<string>("notificationEmail", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

const personnummerRegex = /^\d{12}$/;
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Fyll i uppgifter
    </CommonModalSubtitle>

    <div>
      <h5>Personnummer</h5>
      <p>
        Bekräfta ditt personnummer nedan. Det måste vara samma person som
        skickar in årsredovisningen till Bolagsverket som har signerat PDF-filen
        som du laddade upp i föregående steg.
      </p>
      <p>Format: ÅÅÅÅMMDDXXXX (12 siffror utan bindestreck)</p>
      <input
        v-model.trim="signerPnr"
        maxlength="12"
        placeholder="Skriv personnummer här…"
        type="text"
      />
    </div>

    <div>
      <h5>E-post för aviseringar</h5>
      <p>
        Fyll i din e-postadress nedan för att få aviseringar från Bolagsverket
        gällande årsredovisningen som du skickar in.
      </p>
      <input
        v-model.trim="notificationEmail"
        placeholder="Skriv e-postadress här…"
        type="text"
      />
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        !personnummerRegex.test(signerPnr) || !isEmail(notificationEmail)
      "
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
h5 {
  margin-top: 1.5rem;
}

input {
  width: 50%;
}
</style>
