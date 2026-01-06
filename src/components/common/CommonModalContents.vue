<script lang="ts" setup>
/**
 * En generell komponent för innehåll i modala fönster.
 */
</script>

<template>
  <div>
    <div class="wizard-contents-container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.wizard-contents-container {
  padding-bottom: $spacing-lg;
}
</style>
