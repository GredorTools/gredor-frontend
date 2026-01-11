<script lang="ts" setup>
import { computed, type TextareaHTMLAttributes } from "vue";
import { useTextareaAutosize } from "@vueuse/core";

defineProps</* @vue-ignore */ TextareaHTMLAttributes>();

const input = defineModel<string>();

const { textarea } = useTextareaAutosize({
  input: computed(() => input.value || ""),
});
</script>

<template>
  <textarea ref="textarea" v-model="input" />
</template>

<style lang="scss" scoped>
textarea {
  resize: none;
  transition: none;
  overflow-y: hidden;
}
</style>
