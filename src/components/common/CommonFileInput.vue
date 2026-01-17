<script lang="ts" setup>
/**
 * En komponent som låter användaren ladda upp en fil, antingen genom att dra
 * och släppa den eller genom att välja filen i en vanlig dialogruta.
 */

import { useDropZone } from "@vueuse/core";
import { ref } from "vue";
import { requestOpenFile } from "@/util/fileUtils.ts";

const props = defineProps<{
  /** Tillåtna filändelser, t.ex.: [".jpg", ".jpeg"] */
  allowedFileExtensions: string[];

  /** Tillåtna datatyper, t.ex.: ["application/pdf"] */
  allowedDataTypes?: string[];

  /** Huruvida komponenten är avvaktiverad, dvs det är inte möjligt att byta
   * fil. */
  disabled?: boolean;

  /** Huruvida namnet på den valda filen ska döljas. */
  hideSelectedFileName?: boolean;

  /** Skriver över texten "Dra och släpp din .filtyp-fil här" med det angivna */
  dragAndDropTextOverride?: string;
}>();

const emit = defineEmits<{
  /** Triggas när användaren har valt en fil. */
  (e: "filePicked", file: File): void;
}>();

const filename = ref<string | undefined>();

const dropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (files: File[] | null) => {
    if (files) {
      onFilePicked(files[0]);
    }
  },
  multiple: false,
  preventDefaultForUnhandled: false,
  dataTypes: props.allowedDataTypes,
});

async function importFile() {
  const file = await requestOpenFile(props.allowedFileExtensions.join(","));
  onFilePicked(file);
}

function onFilePicked(file: File | null | undefined) {
  if (props.disabled) {
    return;
  }

  if (file) {
    filename.value = file.name;
    emit("filePicked", file);
  }
}
</script>

<template>
  <div
    ref="dropZoneRef"
    :class="{
      hover: isOverDropZone,
      'hide-selected-file-name': hideSelectedFileName,
    }"
    class="drop-zone"
  >
    {{
      dragAndDropTextOverride ??
      `Dra och släpp din ${allowedFileExtensions.join("/")}-fil här`
    }}
    <button
      :disabled="disabled"
      class="btn btn-outline-primary"
      @click="importFile"
    >
      Eller tryck här för att välja fil
    </button>

    <template v-if="!hideSelectedFileName">
      <div v-if="filename" class="filename">
        Vald fil: {{ filename }} <i class="bi bi-check-lg"></i>
      </div>
      <div v-else>&nbsp;</div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;

  height: 10rem;
  border: 2px dashed $medium;
  border-radius: $border-radius-lg;

  &.hover {
    background-color: lighten($primary-color, 40%);
  }

  &.hide-selected-file-name {
    height: 8rem;
    padding-bottom: 0.5rem;
  }

  .filename {
    padding: 0 $spacing-md;
  }

  .bi-check-lg {
    color: $success-color;
  }
}
</style>
