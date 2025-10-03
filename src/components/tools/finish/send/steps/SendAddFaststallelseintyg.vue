<script lang="ts" setup>
/**
 * En komponent för att lägga till fastställelseintyg i årsredovisningen som ska
 * skickas in till Bolagsverket.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditFaststallelseintyg from "@/components/edit/sections/EditFaststallelseintyg.vue";
import RenderFaststallelseintyg from "@/components/render/blocks/RenderFaststallelseintyg.vue";
import { computed } from "vue";
import CommonWizardButtons, {
  type CommonWizardButtonsEmits,
} from "@/components/common/CommonWizardButtons.vue";
import type { CommonStepProps } from "@/components/tools/finish/common/steps/CommonStepProps.ts";
import CommonModalSubtitle from "@/components/common/CommonModalSubtitle.vue";
import { isFaststallseintygRequiresStammansResultatdisposition } from "@/data/faststallelseintyg.ts";

defineProps<CommonStepProps>();

/** Årsredovisningen som ska skickas in till Bolagsverket. */
const arsredovisning = defineModel<Arsredovisning | undefined>(
  "arsredovisning",
  {
    required: true,
  },
);

const emit = defineEmits<CommonWizardButtonsEmits>();

const isValidFaststallelseintyg = computed(() => {
  const faststallelseintyg = arsredovisning.value?.faststallelseintyg;
  return (
    faststallelseintyg != null &&
    faststallelseintyg.datumArsstamma &&
    faststallelseintyg.resultatdispositionBeslut.text &&
    faststallelseintyg.resultatdispositionBeslut.xbrlId &&
    faststallelseintyg.underskrift.tilltalsnamn &&
    faststallelseintyg.underskrift.efternamn &&
    faststallelseintyg.underskrift.roll &&
    (!isFaststallseintygRequiresStammansResultatdisposition(
      faststallelseintyg,
    ) ||
      Object.values(faststallelseintyg.resultatdispositionStammans).some(
        (value) => value,
      ))
  );
});
</script>

<template>
  <div>
    <CommonModalSubtitle>
      Steg {{ currentStepNumber }}/{{ numSteps }}: Lägg till fastställelseintyg
    </CommonModalSubtitle>
    <div v-if="arsredovisning">
      <div>
        <EditFaststallelseintyg :arsredovisning="arsredovisning" />
      </div>
      <h5>Förhandsgranskning</h5>
      <div class="preview">
        <div class="arsredovisning-root">
          <div class="arsredovisning-content">
            <RenderFaststallelseintyg :arsredovisning="arsredovisning" />
          </div>
        </div>
      </div>
    </div>
    <CommonWizardButtons
      :next-button-disabled="!isValidFaststallelseintyg"
      @go-to-previous-step="emit('goToPreviousStep')"
      @go-to-next-step="emit('goToNextStep')"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/render.scss";
@import "@/assets/_variables.scss";

.preview {
  padding: $spacing-sm;
}
</style>
