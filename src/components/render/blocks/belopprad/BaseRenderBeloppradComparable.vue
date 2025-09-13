<script lang="ts" setup>
/**
 * En baskomponent för att rendera belopprader där man kan jämföra värden mellan nuvarande och tidigare år.
 * Används som grund för t.ex. monetära och decimala belopprader.
 */

import { formatNumber } from "@/util/formatUtils.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  getContextRef,
  getNonFractionDecimals,
  getNonFractionScale,
  getSignAttribute,
  getUnitRef
} from "@/util/renderUtils.ts";
import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { RenderBeloppradDisplayAsType } from "@/components/render/blocks/belopprad/RenderBeloppradDisplayAsType.ts";

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

// Hjälpfunktioner
function shouldShowSign(belopp: string) {
  if (props.showBalanceSign) {
    if (taxonomyItem.value.properties.balance === "debit") {
      return (
        belopp.trim().length > 0 &&
        belopp.trim() !== "0" &&
        !belopp.startsWith("-")
      );
    } else if (taxonomyItem.value.properties.balance === "credit") {
      return belopp.startsWith("-");
    }
  } else {
    return belopp.startsWith("-");
  }
}
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
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
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
          <span v-if="shouldShowSign(belopprad.beloppNuvarandeAr)"
            >&minus;</span
          >
          <!-- @delete-whitespace -->
          <ix:nonFraction
            :contextRef="getContextRef(taxonomyItem, contextRefPrefix)"
            :decimals="getNonFractionDecimals(taxonomyItem, displayFormat)"
            :name="taxonomyItem.xmlName"
            :scale="getNonFractionScale(taxonomyItem, displayFormat)"
            :sign="
              isBeloppradMonetary(belopprad)
                ? getSignAttribute(
                    taxonomyItem,
                    belopprad.beloppNuvarandeAr.startsWith('-'),
                  )
                : undefined
            "
            :unitRef="getUnitRef(taxonomyItem)"
            format="ixt:numspacecomma"
            v-bind="additionalIxbrlAttrs"
          >
            {{
              formatNumber(
                belopprad.beloppNuvarandeAr,
                taxonomyItem,
                displayFormat,
                {
                  removeSign: true,
                },
              )
            }}
          </ix:nonFraction>
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
          <span v-if="shouldShowSign(belopprad.beloppTidigareAr[i - 1])"
            >&minus;</span
          >
          <!-- @delete-whitespace -->
          <ix:nonFraction
            :contextRef="getContextRef(taxonomyItem, contextRefPrefix, i)"
            :decimals="getNonFractionDecimals(taxonomyItem, displayFormat)"
            :name="taxonomyItem.xmlName"
            :scale="getNonFractionScale(taxonomyItem, displayFormat)"
            :sign="
              isBeloppradMonetary(belopprad)
                ? getSignAttribute(
                    taxonomyItem,
                    belopprad.beloppTidigareAr[i - 1].startsWith('-'),
                  )
                : undefined
            "
            :unitRef="getUnitRef(taxonomyItem)"
            format="ixt:numspacecomma"
            v-bind="additionalIxbrlAttrs"
          >
            {{
              formatNumber(
                belopprad.beloppTidigareAr[i - 1],
                taxonomyItem,
                displayFormat,
                {
                  removeSign: true,
                },
              )
            }}
          </ix:nonFraction>
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
