<script lang="ts" setup>
/**
 * En komponent för att rendera belopprader som har vallistor som datatyp.
 */

import BaseRenderBeloppradComparable, {
  type RenderBeloppradComparablePropsBase,
} from "@/components/render/blocks/belopprad/BaseRenderBeloppradComparable.vue";
import type { BeloppradEnum } from "@/model/arsredovisning/beloppradtyper/BeloppradEnum.ts";

import { formatEnumValueDisplayLabel } from "@/util/formatUtils.ts";

defineProps<RenderBeloppradComparablePropsBase<BeloppradEnum>>();
</script>

<template>
  <BaseRenderBeloppradComparable
    :additional-ixbrl-attrs="additionalIxbrlAttrs"
    :allow-not="allowNot"
    :belopprad="belopprad"
    :context-ref-prefix="contextRefPrefix"
    :display-as-level="displayAsLevel"
    :display-as-total-item="displayAsTotalItem"
    :num-previous-years="1"
    :taxonomy-manager="taxonomyManager"
  >
    <template #output-current-year="{ taxonomyItem }">
      <span class="d-none">
        <ix:nonNumeric
          :contextRef="contextRefPrefix + '_nuvarande'"
          :name="taxonomyItem.xmlName"
          xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
          >{{ belopprad.beloppNuvarandeAr }}
        </ix:nonNumeric>
      </span>
      {{
        formatEnumValueDisplayLabel(
          taxonomyManager.getItemByName(belopprad.beloppNuvarandeAr),
        )
      }}
    </template>

    <template #output-previous-year="{ previousYearIndex, taxonomyItem }">
      <span class="d-none">
        <ix:nonNumeric
          :contextRef="contextRefPrefix + '_tidigare' + previousYearIndex"
          :name="taxonomyItem.xmlName"
          xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
          >{{ belopprad.beloppTidigareAr[previousYearIndex] }}
        </ix:nonNumeric>
      </span>
      {{
        formatEnumValueDisplayLabel(
          taxonomyManager.getItemByName(
            belopprad.beloppTidigareAr[previousYearIndex],
          ),
        )
      }}
    </template>
  </BaseRenderBeloppradComparable>
</template>

<style lang="scss" scoped></style>
