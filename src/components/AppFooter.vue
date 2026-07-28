<script lang="ts" setup>
/**
 * Applikationens sidfot. I princip en wrapper av "Om Gredor"-komponenten med
 * egen rubrik och bakgrund.
 */

import AppAbout from "@/components/AppAbout.vue";
</script>

<template>
  <aside aria-label="Om Gredor">
    <hr aria-hidden="true" />

    <h2>Om Gredor</h2>

    <AppAbout />
  </aside>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

aside {
  background-color: $background-dark;
}

h2 {
  text-align: center;
  margin-top: $spacing-xxl + $spacing-sm;
  margin-bottom: $spacing-xl;
}
</style>
