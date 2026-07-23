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
import { watch } from "vue";
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

/**
 * .gredorfardig-filen som årsredovisningen baaseras på. Används till att "komma
 * ihåg" vilken fil som valdes i wizarden (när man går fram och tillbaka mellan
 * olika steg) i brist på bättre statehantering.
 **/
const arsredovisningGredorFile = defineModel<File | undefined>(
  "arsredovisningGredorFile",
);

const emit = defineEmits<CommonWizardButtonsEmits>();

const { showMessageModal } = useModalStore();

watch(arsredovisningGredorFile, async () => {
  if (arsredovisningGredorFile.value != null) {
    const json = await arsredovisningGredorFile.value.text();
    try {
      const arsredovisningInput = parseGredorFile<Arsredovisning>(json, [
        "arsredovisning_fardig",
      ]).data;
      upgradeArsredovisningObject(arsredovisningInput);
      arsredovisning.value = arsredovisningInput;
    } catch {
      showMessageModal("Filen är ogiltig och kan inte öppnas i Gredor.");
      arsredovisningGredorFile.value = undefined; // Kommer trigga watchern igen och sätta arsredovisning.value till undefined
    }
  } else {
    arsredovisning.value = undefined;
  }
});
</script>

<template>
  <CommonModalContents>
    <div class="d-flex flex-column gap-3">
      <CommonModalSubtitle>
        Steg {{ currentStepNumber }}/{{ numSteps }}: Ladda upp filer
      </CommonModalSubtitle>

      <CommonFileInput
        v-model="arsredovisningGredorFile"
        :allowed-file-extensions="['.gredorfardig']"
        data-testid="send-wizard-gredor-file-input"
      />

      Filen ska du ha laddat ner i samband med att du färdigställde din
      årsredovisning inför årsstämman.
    </div>

    <CommonWizardButtons
      :next-button-disabled="
        arsredovisning == null || arsredovisningGredorFile == null
      "
      previous-button-hidden
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </CommonModalContents>
</template>

<style lang="scss" scoped></style>
