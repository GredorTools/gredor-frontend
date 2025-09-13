<script lang="ts" setup>
import { type BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import { getContextRef, getContextRefPrefix } from "@/util/renderUtils.ts";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

defineProps<{
  /** Beloppraden med sträng-värdet som ska renderas. */
  belopprad: BeloppradString;

  /** Taxonomiobjektet som motsvarar beloppraden. */
  taxonomyItem: TaxonomyItem;

  /** 0 för nuvarande räkenskapsår, 1 för senaste tidigare räkenskapsåret, osv.
   * */
  yearIndex: number;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs: Record<string, string>;
}>();
</script>

<template>
  <ix:nonNumeric
    :contextRef="
      getContextRef(taxonomyItem, getContextRefPrefix(taxonomyItem), yearIndex)
    "
    :name="belopprad.taxonomyItemName"
    v-bind="additionalIxbrlAttrs"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    {{ belopprad.text }}
  </ix:nonNumeric>
</template>

<style lang="scss" scoped></style>
