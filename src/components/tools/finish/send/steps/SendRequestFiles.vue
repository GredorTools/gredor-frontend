<script lang="ts" setup>
/**
 * En komponent som låter användaren ladda upp filer som behövs för att kunna
 * skicka in årsredovisningen till Bolagsverket.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { parseGredorFile } from "@/util/fileUtils.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonFileInput from "@/components/common/CommonFileInput.vue";
import { ref } from "vue";

defineProps<CommonStepProps>();

/** Årsredovisningen som ska skickas in till Bolagsverket. */
const arsredovisning = defineModel<Arsredovisning | undefined>(
  "arsredovisning",
  {
    required: true,
  },
);

/** Årsredovisningen som en signerad PDF, används av backend för att verifiera
 * behörighet. */
const signedPdf = defineModel<Uint8Array | undefined>("signedPdf", {
  required: true,
});

const emit = defineEmits<CommonWizardButtonsEmits>();

const hasPickedArsredovisningFile = ref<boolean>(false);
const hasPickedSignedPdfFile = ref<boolean>(false);

async function handleArsredovisningFile(file: File) {
  const json = await file.text();
  arsredovisning.value = parseGredorFile<Arsredovisning>(json, [
    "arsredovisning_fardig",
  ]).data;
  hasPickedArsredovisningFile.value = true;
}

async function handleSignedPdfFile(file: File) {
  signedPdf.value = await file.bytes();
  hasPickedSignedPdfFile.value = true;
}
</script>

<template>
  <div>
    <div class="d-flex flex-column gap-3">
      <h4>Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda upp filer</h4>

      <CommonFileInput
        :allowed-file-extensions="['.gredorfardig']"
        @file-picked="handleArsredovisningFile"
      />
      <CommonFileInput
        :allowed-data-types="['application/pdf']"
        :allowed-file-extensions="['.pdf']"
        drag-and-drop-text-override="Dra och släpp din signerade .pdf-fil här"
        @file-picked="handleSignedPdfFile"
      />
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        !hasPickedArsredovisningFile || !handleSignedPdfFile
      "
      previous-button-hidden
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  height: 10rem;
  border: 2px dashed #646464;
  border-radius: 0.5rem;

  &.hover {
    background-color: #cfd8c7;
  }
}
</style>
