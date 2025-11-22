<script lang="ts" setup>
/**
 * En komponent för att hantera avtalet från Bolagsverket för användning av eget
 * utrymme vid kontroll eller inlämning av årsredovisning.
 */

import { onMounted, ref } from "vue";
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
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const loading = ref<boolean>(true);
const result = ref<
  components["schemas"]["BolagsverketPreparationResponse"] | undefined
>();
const userAgreed = ref<boolean>(false);

const { showMessageModal } = useModalStore();

async function performRequest() {
  loading.value = true;
  try {
    const client = createClient<paths>({
      baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
    });

    const {
      data: prepareData, // only present if 2XX response
      error: prepareError, // only present if 4XX or 5XX response
    } = await client.POST("/v1/submission-flow/prepare", {
      body: {
        foretagOrgnr:
          props.arsredovisning.foretagsinformation.organisationsnummer.replace(
            "-",
            "",
          ),
      },
      credentials: "include", // Viktigt för att cookies ska funka
    });

    if (prepareError) {
      showMessageModal(prepareError);
    } else if (prepareData) {
      result.value = prepareData;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Timeout så att komponenten hinner renderas och man hinner uppfatta
  // "laddar"-texten
  setTimeout(() => {
    performRequest();
  }, 250);
});
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Information från Bolagsverket
    </CommonModalSubtitle>

    <div v-if="loading">Laddar…</div>

    <div v-if="result != null && result.avtalstext">
      <p
        v-for="(line, index) in result.avtalstext
          .split(/\r?\n/)
          .filter((l: string) => l.trim().length > 0)"
        :key="index"
      >
        {{ line }}
      </p>

      <div class="d-flex align-items-center justify-content-center pb-4">
        <div class="checkbox-container">
          <div class="form-check">
            <input
              id="bolagsverketAgreementCheck"
              v-model="userAgreed"
              class="form-check-input"
              type="checkbox"
            />
            <label class="form-check-label" for="bolagsverketAgreementCheck"
              >Jag godkänner Bolagsverkets villkor
            </label>
          </div>
        </div>
      </div>
    </div>

    <CommonWizardButtons
      :next-button-disabled="!userAgreed"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.checkbox-container {
  border: 1px solid #c0c0c0;
  border-radius: $border-radius-lg;
  padding: $spacing-sm;
  display: inline-block;
}
</style>
