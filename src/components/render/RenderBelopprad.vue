<script lang="ts" setup>
import RenderBeloppradMonetary from "@/components/render/belopprad/RenderBeloppradMonetary.vue";
import RenderBeloppradString from "@/components/render/belopprad/RenderBeloppradString.vue";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import RenderBeloppradDecimal from "@/components/render/belopprad/RenderBeloppradDecimal.vue";
import { isBeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: Belopprad;
  comparableNumPreviousYears?: number;
  monetaryShowSaldo?: boolean;
  stringShowHeader?: boolean;
}>();

const contextRefPrefix = computed(() => {
  switch (
    props.taxonomyManager.getItem(props.belopprad.taxonomyItemName).properties
      .periodType
  ) {
    case "duration":
      return "period";
    case "instant":
      return "balans";
    default:
      throw new Error("Unknown periodType");
  }
});
</script>

<template>
  <RenderBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :show-header="stringShowHeader || false"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradMonetary
    v-if="isBeloppradMonetary(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :num-previous-years="comparableNumPreviousYears || 0"
    :show-saldo="monetaryShowSaldo || false"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradDecimal
    v-if="isBeloppradDecimal(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :num-previous-years="comparableNumPreviousYears || 0"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
