<script lang="ts" setup>
/**
 * En baskomponent för att rendera belopprader där man kan jämföra värden mellan nuvarande och tidigare år.
 * Används som grund för t.ex. monetära och decimala belopprader.
 */

import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { RenderBeloppradDisplayAsType } from "@/components/render/blocks/belopprad/RenderBeloppradDisplayAsType.ts";
import RenderBeloppradCellComparable from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellComparable.vue";

export interface RenderBeloppradComparablePropsBase<
  T extends BaseBeloppradComparable,
> {
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med jämförbara värden som ska redigeras. */
  belopprad: T;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs: Record<string, string>;

  /** Möjliggör att få beloppraden att se ut som en belopprad av en viss nivå,
   * även om den egentligen inte är en belopprad av den nivån. */
  displayAsLevel?: number;

  /** Vilket format beloppraden ska visas i. */
  displayFormat: BeloppFormat;

  /** Möjliggör att visa en egen rubrik för beloppraden. */
  displayHeader?: string;

  /** Beloppradens kontexttyp. */
  contextRefPrefix: "period" | "balans";

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot: boolean;

  /** Hur raden ska visas ("vanlig rad", summarad, eller att det väljs
   * automatiskt). */
  displayAsType: RenderBeloppradDisplayAsType;
}

const props = defineProps<
  RenderBeloppradComparablePropsBase<BaseBeloppradComparable> & {
    /** Antal tidigare räkenskapsår som ska visas. */
    numPreviousYears: number;

    /** Enhet för värdet. */
    unit?: string;

    /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
    showBalanceSign?: boolean;
  }
>();

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad);
});

const displayLevel = computed(
  () => props.displayAsLevel ?? taxonomyItem.value.level,
);
</script>

<template>
  <tr
    :class="{
      summa:
        (taxonomyItem.additionalData.labelType === 'totalLabel' ||
          taxonomyItem.additionalData.isCalculatedItem) &&
        displayAsType === RenderBeloppradDisplayAsType.AUTO,
      ['summa-forced']: displayAsType === RenderBeloppradDisplayAsType.SUM,
      [`level-${displayLevel}`]: true,
    }"
  >
    <td class="rubrik">
      {{ displayHeader || taxonomyItem.additionalData.displayLabel }}
      <span v-if="unit">[{{ unit }}]</span>
    </td>
    <td v-if="allowNot" class="not-container">
      {{ belopprad.not }}
    </td>
    <td class="value-container">
      <template v-if="belopprad.beloppNuvarandeAr.length > 0">
        <slot :taxonomy-item="taxonomyItem" name="output-current-year">
          <RenderBeloppradCellComparable
            :additional-ixbrl-attrs="additionalIxbrlAttrs"
            :belopprad="belopprad"
            :display-format="displayFormat"
            :show-balance-sign="showBalanceSign"
            :taxonomy-item="taxonomyItem"
            :year-index="0"
          />
        </slot>
      </template>
      <template v-else>&ndash;</template>
    </td>
    <td v-for="i in numPreviousYears" :key="i" class="value-container">
      <template v-if="belopprad.beloppTidigareAr[i - 1]?.length > 0">
        <slot
          :previous-year-index="i - 1"
          :taxonomy-item="taxonomyItem"
          name="output-previous-year"
        >
          <RenderBeloppradCellComparable
            :additional-ixbrl-attrs="additionalIxbrlAttrs"
            :belopprad="belopprad"
            :display-format="displayFormat"
            :show-balance-sign="showBalanceSign"
            :taxonomy-item="taxonomyItem"
            :year-index="i"
          />
        </slot>
      </template>
      <template v-else>&ndash;</template>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.summa.level-1,
.summa-forced {
  font-weight: 600;

  td {
    padding-top: 1.25rem;
  }

  .rubrik {
    font-style: italic;
  }
}

.summa.level-2 {
  font-weight: 600;

  td {
    padding-top: 0.5rem;
  }
}

.summa.level-3 {
  font-weight: 500;
}

.summa + :deep(*:not(.summa) td) {
  padding-top: 1.25rem;
}

.summa + :deep(.level-3:not(.summa) td) {
  padding-top: 0.75rem;
}
</style>
