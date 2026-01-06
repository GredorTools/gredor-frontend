<script lang="ts" setup>
/**
 * Huvudkomponenten som sammanför alla delar av applikationen.
 */

import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";
import ToolsFinish from "@/components/tools/ToolsFinish.vue";
import {
  useGredorHighPerformanceStorage,
  useGredorStorage,
} from "@/components/common/composables/useGredorStorage.ts";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import AppFirstLaunchScreen from "@/components/AppFirstLaunchScreen.vue";
import { emptyArsredovisning } from "@/templates/emptyArsredovisning.ts";
import { onBeforeUnmount, useTemplateRef } from "vue";
import AppModalController from "@/components/AppModalController.vue";
import { useHorizontalDrag } from "@/components/common/composables/useHorizontalDrag.ts";
import AppMessages from "@/components/AppMessages.vue";
import ToolsTodoList from "@/components/tools/ToolsTodoList.vue";
import {
  createArsredovisningFromTemplate,
  upgradeArsredovisningObject,
} from "@/model/arsredovisning/Arsredovisning.ts";

const {
  ref: arsredovisning,
  removeFocusChangeListener: removeArsredovisningStorageChangeListener,
} = useGredorHighPerformanceStorage(
  "AppAutosaveArsredovisning",
  createArsredovisningFromTemplate(emptyArsredovisning),
  {
    preloadCallback: upgradeArsredovisningObject,
  },
);

const showFirstLaunchScreen = useGredorStorage(
  "AppShowFirstLaunchScreen",
  true,
);

const mainRef = useTemplateRef("main");
const handleRef = useTemplateRef("handle");
const editorRef = useTemplateRef("editor");
const rendererRef = useTemplateRef("renderer");

useHorizontalDrag(mainRef, handleRef, editorRef, rendererRef, 700, 128);

onBeforeUnmount(() => {
  removeArsredovisningStorageChangeListener();
});
</script>

<template>
  <main aria-label="Gredor årsredovisningsverktyg" class="d-flex flex-column">
    <AppHeader v-model:arsredovisning="arsredovisning" />

    <AppMessages v-if="!showFirstLaunchScreen" />

    <div
      ref="main"
      aria-label="Huvudinnehåll"
      class="d-flex overflow-hidden justify-content-between"
    >
      <div id="editor" ref="editor" aria-label="Redigeringsvy">
        <EditMain v-model:arsredovisning="arsredovisning" />
      </div>

      <div ref="handle" class="handle">
        <i class="bi bi-grip-vertical"></i>
      </div>

      <div id="renderer" ref="renderer" aria-label="Förhandsgranskningsvy">
        <RenderMain
          :arsredovisning="arsredovisning"
          :hide-content="showFirstLaunchScreen"
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
        <strong>
          <i class="bi bi-arrow-down-square-fill"></i>Mer information om Gredor
          finns nedan!<i class="bi bi-arrow-down-square-fill"></i>
        </strong>
      </div>

      <div
        id="tools"
        aria-label="Verktyg för färdigställande"
        class="d-flex gap-3"
      >
        <ToolsTodoList
          v-model:todo-list="arsredovisning.gredorState.todoList"
        />
        <div class="horizontal-separator" />
        <ToolsFinish
          v-model:todo-list="arsredovisning.gredorState.todoList"
          :arsredovisning="arsredovisning"
        />
      </div>
    </div>

    <AppFirstLaunchScreen v-model:arsredovisning="arsredovisning" />
  </main>

  <AppFooter />

  <AppModalController />
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

  .handle {
    width: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: ew-resize;
    }
  }

  #editor {
    display: flex;
    flex-direction: column;
    justify-self: end;
    width: 100%;
  }

  #renderer {
    padding: 0 $spacing-sm $spacing-sm 0;
    transform-origin: top left;
  }

  #tools {
    .horizontal-separator {
      border-left: 1px solid $border-color-normal;
    }
  }

  .help-hint {
    border: 1px solid $secondary-color;
    background-color: rgba($secondary-color, 0.1);
    padding: $spacing-xs (3 * $spacing-xs);
    border-radius: $border-radius;
    box-shadow: $shadow-sm;

    strong {
      color: $secondary-color;
    }

    .bi-arrow-down-square-fill {
      &:first-child {
        margin-right: (3 * $spacing-xs);
      }

      &:last-child {
        margin-left: (3 * $spacing-xs);
      }
    }
  }
}
</style>
