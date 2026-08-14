<script setup lang="ts">
/**
 * Applikationens huvudsida, med redigeringsvy, förhandsgranskning och verktyg
 * för att färdigställa och skicka in årsredovisningen. One page to rule them
 * all i dagsläget, i framtiden kan det bli mer uppdelat.
 */

import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";
import ToolsFinish from "@/components/tools/ToolsFinish.vue";
import {
  useGredorHighPerformanceStorage,
  useGredorStorage,
} from "@/components/common/composables/useGredorStorage.ts";
import AppFirstLaunchScreen from "@/components/AppFirstLaunchScreen.vue";
import { emptyArsredovisning } from "@/templates/emptyArsredovisning.ts";
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import { useHorizontalDrag } from "@/components/common/composables/useHorizontalDrag.ts";
import ToolsTodoList from "@/components/tools/ToolsTodoList.vue";
import {
  createArsredovisningFromTemplate,
  upgradeArsredovisningObject,
} from "@/model/arsredovisning/Arsredovisning.ts";
import { useGetIXBRL } from "@/components/common/composables/useGetIXBRL.ts";
import type { ComponentExposed } from "vue-component-type-helpers";
import AppHeader from "@/components/AppHeader.vue";
import AppPage from "@/components/AppPage.vue";
import AppFooter from "@/components/AppFooter.vue";
import { tourSteps } from "@/components/tourSteps.ts";
import type VueOnboardingTour from "vue-onboarding-tour";
import { Tooltip } from "bootstrap";

// Årsredovisning - datahantering
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

onBeforeUnmount(() => {
  removeArsredovisningStorageChangeListener();
});

// Huvudinnehåll
const mainRef = useTemplateRef("main");
const handleRef = useTemplateRef("handle");
const editorRef = useTemplateRef("editor");
const rendererRef = useTemplateRef("renderer");

const renderMain =
  useTemplateRef<ComponentExposed<typeof RenderMain>>("renderMain");
const { getIXBRL } = useGetIXBRL(arsredovisning, renderMain);

useHorizontalDrag(mainRef, handleRef, editorRef, rendererRef, 700, 320);

// Startruta
const showFirstLaunchScreen = useGredorStorage(
  "AppShowFirstLaunchScreen",
  true,
);

// Tooltip för rundtur - visas automatiskt när sidan laddas första gången, så
// fort "Välkommen till Gredor"-rutan är borta
const tourBtn = useTemplateRef("tour-btn");

const tourTooltipHasBeenDisplayed = useGredorStorage(
  "AppTourTooltipHasBeenDisplayed",
  false,
);

if (!tourTooltipHasBeenDisplayed.value) {
  onMounted(() => {
    const element = tourBtn.value;
    if (element) {
      const tooltip = new Tooltip(element);

      function showAndHideTooltip(showTimeout: number) {
        setTimeout(() => {
          tooltip.show();
          setTimeout(() => {
            tooltip.hide();
            tourTooltipHasBeenDisplayed.value = true;
          }, 5000);
        }, showTimeout);
      }

      if (!showFirstLaunchScreen.value) {
        // "Välkommen till Gredor"-rutan visas inte - visa tooltipen direkt
        showAndHideTooltip(500);
      } else {
        // "Välkommen till Gredor"-rutan är i vägen - vänta tills den försvinner
        const unwatchShowFirstLaunchScreen = watch(
          showFirstLaunchScreen,
          () => {
            if (!showFirstLaunchScreen.value) {
              showAndHideTooltip(1000);
              unwatchShowFirstLaunchScreen();
            }
          },
        );
      }
    }
  });
}

// Själva rundturen
const tour = ref<ComponentExposed<typeof VueOnboardingTour>>();

function startTour() {
  // @ts-expect-error Något fel med typerna i VueOnboardingTour - nedan ska fungera
  tour.value?.startTour();
}

function endTour() {
  window.scrollTo(0, 0);
}
</script>
<template>
  <AppPage :show-messages="!showFirstLaunchScreen">
    <template #header>
      <AppHeader
        v-model:arsredovisning="arsredovisning"
        :get-ixbrl-for-preview="getIXBRL"
      >
        <template #extra-content>
          <button
            v-if="arsredovisning"
            id="tour-btn"
            ref="tour-btn"
            aria-label="Starta rundtur genom applikationen"
            class="btn btn-secondary align-self-stretch"
            data-bs-offset="[0, 12]"
            data-bs-placement="left"
            data-bs-title="Första gången här? Ta rundturen!"
            data-bs-toggle="tooltip"
            data-bs-trigger="manual"
            @click="startTour"
          >
            Rundtur
          </button>
        </template>
      </AppHeader>
    </template>

    <div
      ref="main"
      aria-label="Huvudinnehåll"
      class="d-flex overflow-hidden justify-content-between flex-grow-1"
    >
      <div id="editor" ref="editor" aria-label="Redigeringsvy">
        <EditMain v-model:arsredovisning="arsredovisning" />
      </div>

      <div ref="handle" class="handle">
        <i class="bi bi-grip-vertical"></i>
      </div>

      <div id="renderer" ref="renderer" aria-label="Förhandsgranskningsvy">
        <RenderMain
          ref="renderMain"
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

    <VueOnboardingTour
      ref="tour"
      class="tour"
      :steps="tourSteps"
      label-terminate="Avsluta rundtur"
      tour-id="appTour"
      @end-tour="endTour"
    />

    <template #footer>
      <AppFooter />
    </template>
  </AppPage>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

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
    font-weight: 600;
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

.tour {
  top: 0;
  left: 0;
}
</style>
