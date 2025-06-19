<script lang="ts" setup>
import type { BeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseRenderBeloppradComparable from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";

defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: BeloppradMonetary;
  contextRefPrefix: "period" | "balans";
  allowNot: boolean;
  showBalanceSign: boolean;
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
    :show-balance-sign="showBalanceSign"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
