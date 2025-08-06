<script lang="ts" setup>
/**
 * En komponent för att rendera belopprader som har icke-monetära jämförbara
 * värden som datatyp (t.ex. decimalvärden, aktievärden)
 */

import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import BaseRenderBeloppradComparable, {
  type RenderBeloppradComparablePropsBase,
} from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";

defineProps<RenderBeloppradComparablePropsBase<BaseBeloppradComparable>>();
</script>

<template>
  <BaseRenderBeloppradComparable
    :additional-ixbrl-attrs="additionalIxbrlAttrs"
    :allow-not="allowNot"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-total-item="displayAsTotalItem"
    :num-previous-years="1"
    :render-as-level="renderAsLevel"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
