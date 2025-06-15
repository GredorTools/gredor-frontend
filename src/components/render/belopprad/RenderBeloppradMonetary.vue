<script lang="ts" setup>
import type { BeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseRenderBeloppradComparable from "@/components/render/belopprad/BaseRenderBeloppradComparable.vue";

defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: BeloppradMonetary;
  contextRefPrefix: "period" | "balans";
  showSaldo: boolean;
}>();
</script>

<template>
  <BaseRenderBeloppradComparable
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :num-previous-years="1"
    :show-saldo="showSaldo"
    :taxonomy-manager="taxonomyManager"
    allow-not
  />
</template>

<style lang="scss" scoped></style>
