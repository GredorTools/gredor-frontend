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
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";

const props = defineProps<
  RenderBeloppradComparablePropsBase<BeloppradMonetary> & {
    /** Årsredovisningens redovisningsvaluta. */
    redovisningsvaluta: Redovisningsvaluta;

    /** Huruvida balanstecken (plus/minus) får visas för beloppraden utifrån det
     * motsvarande taxonomiobjektets balance-värde. */
    showBalanceSign: boolean;
  }
>();

const unit = computed(() => {
  switch (props.displayFormat) {
    case BeloppFormat.HELTAL:
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
    :display-as-type="displayAsType"
    :display-format="displayFormat"
    :display-header="displayHeader"
    :num-previous-years="1"
    :show-balance-sign="showBalanceSign"
    :taxonomy-manager="taxonomyManager"
    :unit="unit"
  />
</template>

<style lang="scss" scoped></style>
