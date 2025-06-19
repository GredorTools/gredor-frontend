<script lang="ts" setup>
/**
 * En komponent som visar en knapp för att ta bort en belopprad.
 */

const emit = defineEmits<{
  /** Triggas när användaren klickar på ta bort-knappen. */
  (e: "delete"): void;
}>();
</script>

<template>
  <button class="btn btn-danger" @click="emit('delete')">X</button>
</template>

<style lang="scss" scoped></style>
