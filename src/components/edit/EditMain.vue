<script lang="ts" setup>
/**
 * Huvudkomponenten för redigering av årsredovisningen.
 * Hanterar navigering mellan olika delar av årsredovisningen samt import och export av data.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import EditResultatrakning from "@/components/edit/sections/EditResultatrakning.vue";
import EditBalansrakning from "@/components/edit/sections/EditBalansrakning.vue";
import { type Ref, ref } from "vue";
import EditNoter from "@/components/edit/sections/EditNoter.vue";
import EditForvaltningsberattelse from "@/components/edit/sections/EditForvaltningsberattelse.vue";
import EditGrunduppgifter from "@/components/edit/sections/EditGrunduppgifter.vue";
import EditUnderskrifter from "@/components/edit/sections/EditUnderskrifter.vue";

/** Årsredovisningen som redigeras i applikationen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

type Mode =
  | "grunduppgifter"
  | "forvaltningsberattelse"
  | "resultatrakning"
  | "balansrakning"
  | "noter"
  | "underskrifter";
const availableModes: { [mode in Mode]: string } = {
  grunduppgifter: "Grunduppgifter",
  forvaltningsberattelse: "Förvaltningsberättelse",
  resultatrakning: "Resultaträkning",
  balansrakning: "Balansräkning",
  noter: "Noter",
  underskrifter: "Underskrifter",
};
const currentMode: Ref<Mode> = ref("grunduppgifter");
</script>

<template>
  <ul class="nav nav-tabs">
    <li
      v-for="[mode, modeName] in Object.entries(availableModes)"
      :key="mode"
      class="nav-item"
    >
      <a
        :class="{ active: currentMode === mode }"
        class="nav-link"
        href="#"
        @click="currentMode = mode as Mode"
        >{{ modeName }}</a
      >
    </li>
  </ul>

  <div class="editor">
    <Suspense v-if="currentMode === 'grunduppgifter'">
      <EditGrunduppgifter v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'forvaltningsberattelse'">
      <EditForvaltningsberattelse v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'resultatrakning'">
      <EditResultatrakning v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'balansrakning'">
      <EditBalansrakning v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'noter'">
      <EditNoter v-model:arsredovisning="arsredovisning" />
    </Suspense>
    <Suspense v-if="currentMode === 'underskrifter'">
      <EditUnderskrifter v-model:arsredovisning="arsredovisning" />
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.nav {
  border-bottom: 1px solid $border-color-normal;
}

.nav-tabs {
  .nav-item {
    margin-bottom: -1px;

    .nav-link {
      color: $medium;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      font-weight: 500;
      transition: $transition-base;

      &:hover {
        color: $primary-color;
        background-color: rgba($primary-color, 0.2);
      }

      &.active {
        color: $primary-color;
        background-color: $background-light;
        border-color: $border-color-normal $border-color-normal
          $background-light;
      }
    }
  }
}

.editor {
  padding: $spacing-lg $spacing-md;
  background-color: $background-light;
  border: 1px solid $border-color-normal;
  border-top: none;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
}

:deep(table) {
  width: 100%;
  margin-top: $spacing-md;
  margin-bottom: $spacing-md;

  &:not(:first-of-type) {
    margin-top: $spacing-xxl;
  }

  th {
    vertical-align: bottom;
  }

  th,
  td {
    border-style: hidden;
    text-align: left;
    padding: $spacing-xs $spacing-sm;

    &:first-child {
      width: 99%;
    }

    &:not(:first-child) {
      white-space: nowrap;
    }

    &.not-container {
      min-width: 54px;
    }

    &.value-container {
      input,
      select {
        min-width: 120px;
      }

      &:not(.text-left) {
        text-align: right;

        input {
          text-align: right;
        }
      }
    }

    input,
    select {
      width: 100%;
    }
  }

  // Avstånd mellan belopprader
  tr.abstract.level-1:not(:first-child) td {
    padding-top: $spacing-xxl;
  }

  tr.abstract.level-2 td {
    padding-top: $spacing-xl;
  }

  tr.abstract.level-3 td {
    padding-top: $spacing-lg;
  }

  tr.abstract.level-4 td {
    padding-top: $spacing-md;
  }

  tr.abstract.level-1 + tr.abstract.level-2 td {
    padding-top: $spacing-md;
  }

  tr.abstract.level-2 + tr.abstract.level-3 td {
    padding-top: $spacing-sm;
  }

  tr.abstract.level-3 + tr.abstract.level-4 td {
    padding-top: $spacing-xs;
  }
}
</style>
