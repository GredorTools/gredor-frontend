<script lang="ts" setup>
/**
 * En komponent för att rendera belopprader som har vallistor som datatyp.
 */

import BaseRenderBeloppradComparable, {
  type RenderBeloppradComparablePropsBase,
} from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";
import type { BeloppradEnum } from "@/model/arsredovisning/beloppradtyper/BeloppradEnum.ts";
import RenderBeloppradCellEnum from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellEnum.vue";

defineProps<RenderBeloppradComparablePropsBase<BeloppradEnum>>();
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
    :taxonomy-manager="taxonomyManager"
  >
    <template #output-current-year="{ taxonomyItem }">
      <RenderBeloppradCellEnum
        :additional-ixbrl-attrs="additionalIxbrlAttrs"
        :belopprad="belopprad"
        :taxonomy-item="taxonomyItem"
        :taxonomy-manager="taxonomyManager"
        :year-index="0"
      />
    </template>

    <template #output-previous-year="{ previousYearIndex, taxonomyItem }">
      <RenderBeloppradCellEnum
        :additional-ixbrl-attrs="additionalIxbrlAttrs"
        :belopprad="belopprad"
        :taxonomy-item="taxonomyItem"
        :taxonomy-manager="taxonomyManager"
        :year-index="previousYearIndex + 1"
      />
    </template>
  </BaseRenderBeloppradComparable>
</template>

<style lang="scss" scoped></style>
