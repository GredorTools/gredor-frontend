<script lang="ts" setup>
/**
 * En komponent som låter användaren ladda upp en fil, antingen genom att dra
 * och släppa den eller genom att välja filen i en vanlig dialogruta.
 */

import { useDropZone } from "@vueuse/core";
import { ref } from "vue";
import { requestOpenFile } from "@/util/fileUtils.ts";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import CommonDeleteButton from "@/components/common/CommonDeleteButton.vue";

const props = defineProps<{
  /** Tillåtna filändelser, t.ex.: [".jpg", ".jpeg"] */
  allowedFileExtensions: string[];

  /** Tillåtna datatyper, t.ex.: ["application/pdf"] */
  allowedDataTypes?: string[];

  /** Maximal filstorlek i kilobyte. */
  maxFileSizeKilobytes?: number;

  /** Huruvida komponenten är avvaktiverad, dvs det är inte möjligt att byta
   * fil. */
  disabled?: boolean;

  /** Huruvida namnet på den valda filen ska döljas. */
  hideSelectedFileName?: boolean;

  /** Skriver över texten "Dra och släpp din .filtyp-fil här" med det
   * angivna. */
  dragAndDropTextOverride?: string;

  /** Huruvida det ska vara möjligt att ta bort den valda filen. */
  allowDelete?: boolean;
}>();

const emit = defineEmits<{
  /** Triggas när användaren har valt en fil. */
  (e: "filePicked", file: File): void;

  /** Triggas när användaren har tagit bort den valda filen. */
  (e: "fileDeleted"): void;
}>();

const file = defineModel<File | undefined>();

const dropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (files: File[] | null) => {
    if (files?.[0]) {
      pickFile(files[0]);
    }
  },
  multiple: false,
  preventDefaultForUnhandled: false,
  dataTypes: props.allowedDataTypes,
});

const { showMessageModal } = useModalStore();

async function openFileFromDialog() {
  const file = await requestOpenFile(props.allowedFileExtensions.join(","));
  if (file != null) {
    pickFile(file);
  }
}

function pickFile(newFile: File) {
  if (props.disabled) {
    return;
  }

  if (
    props.maxFileSizeKilobytes != null &&
    newFile.size > props.maxFileSizeKilobytes * 1024
  ) {
    showMessageModal(
      `Filen får inte vara större än ${props.maxFileSizeKilobytes} kB.`,
      "Fel",
    );
    file.value = undefined;
    return;
  }

  if (
    props.allowedDataTypes != null &&
    !props.allowedDataTypes.includes(newFile.type)
  ) {
    showMessageModal(
      `Filen får endast vara av något av dessa format: ${props.allowedFileExtensions.join(", ")}`,
      "Fel",
    );
    file.value = undefined;
    return;
  }

  file.value = newFile;
  emit("filePicked", file.value);
}

function deleteFile() {
  file.value = undefined;
  emit("fileDeleted");
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
    <div class="drop-zone-main">
      {{
        dragAndDropTextOverride ??
        `Dra och släpp din ${allowedFileExtensions.join("/")}-fil här`
      }}
      <button
        :disabled="disabled"
        class="btn btn-outline-primary"
        @click="openFileFromDialog"
      >
        Eller tryck här för att välja fil
      </button>

      <template v-if="!hideSelectedFileName">
        <div v-if="file" class="filename">
          Vald fil: {{ file.name }} <i class="bi bi-check-lg"></i>
        </div>
        <div v-else>&nbsp;</div>
      </template>
    </div>

    <div class="delete-button">
      <CommonDeleteButton
        v-if="allowDelete && file"
        description="Ta bort den valda filen"
        @click="deleteFile()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.drop-zone {
  display: flex;

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

  .drop-zone-main {
    flex: 1;
    padding: 0 $spacing-sm;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
  }

  .delete-button {
    display: flex;
    padding: $spacing-sm;
  }

  .filename {
    padding: 0 $spacing-md;
  }

  .bi-check-lg {
    color: $success-color;
  }
}
</style>
