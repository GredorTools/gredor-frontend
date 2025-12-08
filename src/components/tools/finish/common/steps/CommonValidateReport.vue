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
import { base64encode } from "byte-base64";
import type { components, paths } from "@/openapi/gredor-backend-v1";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import createClient from "openapi-fetch";
import { getConfigValue } from "@/util/configUtils.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;

    /** Årsredovisningen i iXBRL-format. */
    ixbrl: string;

    /** Huruvida kontroller för fastställelseintyget ska förkastas. */
    discardFaststallelseintygValidations?: boolean;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const loading = ref<boolean>(true);
const result = ref<components["schemas"]["KontrolleraSvar"] | undefined>();

const { showMessageModal } = useModalStore();

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
        foretagOrgnr:
          props.arsredovisning.foretagsinformation.organisationsnummer.replace(
            "-",
            "",
          ),
        ixbrl: base64encode(props.ixbrl),
      },
      params: {
        cookie: {
          personalNumber: "dummy", // Skrivs över av webbläsaren
        },
      },
      credentials: "include", // Viktigt för att cookies ska funka
    });

    if (error) {
      showMessageModal(error, "Fel vid kommunikation med Bolagsverket");
    } else if (data) {
      if (data.utfall) {
        if (props.discardFaststallelseintygValidations && data.utfall) {
          // Filtrera bort varningar kopplade till fastställelseintyget
          data.utfall = data.utfall.filter(
            (kontroll) =>
              kontroll.kod == null ||
              !["1103", "1164", "1169", "1179"].includes(kontroll.kod),
          );
        }

        if (props.arsredovisning.verksamhetsarTidigare.length === 0) {
          // Filtrera bort varningen "Jämförelsesiffror saknas i
          // resultaträkningen. De behövs om det inte är företagets första
          // räkenskapsår."
          data.utfall = data.utfall.filter(
            (kontroll) => kontroll.kod !== "3007",
          );
        }
      }
      result.value = data;
    }
  } catch (e) {
    if (e instanceof Error) {
      showMessageModal(
        `Teknisk information: ${e.message}`,
        "Fel vid kommunikation med Bolagsverket",
      );
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
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Bolagsverkets kontroller
    </CommonModalSubtitle>

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
        <strong v-if="utfall.typ === 'error'">Fel:</strong>
        <strong v-if="utfall.typ === 'warn'">Varning:</strong>
        <strong v-if="utfall.typ === 'info'">Information:</strong>
        {{ utfall.text }}
      </div>

      <template v-if="(result.utfall?.length ?? 0) > 0">
        <h5>Hur man tolkar kontrollresultatet</h5>
        <ul>
          <li v-if="result.utfall?.some((utfall) => utfall.typ === 'error')">
            <!-- Vi borde aldrig få typ "error" i utfallen eftersom det bara ska
                 vara tekniska fel och de bör fångas upp på annat sätt, men
                 ifall det skulle dyka upp av någon anledning har vi ett färdigt
                 meddelande för det. -->
            <strong>Fel</strong>
            <span class="text-decoration-underline">måste</span> åtgärdas innan
            du fortsätter; vid tekniska fel, mejla
            <a href="mailto:gredor@potatiz.com">gredor@potatiz.com</a> för hjälp
          </li>
          <li>
            <strong>Varningar</strong> bör om möjligt åtgärdas innan du
            fortsätter, för att minimera risken för att du får ett föreläggande
            från Bolagsverket
          </li>
          <li>
            <strong>Informationsmeddelanden</strong> är endast för upplysning
          </li>
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
@import "@/assets/_variables.scss";

h5 {
  font-size: 1.15rem;
  margin-top: $spacing-lg;
}
</style>
