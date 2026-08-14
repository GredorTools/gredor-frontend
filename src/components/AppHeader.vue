<script lang="ts" setup>
/**
 * Applikationens sidhuvud inklusive huvudmeny.
 */

import { getConfigValue } from "@/util/configUtils.ts";
import { nextTick, ref, useTemplateRef } from "vue";
import {
  parseGredorFile,
  requestOpenFile,
  requestSaveFile,
} from "@/util/fileUtils.ts";
import {
  type Arsredovisning,
  upgradeArsredovisningObject,
} from "@/model/arsredovisning/Arsredovisning.ts";
import type { DataContainer } from "@/model/DataContainer.ts";
import EditNewArsredovisningModal from "@/components/edit/EditNewArsredovisningModal.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import { Dropdown } from "bootstrap";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import { formatDateForFilename } from "@/util/formatUtils.ts";
import { printDocument } from "@/util/documentUtils.ts";

const props = defineProps<{
  /** Valfri sidrubrik. */
  pageTitle?: string;

  /** En funktion som returnerar iXBRL för utskriftsfunktionen. */
  getIxbrlForPreview?: () => Promise<string | undefined>;
}>();

/** Årsredovisningen som redigeras i applikationen. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning");

const environmentName = getConfigValue("VITE_ENV_NAME");

// Ny årsredovisning
const newArsredovisningModalRenderId = ref<number>(0);
const newArsredovisningModal =
  ref<ComponentExposed<typeof EditNewArsredovisningModal>>();

const { showMessageModal } = useModalStore();

async function showNewArsredovisningModal() {
  newArsredovisningModalRenderId.value++; // Så att komponenten nollställs
  await nextTick(); // Vänta tills den har uppdaterats
  newArsredovisningModal.value?.show(); // Nu kan vi visa modalen
}

// Öppna/Spara
async function importFile() {
  const file = await requestOpenFile(".gredorutkast,.gredorfardig");
  const json = await file?.text();
  if (json) {
    try {
      const arsredovisningInput = parseGredorFile<Arsredovisning>(json, [
        "arsredovisning_utkast",
        "arsredovisning_fardig",
      ]).data;
      upgradeArsredovisningObject(arsredovisningInput);
      arsredovisning.value = arsredovisningInput;
    } catch {
      showMessageModal("Filen är ogiltig och kan inte öppnas i Gredor.");
    }
  }
}

function exportFile() {
  if (!arsredovisning.value) {
    throw new Error("arsredovisning is not defined");
  }

  const dataContainer: DataContainer<Arsredovisning> = {
    dataType: "arsredovisning_utkast",
    version: 1,
    data: arsredovisning.value,
  };

  const filename =
    getConfigValue("VITE_IS_CYPRESS") == "true"
      ? "Arsredovisning.gredorutkast" // För enklare testning
      : `Arsredovisning_${formatDateForFilename(new Date())}.gredorutkast`;

  requestSaveFile(JSON.stringify(dataContainer), filename, "application/json");
}

// Utskrift
const moreDropdownToggle = useTemplateRef("moreDropdownToggle");
const isPrinting = ref(false);

async function print() {
  if (!props.getIxbrlForPreview) {
    throw new Error("getIxbrlForPreview is not defined");
  }

  if (isPrinting.value) {
    return;
  }

  isPrinting.value = true;
  try {
    const ixbrl = await props.getIxbrlForPreview();
    if (ixbrl) {
      printDocument(ixbrl);
    }
  } finally {
    isPrinting.value = false;
    if (moreDropdownToggle.value) {
      Dropdown.getInstance(moreDropdownToggle.value)?.hide();
    }
  }
}

// Felsökningspaket
const isExportingIXBRL = ref(false);

async function exportIXBRL() {
  if (!props.getIxbrlForPreview) {
    throw new Error("getIxbrlForPreview is not defined");
  }

  if (isExportingIXBRL.value) {
    return;
  }

  isExportingIXBRL.value = true;

  try {
    const ixbrl = await props.getIxbrlForPreview();
    if (ixbrl) {
      requestSaveFile(ixbrl, "arsredovisning.xhtml", "text/html");
    }
  } finally {
    isExportingIXBRL.value = false;
  }
}
</script>

<template>
  <header
    class="d-flex flex-row justify-content-between"
    :class="{ 'has-page-title': !!pageTitle }"
  >
    <div class="site-title">
      <h1>
        <img
          alt="Gredor – gratis årsredovisning"
          src="/src/assets/img/logo.svg"
        />
        <span v-if="environmentName" aria-label="Miljö" class="environment">{{
          environmentName
        }}</span>
      </h1>

      <div v-if="arsredovisning" class="d-flex gap-2 menu">
        <button
          id="newArsredovisningBtn"
          class="btn btn-primary"
          @click="showNewArsredovisningModal"
        >
          <i class="bi bi-file-earmark"></i>Ny årsredovisning
        </button>
        <div id="openAndSaveArsredovisningBtns" class="gap-2">
          <button
            id="openArsredovisningBtn"
            class="btn btn-primary"
            @click="importFile"
          >
            <i class="bi bi-folder2-open"></i>Öppna
          </button>
          <button
            id="saveArsredovisningBtn"
            class="btn btn-primary"
            @click="exportFile"
          >
            <i class="bi bi-floppy"></i>Spara som fil
          </button>
        </div>
        <div class="dropdown">
          <button
            v-if="getIxbrlForPreview"
            ref="moreDropdownToggle"
            aria-expanded="false"
            class="btn btn-outline-primary dropdown-toggle"
            data-bs-auto-close="outside"
            data-bs-toggle="dropdown"
            type="button"
          >
            Mer…
          </button>
          <ul class="dropdown-menu">
            <li>
              <a
                :role="!isPrinting ? 'button' : 'status'"
                class="dropdown-item"
                href="#"
                @click.prevent="print"
              >
                <template v-if="!isPrinting">
                  <i v-if="!isPrinting" class="bi bi-printer"></i>
                  Skriv ut / Spara till PDF
                </template>
                <template v-else>
                  <div class="spinner-border"></div>
                  Förbereder utskrift…
                </template>
              </a>
            </li>
            <li>
              <a
                :role="!isExportingIXBRL ? 'button' : 'status'"
                class="dropdown-item"
                href="#"
                @click.prevent="exportIXBRL"
              >
                <template v-if="!isExportingIXBRL">
                  <i
                    v-if="!isExportingIXBRL"
                    class="bi bi-file-earmark-arrow-down"
                  ></i>
                  Avancerat: Exportera iXBRL-fil
                </template>
                <template v-else>
                  <div class="spinner-border"></div>
                  Förbereder iXBRL-export…
                </template>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <h2 v-if="pageTitle" class="page-title">{{ pageTitle }}</h2>

    <div class="extra-content">
      <div class="extra-content-contents">
        <slot name="extra-content" />
      </div>
    </div>
  </header>

  <EditNewArsredovisningModal
    :key="`modal-render-${newArsredovisningModalRenderId}`"
    ref="newArsredovisningModal"
    instance-id="AppHeader"
    @arsredovisning-created="(value) => (arsredovisning = value)"
  />
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

header {
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color-normal;

  .site-title {
    display: flex;
  }

  h1 {
    margin-bottom: 0;
    display: flex;
    align-items: center;

    img {
      height: 52px;
      aspect-ratio: 200 / 58;
    }

    .environment {
      position: relative;
      left: 16px;
      top: -3px;
      color: $secondary-color;
      font-weight: 600;
      font-style: italic;
      font-size: 18pt;

      &:after {
        content: "";
        display: inline-block;
        width: 16px;
      }
    }
  }

  .menu {
    padding-left: $spacing-xl;
    border-left: 1px solid $border-color-normal;
    margin-left: $spacing-xl;

    & > div {
      display: flex;
    }
  }

  .dropdown-menu {
    li:not(:last-child) {
      padding-bottom: $spacing-xs;
      border-bottom: 1px solid $border-color-normal;
    }

    li:not(:first-child) {
      padding-top: $spacing-xs;
    }
  }

  .extra-content-contents {
    display: flex;
    height: 100%;
  }

  &.has-page-title {
    .site-title,
    .extra-content {
      // Så att .page-title centreras
      flex-grow: 1;
      flex-basis: 0;
    }

    .page-title {
      align-self: center;
      font-size: $font-size-xxl;
      margin: 0;
    }

    .extra-content-contents {
      width: fit-content;
      margin-left: auto;
    }
  }
}
</style>
