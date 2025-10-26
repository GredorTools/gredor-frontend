<script lang="ts" setup>
import { getContextRef, getContextRefPrefix } from "@/util/renderUtils.ts";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { formatEnumValueDisplayLabel } from "@/util/formatUtils.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BeloppradEnum } from "@/model/arsredovisning/beloppradtyper/BeloppradEnum.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med sträng-värdet som ska renderas. */
  belopprad: BeloppradEnum;

  /** Taxonomiobjektet som motsvarar beloppraden. */
  taxonomyItem: TaxonomyItem;

  /** 0 för nuvarande räkenskapsår, 1 för senaste tidigare räkenskapsåret, osv.
   * */
  yearIndex: number;

  /** Möjliggör override av contextRef - används för tuples. */
  contextRefOverrideYearIndex?: number;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs: Record<string, string>;
}>();

const belopp = computed(() => {
  if (props.yearIndex === 0) {
    return props.belopprad.beloppNuvarandeAr;
  } else {
    return props.belopprad.beloppTidigareAr[props.yearIndex - 1];
  }
});
</script>

<template>
  <span class="d-none">
    <ix:nonNumeric
      :contextRef="
        getContextRef(
          taxonomyItem,
          getContextRefPrefix(taxonomyItem),
          contextRefOverrideYearIndex ?? yearIndex,
        )
      "
      :name="taxonomyItem.xmlName"
      v-bind="additionalIxbrlAttrs"
      xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
      >{{ belopp }}
    </ix:nonNumeric>
  </span>
  {{ formatEnumValueDisplayLabel(taxonomyManager.getItemByName(belopp)) }}
</template>

<style lang="scss" scoped></style>
