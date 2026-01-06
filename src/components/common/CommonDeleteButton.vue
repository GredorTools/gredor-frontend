<script lang="ts" setup>
/**
 * En komponent som visar en knapp för att ta bort något.
 */

defineProps<{
  /** Beskrivning av vad knappen gör; används som ARIA label. */
  description: string;
}>();

const emit = defineEmits<{
  /** Triggas när användaren klickar på ta bort-knappen. */
  (e: "delete"): void;
}>();
</script>

<template>
  <button
    :aria-label="description"
    class="btn btn-danger"
    @click="emit('delete')"
  >
    <i class="bi bi-trash me-0"></i>
  </button>
</template>

<style lang="scss" scoped></style>
