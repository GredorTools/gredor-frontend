<script lang="ts" setup>
/**
 * En generell komponent för modala fönsters underrubriker.
 */
</script>

<template>
  <h4>
    <slot />
  </h4>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

h4 {
  font-size: $font-size-lg;
}
</style>
