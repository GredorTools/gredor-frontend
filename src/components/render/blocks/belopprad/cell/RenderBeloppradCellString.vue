<script lang="ts" setup>
/**
 * Renderar en beloppradscell för textsträngar. Kan visas som rå text (utan
 * p-taggar) eller radbrytas per stycke.
 */

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

  /** Möjliggör override av contextRef - används för tuples. */
  contextRefOverrideYearIndex?: number;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs: Record<string, string>;

  /** Huruvida beloppraden ska renderas som "rå" text, utan p-taggar. */
  raw: boolean;
}>();
</script>

<template>
  <ix:nonNumeric
    :contextRef="
      getContextRef(
        taxonomyItem,
        getContextRefPrefix(taxonomyItem),
        contextRefOverrideYearIndex ?? yearIndex,
      )
    "
    :name="belopprad.taxonomyItemName"
    v-bind="additionalIxbrlAttrs"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <span v-if="raw">
      {{ belopprad.text }}
    </span>
    <p
      v-for="(line, index) in belopprad.text
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0)"
      v-else
      :key="index"
    >
      {{ line }}
    </p>
  </ix:nonNumeric>
</template>

<style lang="scss" scoped></style>
