<script lang="ts" setup>
/**
 * En komponent som låter användaren ladda upp filer som behövs för att kunna
 * ladda upp årsredovisningen till Bolagsverket.
 */

import {
  type Arsredovisning,
  upgradeArsredovisningObject,
} from "@/model/arsredovisning/Arsredovisning.ts";
import { parseGredorFile } from "@/util/fileUtils.ts";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonFileInput from "@/components/common/CommonFileInput.vue";
import { ref } from "vue";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import CommonModalContents from "@/components/common/CommonModalContents.vue";

defineProps<CommonStepProps>();

/** Årsredovisningen som ska skickas in till Bolagsverket. */
const arsredovisning = defineModel<Arsredovisning | undefined>(
  "arsredovisning",
  {
    required: true,
  },
);

const emit = defineEmits<CommonWizardButtonsEmits>();

const { showMessageModal } = useModalStore();

const hasPickedArsredovisningFile = ref<boolean>(false);

async function handleArsredovisningFile(file: File) {
  const json = await file.text();
  try {
    const arsredovisningInput = parseGredorFile<Arsredovisning>(json, [
      "arsredovisning_fardig",
    ]).data;
    upgradeArsredovisningObject(arsredovisningInput);
    arsredovisning.value = arsredovisningInput;
  } catch {
    showMessageModal("Filen är ogiltig och kan inte öppnas i Gredor.");
  }
  hasPickedArsredovisningFile.value = true;
}
</script>

<template>
  <CommonModalContents>
    <div class="d-flex flex-column gap-3">
      <CommonModalSubtitle>
        Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda upp filer
      </CommonModalSubtitle>

      <CommonFileInput
        :allowed-file-extensions="['.gredorfardig']"
        data-testid="send-wizard-gredor-file-input"
        @file-picked="handleArsredovisningFile"
      />
    </div>

    <CommonWizardButtons
      :next-button-disabled="!hasPickedArsredovisningFile"
      previous-button-hidden
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
</template>

<style lang="scss" scoped></style>
