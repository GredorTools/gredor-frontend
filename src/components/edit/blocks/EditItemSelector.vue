<script lang="ts" setup>
/**
 * En komponent för att välja och lägga till taxonomiobjekt som belopprader.
 */

import { computed, ref } from "vue";
import { type TaxonomyItem } from "@/util/TaxonomyManager.ts";

const props = defineProps<{
  /** Lista över taxonomiobjekt som kan väljas. */
  taxonomyItems: TaxonomyItem[];
}>();

const emit = defineEmits<{
  /** Triggas när användaren väljer att lägga till en ny belopprad baserad på det valda taxonomiobjektet. */
  (e: "addBelopprad", taxonomyItem: TaxonomyItem): void;
}>();

const taxonomyItemToAdd = ref<TaxonomyItem | null>(null);

const minimumTaxonomyItemLevel = computed(() => {
  return Math.min(...props.taxonomyItems.map((item) => item.level));
});
</script>

<template>
  <div class="d-flex">
    <select v-model="taxonomyItemToAdd" class="form-select">
      <option
        v-for="taxonomyItem in taxonomyItems"
        :key="taxonomyItem.xmlName"
        :disabled="taxonomyItem.properties.abstract === 'true'"
        :value="taxonomyItem"
      >
        {{
          "\u00a0".repeat((taxonomyItem.level - minimumTaxonomyItemLevel) * 4) +
          taxonomyItem.additionalData.displayLabel
        }}
      </option>
    </select>
    <button
      :disabled="taxonomyItemToAdd === null"
      class="btn btn-primary"
      @click="
        taxonomyItemToAdd != null && emit('addBelopprad', taxonomyItemToAdd)
      "
    >
      Lägg till rad
    </button>
  </div>
</template>

<style lang="scss" scoped>
button {
  margin-left: 1rem;
  white-space: nowrap;
}
</style>
