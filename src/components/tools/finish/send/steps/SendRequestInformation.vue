<script lang="ts" setup>
/**
 * En komponent för att fylla i användarens uppgifter, för användning vid anrop
 * till backend/Bolagsverket.
 */

import isEmail from "validator/es/lib/isEmail";
import CommonWizardButtons, { type CommonWizardButtonsEmits } from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";

defineProps<CommonStepProps>();

/** Användarens personnummer. */
const personalNumber = defineModel<string>("personalNumber", {
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
        Fyll i ditt personnummer nedan. I de följande stegen kommer Gredor att
        låta Bolagsverkets kontrollera din årsredovisning samt ladda upp den
        till ditt egna utrymme, och du som initierar detta måste vara behörig
        att företräda företaget samt kunna identifiera dig med BankID.
      </p>
      <p>Format: ÅÅÅÅMMDDXXXX (12 siffror utan bindestreck)</p>
      <input
        v-model.trim="personalNumber"
        maxlength="12"
        placeholder="Skriv personnummer här…"
        type="text"
      />
    </div>

    <div>
      <h5>E-post för aviseringar</h5>
      <p>
        Fyll i din e-postadress nedan för att få aviseringar från Bolagsverket
        gällande årsredovisningen som du laddar upp.
      </p>
      <input
        v-model.trim="notificationEmail"
        placeholder="Skriv e-postadress här…"
        type="text"
      />
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        !personnummerRegex.test(personalNumber) || !isEmail(notificationEmail)
      "
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

h5 {
  font-size: 1.15rem;
  margin-top: $spacing-xl;
}

input[type="text"] {
  width: 50%;
}
</style>
