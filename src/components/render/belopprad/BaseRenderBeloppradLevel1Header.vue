<script lang="ts" setup>
import { type TaxonomyItem } from "@/util/TaxonomyManager.ts";

defineProps<{
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
