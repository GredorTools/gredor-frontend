<script lang="ts" setup>
import RenderBeloppradMonetary from "@/components/render/blocks/belopprad/RenderBeloppradMonetary.vue";
import RenderBeloppradString from "@/components/render/blocks/belopprad/RenderBeloppradString.vue";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import RenderBeloppradDecimal from "@/components/render/blocks/belopprad/RenderBeloppradDecimal.vue";
import { isBeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: Belopprad;
  comparableNumPreviousYears?: number;
  comparableAllowNot?: boolean;
  comparableDisplayAsTotalItem?: boolean;
  monetaryShowBalanceSign?: boolean;
  stringShowHeader?: boolean;
}>();

const contextRefPrefix = computed(() => {
  switch (
    props.taxonomyManager.getItem(
      props.belopprad.taxonomyItemName,
      props.belopprad.labelType,
    ).properties.periodType
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
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-total-item="comparableDisplayAsTotalItem || false"
    :num-previous-years="comparableNumPreviousYears || 0"
    :show-balance-sign="monetaryShowBalanceSign || false"
    :taxonomy-manager="taxonomyManager"
  />
  <RenderBeloppradDecimal
    v-if="isBeloppradDecimal(belopprad)"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-total-item="comparableDisplayAsTotalItem || false"
    :num-previous-years="comparableNumPreviousYears || 0"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
