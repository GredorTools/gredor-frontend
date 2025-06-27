<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har monetära värden som datatyp.
 * Visar balanstecken vid behov.
 */

import type { BeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import BaseRenderBeloppradComparable, {
  type RenderBeloppradComparablePropsBase,
} from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";

defineProps<
  RenderBeloppradComparablePropsBase<BeloppradMonetary> & {
    /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
    showBalanceSign: boolean;
  }
>();
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
