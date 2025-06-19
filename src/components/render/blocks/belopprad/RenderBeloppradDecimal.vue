<script lang="ts" setup>
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseRenderBeloppradComparable from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";

defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: BeloppradDecimal;
  contextRefPrefix: "period" | "balans";
  allowNot: boolean;
  displayAsTotalItem: boolean;
}>();
</script>

<template>
  <BaseRenderBeloppradComparable
    :allow-not="allowNot"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-total-item="displayAsTotalItem"
    :num-previous-years="1"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
