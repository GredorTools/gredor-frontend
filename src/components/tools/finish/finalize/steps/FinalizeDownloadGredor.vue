<script lang="ts" setup>
/**
 * En komponent för att ladda ner en .gredorfardig-fil som innehåller den
 * färdiga årsredovisningen.
 *
 * Komponenten ger användaren möjlighet att ladda ner en JSON-fil med
 * årsredovisningsdata, som kommer att behövas efter årsstämman, när
 * årsredovisningen skickas in till Bolagsverket.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import { requestSaveFile } from "@/util/fileUtils.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";

const props = defineProps<
  CommonStepProps & {
    /** Årsredovisningen som ska skickas in till Bolagsverket. */
    arsredovisning: Arsredovisning;
  }
>();

/** Huruvida användaren har laddat ned .gredorfardig-filen. */
const hasDownloadedGredorfardig = defineModel<boolean>(
  "hasDownloadedGredorfardig",
  {
    required: true,
  },
);

const emit = defineEmits<CommonWizardButtonsEmits>();

function exportGredorfardig() {
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

  hasDownloadedGredorfardig.value = true;
}
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda ner .gredorfardig-fil
    </CommonModalSubtitle>

    <div class="file-zone">
      <div class="download-zone">
        <button class="btn btn-primary" @click="exportGredorfardig">
          Ladda ner .gredorfardig-fil
        </button>
      </div>

      <p>
        Du kommer behöva .gredorfardig-filen senare när du laddar upp
        årsredovisningen till Bolagsverket.
      </p>
    </div>

    <CommonWizardButtons
      :next-button-disabled="!hasDownloadedGredorfardig"
      :previous-button-hidden="currentStepNumber === 1"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.file-zone {
  border: 1px solid $border-color-dark;
  border-radius: var(--bs-border-radius);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.download-zone {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 5rem;
}

a {
  font-weight: bold;
}
</style>
