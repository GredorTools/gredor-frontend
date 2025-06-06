<script lang="ts" setup>
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
}>();

const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(belopprad.value.taxonomyItemName);
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
