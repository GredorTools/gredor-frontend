<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har decimaltal som datatyp.
 */

import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import BaseRenderBeloppradComparable from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";

defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med decimalvärden som ska redigeras. */
  belopprad: BeloppradDecimal;

  /** Beloppradens kontexttyp. */
  contextRefPrefix: "period" | "balans";

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot: boolean;

  /** Huruvida beloppraden ska tvångsvisas som en summarad. */
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
