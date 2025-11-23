<script lang="ts" setup>
/**
 * En komponent som hanterar att faktiskt överföra årsredovisningen till
 * Bolagsverket. Användaren får även en länk till det egna utrymmet hos
 * Bolagsverket för att signera årsredovisningen.
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

    /** Användarens e-postadress för aviseringar från Bolagsverket. */
    notificationEmail: string;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const loading = ref<boolean>(true);
const result = ref<components["schemas"]["InlamningOK"] | undefined>();

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
    } = await client.POST("/v1/submission-flow/submit", {
      body: {
        foretagOrgnr:
          props.arsredovisning.foretagsinformation.organisationsnummer.replace(
            "-",
            "",
          ),
        ixbrl: base64encode(props.ixbrl),
        aviseringEpost: props.notificationEmail,
      },
      credentials: "include", // Viktigt för att cookies ska funka
    });

    if (error) {
      showMessageModal(error, "Fel vid kommunikation med Bolagsverket");
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
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda upp
    </CommonModalSubtitle>

    <div v-if="loading">Laddar upp – det kan ta några sekunder…</div>

    <div v-if="result != null">
      <p>
        Årsredovisningen är nu uppladdad till ditt egna utrymme hos
        Bolagsverket.
      </p>

      <p>
        <a :href="result.url" target="_blank">
          Du kan nu klicka här för att signera den.
        </a>
      </p>

      <p>
        <strong>
          Observera att årsredovisningen inte är mottagen av Bolagsverket förrän
          du har signerat den i deras e-tjänst.
        </strong>
      </p>
    </div>

    <CommonWizardButtons
      :next-button-disabled="result == null"
      next-button-text="Stäng"
      previous-button-disabled
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
a {
  font-weight: bold;
}
</style>
