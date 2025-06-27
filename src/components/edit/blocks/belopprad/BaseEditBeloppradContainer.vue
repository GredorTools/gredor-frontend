<script lang="ts" setup>
/**
 * En baskomponent som fungerar som behållare för belopprader i tabellformat.
 */

import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;
}>();

/** Beloppraden som ska visas i behållaren. */
const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});
</script>

<template>
  <tr
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      [`level-${taxonomyItem.level}`]: true,
    }"
  >
    <slot />
  </tr>
</template>

<style lang="scss" scoped></style>
