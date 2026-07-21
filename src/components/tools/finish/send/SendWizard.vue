<script lang="ts" setup>
/**
 * Wizard för att dirigera användaren genom processen att ladda upp
 * årsredovisningen till sitt egna utrymme hos Bolagsverket.
 *
 * Komponenten innehåller en modal som stegvis guidar användaren genom
 * uppladdning av filer, inmatning av uppgifter, acceptering av avtal, tillägg
 * av fastställelseintyg, generering och validering av årsredovisningen, samt
 * slutgiltig bekräftelse och överföring till Bolagsverket.
 */

import { defineAsyncComponent, ref } from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import CommonComponentLoadError from "@/components/common/CommonComponentLoadError.vue";
import type { ForberedInlamning } from "@/components/common/composables/useForberedInlamning.ts";

const SendWizardSteps = defineAsyncComponent({
  loader: () => import("@/components/tools/finish/send/SendWizardSteps.vue"),
  errorComponent: CommonComponentLoadError,
});

defineProps<{
  /** ID för modalinstansen som är unikt över hela applikationen. */
  instanceId: string;

  /** En årsredovisning som har hämtats från en länk i stället för att laddas
   * upp manuellt. Om den är satt startar wizarden på steg 2. */
  forberedInlamning?: ForberedInlamning;
}>();

const modal = ref<ComponentExposed<typeof CommonModal>>();
defineExpose({
  /** Visar det modala fönstret. */
  show: () => {
    modal.value?.show();
  },

  /** Huruvida det modala fönstret visas just nu. */
  isShown: () => modal.value?.isShown === true,
});
</script>

<template>
  <CommonModal
    :id="`send-wizard-modal-${instanceId}`"
    ref="modal"
    show-close-button
    title="Ladda upp till Bolagsverket"
  >
    <Suspense>
      <SendWizardSteps :forbered-inlamning="forberedInlamning" :modal="modal" />

      <template #fallback>
        <CommonModalContents>
          Laddar…

          <CommonWizardButtons next-button-disabled previous-button-hidden />
        </CommonModalContents>
      </template>
    </Suspense>
  </CommonModal>
</template>

<style lang="scss" scoped></style>
