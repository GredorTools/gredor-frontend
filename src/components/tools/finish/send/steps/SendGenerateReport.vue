<script lang="ts" setup>
/**
 * En komponent för att generera årsredovisningen i iXBRL-format och samtidigt
 * förhandsgranska hur den kommer att se ut med fastställelseintyget.
 *
 * Komponenten använder sig av RenderMain-komponenten för att rendera
 * årsredovisningen som HTML. Sedan konverteras den renderade HTML:en till
 * iXBRL-format med hjälp av en generator som körs i bakgrunden. Användaren kan
 * fortsätta till nästa steg när konverteringen är klar.
 */

import RenderMain from "@/components/render/RenderMain.vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import { useIXBRLGenerator } from "@/components/tools/finish/common/composables/useIXBRLGenerator.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { requestSaveFile } from "@/util/fileUtils.ts";
import { getConfigValue } from "@/util/configUtils.ts";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;

    /** Huruvida fastställelseintyg ska ingå i den genererade årsredovisningen. */
    includeFaststallelseintyg: boolean;
  }
>();

/** Årsredovisningen i iXBRL-format. */
const ixbrl = defineModel<string | undefined>("ixbrl", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

const renderMain = ref<ComponentExposed<typeof RenderMain>>();

const { tryGenerateIXBRLInInterval } = useIXBRLGenerator({
  renderMain,
  arsredovisning: props.arsredovisning,
  ixbrlOutput: ixbrl,
});
let reportGeneratorIntervalId: number | undefined;
onMounted(() => {
  ixbrl.value = undefined;

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

// För test
function exportArsredovisning() {
  if (ixbrl.value) {
    requestSaveFile(ixbrl.value, "arsredovisning.xhtml", "text/html");
  }
}
</script>

<template>
  <div class="d-flex flex-column preview-container">
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Förhandsgranska
      årsredovisningen
    </CommonModalSubtitle>

    <p>
      Observera att det är Bolagsverket som skapar det slutgiltiga dokumentet,
      och att det eventuellt kan se lite annorlunda ut.
    </p>

    <div v-if="arsredovisning" class="preview">
      <RenderMain
        ref="renderMain"
        :arsredovisning="arsredovisning"
        :show-faststallelseintyg="includeFaststallelseintyg"
      />
    </div>

    <button
      v-if="getConfigValue('VITE_TEST_MODE') === 'true'"
      :disabled="!ixbrl"
      class="btn btn-outline-primary"
      data-testid="send-wizard-export-ixbrl"
      @click="exportArsredovisning()"
    >
      Exportera iXBRL-fil (test)
    </button>

    <CommonWizardButtons
      :next-button-disabled="!ixbrl"
      :next-button-text="ixbrl ? 'Nästa' : 'Vänta – arbetar i bakgrunden…'"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.preview-container {
  width: min-content;
}

p {
  margin: $spacing-md 0;
}

.preview {
  overflow: scroll;
  flex: 1;
  padding: $spacing-sm;
}
</style>
