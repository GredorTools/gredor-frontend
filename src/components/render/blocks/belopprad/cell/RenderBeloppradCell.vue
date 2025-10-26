<script lang="ts" setup>
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { isBeloppradEnum } from "@/model/arsredovisning/beloppradtyper/BeloppradEnum.ts";
import RenderBeloppradCellEnum from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellEnum.vue";
import RenderBeloppradCellString from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellString.vue";
import RenderBeloppradCellComparable from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellComparable.vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden som ska renderas. */
  belopprad: Belopprad;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs?: Record<string, string>;

  /** 0 för nuvarande räkenskapsår, 1 för senaste tidigare räkenskapsåret, osv.
   * */
  yearIndex: number;

  /** Möjliggör override av contextRef - används för tuples. */
  contextRefOverrideYearIndex?: number;

  /** Huruvida strängbelopprader ska renderas som "rå" text, utan p-taggar. */
  stringRaw?: boolean;
}>();
</script>

<template>
  <RenderBeloppradCellString
    v-if="isBeloppradString(belopprad) && belopprad.text"
    :additional-ixbrl-attrs="additionalIxbrlAttrs || {}"
    :belopprad="belopprad"
    :context-ref-override-year-index="contextRefOverrideYearIndex"
    :raw="stringRaw || false"
    :taxonomy-item="getTaxonomyItemForBelopprad(taxonomyManager, belopprad)"
    :year-index="yearIndex"
  />
  <RenderBeloppradCellComparable
    v-else-if="isBeloppradComparable(belopprad) && belopprad.beloppNuvarandeAr"
    :additional-ixbrl-attrs="additionalIxbrlAttrs || {}"
    :belopprad="belopprad"
    :context-ref-override-year-index="contextRefOverrideYearIndex"
    :display-format="BeloppFormat.HELTAL"
    :taxonomy-item="getTaxonomyItemForBelopprad(taxonomyManager, belopprad)"
    :year-index="yearIndex"
  />
  <RenderBeloppradCellEnum
    v-else-if="isBeloppradEnum(belopprad) && belopprad.beloppNuvarandeAr"
    :additional-ixbrl-attrs="additionalIxbrlAttrs || {}"
    :belopprad="belopprad"
    :context-ref-override-year-index="contextRefOverrideYearIndex"
    :taxonomy-item="getTaxonomyItemForBelopprad(taxonomyManager, belopprad)"
    :taxonomy-manager="taxonomyManager"
    :year-index="yearIndex"
  />
</template>

<style lang="scss" scoped></style>
