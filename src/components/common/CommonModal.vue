<script lang="ts" setup>
/**
 * En generell komponent för modala fönster.
 */

import { computed, onMounted, provide, ref, useTemplateRef } from "vue";
import { Modal } from "bootstrap";

const props = defineProps<{
  /** Unikt ID för fönstret. */
  id: string;

  /** Fönstrets rubrik. */
  title: string;
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
    modal = new Modal(element);
  }
});
</script>

<template>
  <div ref="modal-div" class="modal fade" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
        </div>
        <div v-if="modalHasBeenShown" class="modal-body">
          <slot />
        </div>
        <div :id="footerTeleportPointId" class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-dialog {
  min-width: var(--bs-modal-width);
  width: fit-content;
  max-width: unset;
}

.modal-body {
  display: flex;
  max-height: 75vh;
  overflow-y: auto;
  padding-bottom: 2rem;
}
</style>
