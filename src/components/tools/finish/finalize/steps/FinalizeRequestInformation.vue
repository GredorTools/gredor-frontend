<script lang="ts" setup>
/**
 * En komponent för att fylla i användarens uppgifter, för användning vid anrop
 * till backend/Bolagsverket.
 */

import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { computed } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import LuhnAlgorithm from "@designbycode/luhn-algorithm";

defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

/** Huruvida användaren vill köra Bolagsverkets kontroller. */
const callBolagsverket = defineModel<boolean | null>("callBolagsverket", {
  required: true,
});

/** Användarens personnummer. */
const personalNumber = defineModel<string>("personalNumber", {
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
      <h5>Bolagsverkets kontroller</h5>

      <p>
        Gredor har möjlighet att redan nu köra Bolagsverkets automatiska
        kontroller på din årsredovisning. Kontrollerna är av begränsad
        omfattning, men de kan vara till hjälp för att upptäcka såväl vanliga
        som ovanliga fel. För att använda funktionen behöver du som initierar
        detta kunna identifiera dig med BankID.
      </p>

      <p>Vill du kontrollera din årsredovisning genom Bolagsverket?</p>

      <div class="format-radios">
        <div class="form-check">
          <input
            id="callBolagsverketRadioYes"
            v-model="callBolagsverket"
            :value="true"
            class="form-check-input"
            name="callBolagsverketRadio"
            type="radio"
          />
          <label class="form-check-label" for="callBolagsverketRadioYes">
            Ja, kör Bolagsverkets kontroller <strong>(rekommenderas)</strong>
          </label>
        </div>
        <div class="form-check">
          <input
            id="callBolagsverketRadioNo"
            v-model="callBolagsverket"
            :value="false"
            class="form-check-input"
            name="callBolagsverketRadio"
            type="radio"
          />
          <label class="form-check-label" for="callBolagsverketRadioNo">
            Nej, kör inte Bolagsverkets kontroller
          </label>
        </div>
      </div>

      <div v-if="callBolagsverket">
        <h5>Personnummer</h5>
        <p>Fyll i ditt personnummer nedan för att legitimera dig med BankID.</p>
        <p>Format: ÅÅÅÅMMDDXXXX (12 siffror utan bindestreck)</p>
        <input
          v-model.trim="personalNumber"
          maxlength="12"
          placeholder="Skriv personnummer här…"
          type="text"
        />
        <strong v-if="personnummerCorrectFormatButInvalidLuhn" class="ms-2"
          >Ogiltigt personnummer.</strong
        >
      </div>
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        callBolagsverket === undefined ||
        (callBolagsverket &&
          (!personnummerRegex.test(personalNumber) ||
            personnummerCorrectFormatButInvalidLuhn)) ||
        false
      "
      :previous-button-hidden="currentStepNumber === 1"
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
