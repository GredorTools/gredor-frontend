<script lang="ts" setup>
/**
 * En komponent för att rendera belopprader som har monetära värden som datatyp.
 * Visar balanstecken vid behov.
 */

import type { BeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import BaseRenderBeloppradComparable, {
  type RenderBeloppradComparablePropsBase,
} from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";
import { computed } from "vue";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Arsredovisning.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

const props = defineProps<
  RenderBeloppradComparablePropsBase<BeloppradMonetary> & {
    /** Årsredovisningens redovisningsvaluta. */
    redovisningsvaluta: Redovisningsvaluta;

    /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
    showBalanceSign: boolean;
  }
>();

const unit = computed(() => {
  switch (props.displayFormat) {
    case BeloppFormat.NORMAL:
      return undefined;
    case BeloppFormat.TUSENTAL:
      return props.redovisningsvaluta.namnKortTusental;
    default:
      throw new Error("Unknown format");
  }
});
</script>

<template>
  <BaseRenderBeloppradComparable
    :additional-ixbrl-attrs="additionalIxbrlAttrs"
    :allow-not="allowNot"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-level="displayAsLevel"
    :display-as-total-item="displayAsTotalItem"
    :display-format="displayFormat"
    :num-previous-years="1"
    :show-balance-sign="showBalanceSign"
    :taxonomy-manager="taxonomyManager"
    :unit="unit"
  />
</template>

<style lang="scss" scoped></style>
