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
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import { computed } from "vue";
import LuhnAlgorithm from "@designbycode/luhn-algorithm";

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

const personnummerCorrectFormatButInvalidLuhn = computed(
  () =>
    personnummerRegex.test(personalNumber.value) &&
    !LuhnAlgorithm.isValid(personalNumber.value.substring(2)),
);
</script>

<template>
  <CommonModalContents>
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
      <p>
        <strong>
          Du kommer även att fylla i ett fastställelseintyg, och det måste då
          vara ditt namn som står på det.
        </strong>
      </p>
      <p>Format: ÅÅÅÅMMDDXXXX (12 siffror utan bindestreck)</p>
      <input
        v-model.trim="personalNumber"
        data-testid="send-wizard-personalnumber-input"
        maxlength="12"
        placeholder="Skriv personnummer här…"
        type="text"
      />
      <strong v-if="personnummerCorrectFormatButInvalidLuhn" class="ms-2"
        >Ogiltigt personnummer.</strong
      >
    </div>

    <div>
      <h5>E-post för aviseringar</h5>
      <p>
        Fyll i din e-postadress nedan för att få aviseringar från Bolagsverket
        gällande årsredovisningen som du laddar upp.
      </p>
      <input
        v-model.trim="notificationEmail"
        data-testid="send-wizard-email-input"
        placeholder="Skriv e-postadress här…"
        type="text"
      />
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        !personnummerRegex.test(personalNumber) ||
        personnummerCorrectFormatButInvalidLuhn ||
        !isEmail(notificationEmail)
      "
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
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
