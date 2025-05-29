<script lang="ts" setup>
import {
  type Belopprad,
  isBeloppradMonetary,
  isBeloppradString,
} from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBeloppradMonetary from "@/components/render/belopprad/RenderBeloppradMonetary.vue";
import RenderBeloppradString from "@/components/render/belopprad/RenderBeloppradString.vue";
import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";

defineProps<{
  belopprad: Belopprad<TaxonomyItemType>;
  contextRefPrefix: "period" | "balans";
  monetaryShowSaldo?: boolean;
}>();
</script>

<template>
  <RenderBeloppradMonetary
    v-if="isBeloppradMonetary(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :show-saldo="monetaryShowSaldo || false"
  />
  <RenderBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
  />
</template>

<style lang="scss" scoped></style>
