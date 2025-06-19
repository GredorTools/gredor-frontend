<script lang="ts" setup>
const emit = defineEmits<{
  (e: "delete"): void;
}>();
</script>

<template>
  <button class="btn btn-danger" @click="emit('delete')">X</button>
</template>

<style lang="scss" scoped></style>
