<script lang="ts" setup>
/**
 * En komponent för att fylla i användarens uppgifter, för användning vid anrop
 * till backend/Bolagsverket.
 */

import CommonWizardButtons, { type CommonWizardButtonsEmits } from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { useIXBRLGenerator } from "@/components/tools/finish/common/composables/useIXBRLGenerator.ts";
import { onBeforeUnmount, onMounted, ref } from "vue";
import RenderMain from "@/components/render/RenderMain.vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type { ComponentExposed } from "vue-component-type-helpers";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

/** Huruvida användaren vill köra Bolagsverkets kontroller. */
const callBolagsverket = defineModel<boolean | undefined>("callBolagsverket", {
  required: true,
});

/** Användarens personnummer. */
const personalNumber = defineModel<string>("personalNumber", {
  required: true,
});

/** Årsredovisningen i iXBRL-format. */
const ixbrl = defineModel<string | undefined>("ixbrl", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

const renderMain = ref<ComponentExposed<typeof RenderMain>>();

const personnummerRegex = /^\d{12}$/;

// Generering av iXBRL - sker i bakgrunden
const { tryGenerateIXBRLInInterval } = useIXBRLGenerator({
  renderMain,
  arsredovisning: props.arsredovisning,
  ixbrlOutput: ixbrl,
});
let reportGeneratorIntervalId: number | undefined;
onMounted(() => {
  // Timeout så att förhandsgranskningen hinner ladda in innan vi skapar iXBRL
  setTimeout(async () => {
    // Konvertera renderad HTML till iXBRL
    reportGeneratorIntervalId = tryGenerateIXBRLInInterval();
  }, 250);
});

onBeforeUnmount(() => {
  if (reportGeneratorIntervalId != null) {
    clearInterval(reportGeneratorIntervalId);
  }
});
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Fyll i uppgifter
    </CommonModalSubtitle>

    <div v-if="arsredovisning" hidden>
      <RenderMain
        ref="renderMain"
        :arsredovisning="arsredovisning"
        :show-faststallelseintyg="false"
      />
    </div>

    <div>
      <h5>Bolagsverkets kontroller</h5>

      <p>
        Gredor har möjlighet att redan nu köra Bolagsverkets automatiska
        kontroller på din årsredovisning. Kontrollerna är av begränsad
        omfattning, men de kan vara till hjälp för att upptäcka såväl vanliga
        som ovanliga fel. För att använda funktionen behöver du som initierar
        detta vara behörig att företräda företaget samt kunna identifiera dig
        med BankID.
      </p>

      <p>Vill du kontrollera din årsredovisning genom Bolagsverket?</p>

      <div class="format-radios">
        <div class="form-check">
          <input
            id="callBolagsverketRadioNormal"
            v-model="callBolagsverket"
            :value="true"
            class="form-check-input"
            name="callBolagsverketRadio"
            type="radio"
          />
          <label class="form-check-label" for="callBolagsverketRadioNormal">
            Ja, kör Bolagsverkets kontroller
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
      </div>
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        callBolagsverket === undefined ||
        (callBolagsverket && !personnummerRegex.test(personalNumber)) ||
        !ixbrl
      "
      :next-button-text="ixbrl ? 'Nästa' : 'Vänta – arbetar i bakgrunden…'"
      :previous-button-hidden="currentStepNumber === 1"
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
