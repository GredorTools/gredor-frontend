<script lang="ts" setup>
import RenderBeloppradMonetary from "@/components/render/belopprad/RenderBeloppradMonetary.vue";
import RenderBeloppradString from "@/components/render/belopprad/RenderBeloppradString.vue";
import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import RenderBeloppradDecimal from "@/components/render/belopprad/RenderBeloppradDecimal.vue";
import { isBeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import { computed } from "vue";

const props = defineProps<{
  belopprad: Belopprad<TaxonomyItemType>;
  monetaryShowSaldo?: boolean;
  stringShowHeader?: boolean;
  stringHeaderMapper?: (text: string) => string;
}>();

const contextRefPrefix = computed(() => {
  switch (props.belopprad.taxonomyItem.periodtyp) {
    case "duration":
      return "period";
    case "instant":
      return "balans";
    default:
      throw new Error("Unknown periodtyp");
  }
});
</script>

<template>
  <RenderBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :header-mapper="stringHeaderMapper"
    :show-header="stringShowHeader || false"
  />
  <RenderBeloppradMonetary
    v-if="isBeloppradMonetary(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :show-saldo="monetaryShowSaldo || false"
  />
  <RenderBeloppradDecimal
    v-if="isBeloppradDecimal(belopprad)"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
  />
</template>

<style lang="scss" scoped></style>
