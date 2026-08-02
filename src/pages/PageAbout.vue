<script setup lang="ts">
/**
 * En sida som innehåller information om applikationen, inklusive
 * integritetspolicy och kontaktuppgifter.
 *
 * Sidan används inte i normalflöden i dagsläget, men kan länkas till från
 * specialflöden, och kanske i framtiden om applikationen delas upp i flera
 * sidor.
 */

import AppHeader from "@/components/AppHeader.vue";
import AppAbout from "@/components/AppAbout.vue";
import AppPage from "@/components/AppPage.vue";
</script>

<template>
  <AppPage
    :show-messages="false"
    use-standard-content-padding
    use-fully-scrollable-content
  >
    <template #header>
      <AppHeader page-title="Om Gredor" />
    </template>

    <AppAbout />
  </AppPage>
</template>

<style lang="scss" scoped>
:deep(.card) {
  --bs-card-bg: white;
}
</style>
