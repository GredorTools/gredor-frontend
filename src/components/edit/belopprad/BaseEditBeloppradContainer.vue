<script lang="ts" setup>
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";

const belopprad = defineModel<Belopprad<TaxonomyItemType>>("belopprad", {
  required: true,
});
</script>

<template>
  <tr
    :class="{
      abstract: belopprad.taxonomyItem.abstrakt === 'true',
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
  >
    <slot />
  </tr>
</template>

<style lang="scss" scoped></style>
