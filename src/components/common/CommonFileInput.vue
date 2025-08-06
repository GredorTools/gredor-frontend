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
  <div ref="dropZoneRef" :class="{ hover: isOverDropZone }" class="drop-zone">
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
    <div v-if="filename">Vald fil: {{ filename }} ✅</div>
    <div v-else>&nbsp;</div>
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
}
</style>
