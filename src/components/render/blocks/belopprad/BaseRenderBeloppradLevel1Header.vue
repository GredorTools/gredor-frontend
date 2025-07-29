<script lang="ts" setup>
/**
 * En baskomponent för att rendera vissa rubriker.
 */

import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

defineProps<{
  /** Taxonomiobjektet som ska användas för rubriken. */
  taxonomyItem: TaxonomyItem;
}>();
</script>

<template>
  <div class="header">
    {{ taxonomyItem.additionalData.displayLabel }}
  </div>
</template>

<style lang="scss" scoped>
.header {
  font-weight: 600;
  font-size: 1.15rem;

  &:not(:first-of-type) td {
    padding-top: 1.25rem;
  }
}
</style>
