<script lang="ts" setup>
/**
 * En baskomponent för att rendera rubriker på nivå 1.
 */

import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

defineProps<{
  /** Taxonomiobjektet som ska användas för rubriken. */
  taxonomyItem: TaxonomyItem;

  /** Möjliggör att visa en egen rubrik för beloppraden. */
  displayHeader?: string;
}>();
</script>

<template>
  <div class="header">
    {{ displayHeader || taxonomyItem.additionalData.displayLabel }}
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
