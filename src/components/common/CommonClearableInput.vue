<script lang="ts" setup>
/**
 * Ett inmatningsfält med en "x"-knapp som rensar inmatningen när den klickas.
 */

import type { InputHTMLAttributes } from "vue";
defineProps</* @vue-ignore */ InputHTMLAttributes>();

const input = defineModel<string>();
</script>

<template>
  <input v-model="input" v-bind="$attrs" />
  <i v-show="input" class="bi bi-x-lg" v-bind="{}" @click="input = ''"></i>
</template>

<style lang="scss" scoped>
.bi.bi-x-lg {
  position: absolute;
  right: 10px;
  cursor: pointer;
  z-index: 100;
}
</style>
