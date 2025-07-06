<script lang="ts" setup>
/**
 * En komponent för att validera årsredovisningen och hämta kontrollresultat
 * från Bolagsverket.
 *
 * Komponenten skickar en signerad PDF-fil, iXBRL-data och användarens
 * personnummer till backend (som i sin tur anropar Bolagsverket). Sedan visas
 * resultatet av den valideringen.
 */

import { onMounted, ref } from "vue";
import { base64encode, bytesToBase64 } from "byte-base64";
import type { components, paths } from "@/openapi/gredor-backend-v1";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import createClient from "openapi-fetch";
import { getConfigValue } from "@/util/configUtils.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/tools/finish/common/blocks/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;

    /** Årsredovisningen som en signerad PDF, används av backend för att verifiera
     * behörighet. */
    signedPdf: Uint8Array;

    /** Årsredovisningen i iXBRL-format. */
    ixbrl: string;

    /** Användarens personnummer. Måste stämma överens med personnumret i den
     * signerade PDF-årsredovisningsfilen. */
    signerPnr: string;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const loading = ref<boolean>(true);
const result = ref<components["schemas"]["KontrolleraSvar"] | undefined>();

async function performRequest() {
  loading.value = true;
  try {
    const client = createClient<paths>({
      baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
    });

    const {
      data: data, // only present if 2XX response
      error: error, // only present if 4XX or 5XX response
    } = await client.POST("/v1/submission-flow/validate", {
      body: {
        companyOrgnr:
          props.arsredovisning.foretagsinformation.organisationsnummer.replace(
            "-",
            "",
          ),
        signerPnr: props.signerPnr,
        signedPdf: bytesToBase64(props.signedPdf),
        ixbrl: base64encode(props.ixbrl),
      },
    });

    if (error) {
      alert("error");
      alert(error);
    } else if (data) {
      result.value = data;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Timeout så att komponenten hinner renderas
  setTimeout(() => {
    performRequest();
  }, 100);
});
</script>

<template>
  <div>
    <h4>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Bolagsverkets kontroller
    </h4>

    <div v-if="loading">Kontrollerar – det kan ta några sekunder…</div>

    <div v-if="result != null">
      <h5>Kontrollresultat</h5>

      <div
        v-for="(utfall, index) in result.utfall"
        :key="index"
        :class="{
          'alert-danger': utfall.typ === 'error',
          'alert-warning': utfall.typ === 'warn',
          'alert-info': utfall.typ === 'info',
        }"
        class="alert"
        role="alert"
      >
        <strong v-if="utfall.typ === 'error'">Valideringsfel:</strong>
        <strong v-if="utfall.typ === 'warn'">Varning:</strong>
        <strong v-if="utfall.typ === 'info'">Information:</strong>
        {{ utfall.text }}
      </div>

      <template v-if="(result.utfall?.length ?? 0) > 0">
        <h5>Hur man tolkar kontrollresultatet</h5>
        <ul>
          <li>
            <em>Valideringsfel</em>{{ " " }}
            <span class="text-decoration-underline">måste</span> åtgärdas innan
            du skickar in årsredovisningen
          </li>
          <li>
            <em>Varningar</em>{{ " " }}
            <span class="text-decoration-underline">bör</span> åtgärdas innan du
            skickar in årsredovisningen, för att minimera risken för att du får
            ett föreläggande från Bolagsverket
          </li>
          <li><em>Informationsmeddelanden</em> är endast för upplysning</li>
        </ul>
      </template>
      <template v-else>
        Bolagsverkets automatiska kontroller hittade inga anmärkningar.
      </template>
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        result == null || result.utfall?.some((item) => item.typ === 'error')
      "
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
h5 {
  margin-top: 1.5rem;
}
</style>
