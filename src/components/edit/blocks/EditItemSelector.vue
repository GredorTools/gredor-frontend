<script lang="ts" setup>
/**
 * En komponent för att välja och lägga till taxonomiobjekt som belopprader.
 */

import { computed, markRaw, ref } from "vue";
import VueSelect, { type Option } from "vue3-select-component";

import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

const props = defineProps<{
  /** Lista över taxonomiobjekt som kan väljas. */
  taxonomyItems: TaxonomyItem[];
}>();

const emit = defineEmits<{
  /** Triggas när användaren väljer att lägga till en ny belopprad baserad på det valda taxonomiobjektet. */
  (e: "addBelopprad", taxonomyItem: TaxonomyItem): void;
}>();

const taxonomyItemToAdd = ref<TaxonomyItem | null | undefined>();

const minimumTaxonomyItemLevel = computed(() => {
  return Math.min(...props.taxonomyItems.map((item) => item.level));
});
</script>

<template>
  <div class="selector-container">
    <VueSelect
      v-model="taxonomyItemToAdd"
      :filter-by="
        (option, label, search) =>
          (option.value.properties.abstract !== 'true' &&
            label.toLowerCase().includes(search.toLowerCase())) ||
          option.value.childrenFlat.some(
            (taxonomyItem) =>
              taxonomyItem.properties.abstract !== 'true' &&
              taxonomyItem.additionalData.displayLabel
                ?.toLowerCase()
                .includes(search.toLowerCase()),
          )
      "
      :options="
        taxonomyItems.map((taxonomyItem) => {
          return {
            label: taxonomyItem.additionalData.displayLabel,
            value: markRaw(taxonomyItem),
            disabled: taxonomyItem.properties.abstract === 'true',
          };
        }) as Option<TaxonomyItem>[]
      "
      class="custom-select"
      placeholder="Välj…"
    >
      <template #option="{ option }">
        <span>
          {{
            "\u00a0".repeat(
              (option.value.level - minimumTaxonomyItemLevel) * 4,
            ) + option.value.additionalData.displayLabel
          }}
        </span>
      </template>

      <template #no-options>Inga resultat hittades.</template>
    </VueSelect>
    <button
      :disabled="taxonomyItemToAdd == null"
      class="btn btn-primary"
      @click="
        () => {
          if (taxonomyItemToAdd != null) {
            emit('addBelopprad', taxonomyItemToAdd);
            taxonomyItemToAdd = null;
          }
        }
      "
    >
      Lägg till rad
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.selector-container {
  display: flex;
  padding: 0 $spacing-sm;
}

.custom-select {
  /* TODO: Kan hamna för långt upp... */
  --vs-menu-height: 24rem;

  --vs-border: 1px solid var(--bs-border-color);

  :deep(.menu) {
    /* Så att dropdownen öppnas uppåt */
    bottom: 100%;
  }

  :deep(.indicators-container > *) {
    /* Fixa att ikornerna hamnar för långt upp/ner */
    display: flex;
  }
}

.custom-select-menu {
  background: $danger-color;
}

.custom-select-indicators-container {
  background: $success-color;
}

button {
  margin-left: $spacing-md;
  white-space: nowrap;
}
</style>
