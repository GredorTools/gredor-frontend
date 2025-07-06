<script lang="ts" setup>
/**
 * En komponent som låter användaren ladda upp filer som behövs för att kunna
 * skicka in årsredovisningen till Bolagsverket.
 */

import { useDropZone } from "@vueuse/core";
import { ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { parseGredorFile, requestOpenFile } from "@/util/fileUtils.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/tools/finish/common/blocks/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";

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

const arsredovisningFilename = ref<string | undefined>();
const signedPdfFilename = ref<string | undefined>();

const arsredovsisningDropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone: isOverArsredovisningDropZone } = useDropZone(
  arsredovsisningDropZoneRef,
  {
    onDrop: (files: File[] | null) => {
      if (files) {
        handleArsredovisningFile(files[0]);
      }
    },
    multiple: false,
    preventDefaultForUnhandled: false,
  },
);

const signedPdfDropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone: isOverSignedPdfDropZone } = useDropZone(
  signedPdfDropZoneRef,
  {
    onDrop: (files: File[] | null) => {
      if (files) {
        handleSignedPdfFile(files[0]);
      }
    },
    dataTypes: ["application/pdf"],
    multiple: false,
    preventDefaultForUnhandled: false,
  },
);

async function importArsredovisningFile() {
  const file = await requestOpenFile(".gredorfardig");
  await handleArsredovisningFile(file);
}

async function importSignedPdfFile() {
  const file = await requestOpenFile(".pdf");
  await handleSignedPdfFile(file);
}

async function handleArsredovisningFile(file: File | null | undefined) {
  if (file) {
    const json = await file.text();
    arsredovisning.value = parseGredorFile<Arsredovisning>(json, [
      "arsredovisning_fardig",
    ]).data;
    arsredovisningFilename.value = file.name;
  }
}

async function handleSignedPdfFile(file: File | null | undefined) {
  if (file) {
    signedPdf.value = await file.bytes();
    signedPdfFilename.value = file.name;
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-column gap-3">
      <h4>Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda upp filer</h4>

      <div
        ref="arsredovsisningDropZoneRef"
        :class="{ hover: isOverArsredovisningDropZone }"
        class="drop-zone"
      >
        Dra och släpp din .gredorfardig-fil här
        <button
          class="btn btn-outline-primary"
          @click="importArsredovisningFile"
        >
          Eller tryck här för att välja fil
        </button>
        <div v-if="arsredovisningFilename">
          Vald fil: {{ arsredovisningFilename }} ✅
        </div>
        <div v-else>&nbsp;</div>
      </div>
      <div
        ref="signedPdfDropZoneRef"
        :class="{ hover: isOverSignedPdfDropZone }"
        class="drop-zone"
      >
        Dra och släpp din signerade .pdf-fil här
        <button class="btn btn-outline-primary" @click="importSignedPdfFile">
          Eller tryck här för att välja fil
        </button>
        <div v-if="signedPdfFilename">Vald fil: {{ signedPdfFilename }} ✅</div>
        <div v-else>&nbsp;</div>
      </div>
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        arsredovisningFilename == null || signedPdfFilename == null
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
