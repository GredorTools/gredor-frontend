<script lang="ts" setup>
/**
 * En generell komponent för modala fönster.
 */

import { computed, onMounted, provide, ref, useTemplateRef } from "vue";
import { Modal } from "bootstrap";

const props = defineProps<{
  /** Unikt ID (över hela applikationen) för fönstret. */
  id: string;

  /** Fönstrets rubrik. */
  title: string;

  /** Huruvida fönstret ska ha en stäng-knapp (X) uppe till höger
   * (standardvärde är false). */
  showCloseButton?: boolean;
}>();

defineExpose({
  /** Visar det modala fönstret. */
  show: () => {
    modal?.show();
    modalHasBeenShown.value = true;
  },

  /** Döljer det modala fönstret. */
  hide: () => {
    modal?.hide();
  },
});

const footerTeleportPointId = computed(() => `${props.id}-footer-teleport`);

provide(
  "footerTeleportPoint",
  computed(() => `#${footerTeleportPointId.value}`),
);

const modalRef = useTemplateRef("modal-div");
const modalHasBeenShown = ref<boolean>(false);
let modal: Modal | undefined;
onMounted(() => {
  const element = modalRef.value;
  if (element) {
    modal = new Modal(element, {
      backdrop: "static",
      keyboard: false,
    });
  }
});
</script>

<template>
  <div ref="modal-div" class="modal fade" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button
            v-if="showCloseButton"
            aria-label="Close"
            class="btn-close"
            data-bs-dismiss="modal"
            type="button"
          ></button>
        </div>
        <div v-if="modalHasBeenShown" class="modal-body">
          <Suspense>
            <slot />
          </Suspense>
        </div>
        <div :id="footerTeleportPointId" class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.modal-dialog {
  min-width: var(--bs-modal-width);
  width: fit-content;
  max-width: unset;
}

.modal-header {
  background-color: var(--bs-primary-bg-subtle);
}

.modal-body {
  display: flex;
  max-width: 98vw;
  max-height: 75vh;
  overflow-y: auto;
  padding-bottom: $spacing-xl;
}

h3 {
  font-size: $font-size-xl;
}
</style>
