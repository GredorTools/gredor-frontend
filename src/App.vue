<script lang="ts" setup>
/**
 * Huvudkomponenten som sammanför alla delar av applikationen.
 */

import { exampleArsredovisning } from "@/example/exampleArsredovisning.ts";
import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";
import ToolsFinish from "@/components/tools/ToolsFinish.vue";
import { useGredorStorage } from "@/components/common/composables/useGredorStorage.ts";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

const arsredovisning = useGredorStorage(
  "AppAutosaveArsredovisning",
  exampleArsredovisning,
  { highPerformance: true },
);
</script>

<template>
  <main aria-label="Gredor årsredovisningsverktyg" class="d-flex flex-column">
    <AppHeader v-model:arsredovisning="arsredovisning" />

    <div aria-label="Huvudinnehåll" class="d-flex flex overflow-hidden gap-4">
      <div id="editor" aria-label="Redigeringsvy">
        <EditMain v-model:arsredovisning="arsredovisning" />
      </div>

      <div id="renderer" aria-label="Förhandsgranskningsvy">
        <RenderMain
          :arsredovisning="arsredovisning"
          :show-faststallelseintyg="false"
        />
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <div
        aria-label="Hjälpinformation"
        class="help-hint d-flex align-items-center"
        role="note"
      >
        <strong>⬇️ Mer information om Gredor finns nedan! ⬇️</strong>
      </div>

      <div id="tools" aria-label="Verktyg för färdigställande">
        <ToolsFinish :arsredovisning="arsredovisning" />
      </div>
    </div>
  </main>

  <AppFooter />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

main {
  margin: 0 auto;
  font-weight: normal;
  max-width: $max-page-width;
  height: 100vh;
  max-height: 100vh;
  padding: $spacing-xl;
  gap: $spacing-xl;

  #editor {
    display: flex;
    flex-direction: column;
    justify-self: end;
    width: 100%;
  }

  #renderer {
    padding: 0 $spacing-sm $spacing-sm 0;

    @media screen and (max-width: 1600px) {
      width: calc(210mm * 0.76);
      scale: 0.75;
      transform-origin: top left;
    }
  }

  .help-hint {
    border: 1px solid $secondary-color;
    background-color: rgba($secondary-color, 0.1);
    padding: $spacing-xs $spacing-md;
    border-radius: $border-radius;
    box-shadow: $shadow-sm;

    strong {
      color: $secondary-color;
    }
  }
}
</style>
