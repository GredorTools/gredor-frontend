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

  /** Möjliggör att få beloppraden att se ut som en belopprad av en viss nivå,
   * även om den egentligen inte är en belopprad av den nivån. */
  displayAsLevel?: number;

  /** Huruvida hover-effekten ska avaktiveras. */
  disableHoverEffect?: boolean;
}>();

/** Beloppraden som ska visas i behållaren. */
const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});

const displayLevel = computed(
  () => props.displayAsLevel ?? taxonomyItem.value.level,
);
</script>

<template>
  <tr
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      [`level-${displayLevel}`]: true,
      'disable-hover-effect': disableHoverEffect === true,
    }"
  >
    <slot />
  </tr>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

tr {
  transition: $transition-base;

  &:not(.abstract):not(.disable-hover-effect):hover {
    background-color: rgba($primary-color, 0.1);
  }
}
</style>
