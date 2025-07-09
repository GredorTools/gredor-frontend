<script lang="ts" setup>
/**
 * Komponent för "tillbaka"/"nästa"-knappar i wizard-flöden.
 */

import { inject, onMounted, ref } from "vue";

defineProps<{
  /** Huruvida "tillbaka"-knappen ska vara osynlig. */
  previousButtonHidden?: boolean;

  /** Huruvida "nästa"-knappen ska vara osynlig. */
  nextButtonHidden?: boolean;

  /** Huruvida "tillbaka"-knappen ska vara aktiverad. */
  previousButtonDisabled?: boolean;

  /** Huruvida "nästa"-knappen ska vara aktiverad. */
  nextButtonDisabled?: boolean;

  /** Text för "tillbak"-knappen. */
  previousButtonText?: string;

  /** Text för "nästa"-knappen. */
  nextButtonText?: string;
}>();

export type CommonWizardButtonsEmits = {
  /** Triggas när användaren väljer att gå till föregående steg i flödet. */
  (e: "goToPreviousStep"): void;
  /** Triggas när användaren väljer att gå till nästa steg i flödet. */
  (e: "goToNextStep"): void;
};
const emit = defineEmits<CommonWizardButtonsEmits>();

const footerTeleportPoint = inject("footerTeleportPoint") as string;

const isMounted = ref<boolean>(false);
onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport v-if="isMounted" :to="footerTeleportPoint">
    <div class="d-flex justify-content-between w-100">
      <button
        v-if="!previousButtonHidden"
        :disabled="previousButtonDisabled"
        class="btn btn-primary"
        @click="emit('goToPreviousStep')"
      >
        {{ previousButtonText || "Tillbaka" }}
      </button>
      <div v-else></div>
      <!-- För att nästa-knappen ska hamna på rätt ställe -->

      <button
        v-if="!nextButtonHidden"
        :disabled="nextButtonDisabled"
        :hidden="nextButtonHidden"
        class="btn btn-primary"
        @click="emit('goToNextStep')"
      >
        {{ nextButtonText || "Nästa" }}
      </button>
      <div v-else></div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped></style>
