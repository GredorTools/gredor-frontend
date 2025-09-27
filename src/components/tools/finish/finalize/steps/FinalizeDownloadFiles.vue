<script lang="ts" setup>
/**
 * En komponent för att ladda ner en .gredorfardig-fil som innehåller den
 * färdiga årsredovisningen.
 *
 * Komponenten ger användaren möjlighet att ladda ner en JSON-fil med
 * årsredovisningsdata, som kommer att behövas efter årsstämman, när
 * årsredovisningen skickas in till Bolagsverket
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import { requestSaveFile } from "@/util/fileUtils.ts";
import { ref } from "vue";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

const emit = defineEmits<CommonWizardButtonsEmits>();

const hasDownloaded = ref<boolean>(false);

function exportFile() {
  const dataContainer: DataContainer<Arsredovisning> = {
    dataType: "arsredovisning_fardig",
    version: 1,
    data: props.arsredovisning,
  };

  requestSaveFile(
    JSON.stringify(dataContainer),
    `Arsredovisning_${new Date().getTime()}.gredorfardig`,
    "application/json",
  );

  hasDownloaded.value = true;
}
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda ner .gredorfardig-fil
    </CommonModalSubtitle>

    <div>
      <p>Bla bla. Du kommer behöva den senare...</p>
    </div>

    <div class="download-zone">
      <button class="btn btn-primary" @click="exportFile">Ladda ner</button>
    </div>

    <p>
      När du har laddat ner .gredorfardig-filen ovan och sparat den tillsammans
      med din signerade .pdf-fil är ditt företag redo för årsstämma! Efter
      årsstämman kan du använda Gredor-funktionen "Ladda upp till Bolagsverket
      efter årsstämma" för att gå vidare med inlämningen.
    </p>

    <CommonWizardButtons
      :next-button-disabled="!hasDownloaded"
      :previous-button-hidden="currentStepNumber === 1"
      next-button-text="Stäng"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
.download-zone {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 10rem;
}
</style>
