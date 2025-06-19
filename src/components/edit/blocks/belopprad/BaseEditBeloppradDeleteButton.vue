<script lang="ts" setup>
defineProps<{
  deleteCallback: () => void;
}>();
</script>

<template>
  <button class="btn btn-danger" @click="deleteCallback">X</button>
</template>

<style lang="scss" scoped></style>
