<script lang="ts" setup>
/**
 * Generell komponent för sidlayout. Bör användas i alla sidkomponenter.
 *
 * Följande slots kan sättas in i denna komponent:
 * (default-slot): Sidans innehåll
 * header: Sidhuvud (normalt AppHeader om sidan ska ha sidhuvud)
 * footer: Sidfot (normalt AppFooter om sidan ska ha sidfot)
 */

import AppModalController from "@/components/AppModalController.vue";
import AppMessages from "@/components/AppMessages.vue";

defineProps<{
  /** Huruvida allmänna informationsmeddelanden om t.ex. driftstörningar ska
   * hämtas och visas. */
  showMessages: boolean;

  /** Huruvida sidans innehåll ska ha standardpadding. */
  useStandardContentPadding?: boolean;

  /** Huruvida sidans innehåll ska vara fullt skrollbart. */
  useFullyScrollableContent?: boolean;
}>();
</script>

<template>
  <main aria-label="Gredor årsredovisningsverktyg">
    <slot name="header" />

    <AppMessages v-if="showMessages" />

    <div
      class="content"
      :class="{
        'standard-padding': useStandardContentPadding,
        'fully-scrollable': useFullyScrollableContent,
      }"
    >
      <slot />
    </div>
  </main>

  <slot name="footer" />

  <AppModalController />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

main {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;

  margin: 0 auto;
  font-weight: normal;
  max-width: $max-page-width;
  height: 100vh;
  max-height: 100vh;
  padding: $spacing-xl;
}

.content {
  &:not(.fully-scrollable) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: $spacing-xl;
    flex-grow: 1;
  }

  &.standard-padding {
    padding: $spacing-md 0;
  }
}
</style>
