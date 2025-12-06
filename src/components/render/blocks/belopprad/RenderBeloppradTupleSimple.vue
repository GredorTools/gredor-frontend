<script lang="ts" setup>
/**
 * En komponent för att rendera tuples i en enkel tabell utan årsjämförelser.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  type BeloppradTuple,
  filterInstanserWithValuesInTuple,
  getTaxonomyItemNamesWithValuesInTuple,
} from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";
import RenderBeloppradCell from "@/components/render/blocks/belopprad/cell/RenderBeloppradCell.vue";
import { computed } from "vue";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { isBeloppradEnum } from "@/model/arsredovisning/beloppradtyper/BeloppradEnum.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med tuple-värdet som ska renderas. */
  belopprad: BeloppradTuple;

  /** Årsredovisningens redovisningsvaluta. */
  redovisningsvaluta: Redovisningsvaluta;

  /** Möjliggör att visa en egen rubrik för beloppraden. */
  displayHeader?: string;
}>();

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad);
});

const taxonomyItemNamesWithValues = computed(() =>
  getTaxonomyItemNamesWithValuesInTuple(props.belopprad, 0),
);

const filteredInstanser = computed(() =>
  filterInstanserWithValuesInTuple(
    props.belopprad.instanser,
    taxonomyItemNamesWithValues.value,
    0,
  ),
);
</script>

<template>
  <tr v-if="filteredInstanser.length > 0">
    <td colspan="3" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL">
      <template v-for="instans in filteredInstanser" :key="instans.id">
        <ix:tuple :name="belopprad.taxonomyItemName" :tupleID="instans.id" />
      </template>

      <div class="rubrik">
        {{ displayHeader || taxonomyItem.additionalData.displayLabel }}
      </div>

      <table
        :class="{
          [`num-columns-${filteredInstanser[0].belopprader.length}`]: true,
        }"
        class="render-tuple-instance"
      >
        <thead>
          <tr>
            <th
              v-for="instansBelopprad in filteredInstanser[0].belopprader"
              :key="instansBelopprad.taxonomyItemName"
              scope="col"
            >
              <template
                v-if="
                  taxonomyItemNamesWithValues.has(
                    instansBelopprad.taxonomyItemName,
                  )
                "
              >
                {{
                  getTaxonomyItemForBelopprad(taxonomyManager, instansBelopprad)
                    .additionalData.displayLabel
                }}
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="instans in filteredInstanser" :key="instans.id">
            <td
              v-for="(
                instansBelopprad, instansBeloppradIndex
              ) in instans.belopprader"
              :key="instansBelopprad.taxonomyItemName"
              :class="{
                numeric:
                  isBeloppradComparable(instansBelopprad) &&
                  !isBeloppradEnum(instansBelopprad),
              }"
            >
              <RenderBeloppradCell
                :additional-ixbrl-attrs="{
                  order: (instansBeloppradIndex + 1).toString(),
                  tupleRef: instans.id,
                }"
                :belopprad="instansBelopprad"
                :string-raw="true"
                :taxonomy-manager="taxonomyManager"
                :year-index="0"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.rubrik {
  font-style: italic;
  margin-bottom: $spacing-sm;
}

table.render-tuple-instance {
  margin-top: 0 !important;
  margin-left: 1.5rem;

  width: auto !important;

  th {
    white-space: nowrap; // Förhindra radbrytningar i kolumnrubriker
  }

  th,
  td {
    padding-right: 3rem !important;

    &.numeric {
      text-align: right;
    }
  }

  th:first-child,
  td:first-child {
    width: unset !important;
  }

  // För att tuples inte ska bli för breda minskar vi textstorleken m.m.
  @for $i from 4 through 5 {
    &.num-columns-#{$i} {
      th,
      td {
        padding-right: calc((6 - #{$i}) * 1rem) !important;
      }
    }
  }

  @for $i from 6 through 10 {
    &.num-columns-#{$i} {
      th,
      td {
        padding-right: 0 !important;
      }
    }
  }

  &.num-columns-5 {
    font-size: 0.925rem;
  }

  &.num-columns-6 {
    font-size: 0.85rem;
  }

  &.num-columns-7 {
    font-size: 0.7rem;
  }

  &.num-columns-8 {
    font-size: 0.62rem;
  }

  &.num-columns-9 {
    font-size: 0.55rem;
  }

  &.num-columns-10 {
    // Maxantal
    font-size: 0.5rem;
  }
}
</style>
