<script lang="ts" setup>
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseRenderBeloppradComparable from "@/components/render/belopprad/BaseRenderBeloppradComparable.vue";

defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: BeloppradDecimal;
  contextRefPrefix: "period" | "balans";
}>();
</script>

<template>
  <BaseRenderBeloppradComparable
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :num-previous-years="1"
    :taxonomy-manager="taxonomyManager"
    allow-not
  />
</template>

<style lang="scss" scoped></style>
