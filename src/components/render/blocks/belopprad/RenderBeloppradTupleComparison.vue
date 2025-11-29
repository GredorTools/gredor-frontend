<script lang="ts" setup>
/**
 * En komponent för att rendera tuples med årsjämförelser i tabellform.
 * Skapar dolda iXBRL-tuple-instanser för nuvarande och tidigare år.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import RenderBeloppradCellComparable from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellComparable.vue";
import { computed } from "vue";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import RenderBeloppradCell from "@/components/render/blocks/belopprad/cell/RenderBeloppradCell.vue";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { embeddedComparisonTuples } from "@/data/embeddedComparisonTuples.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med tuple-värdet som ska renderas. */
  belopprad: BeloppradTuple;

  /** Årsredovisningens redovisningsvaluta. */
  redovisningsvaluta: Redovisningsvaluta;

  /** Möjliggör att visa en egen rubrik för beloppraden. */
  displayHeader?: string;

  /** Antal tidigare räkenskapsår som ska visas för jämförelse. */
  numPreviousYears: number;
}>();

const taxonomyItem = computed(() =>
  getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad),
);
</script>

<template>
  <tr v-if="belopprad.instanser.length > 0">
    <td
      class="render-tuple"
      colspan="3"
      xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
    >
      <template v-for="instans in belopprad.instanser" :key="instans.id">
        <template v-for="i in numPreviousYears + 1" :key="i">
          <ix:tuple
            :name="belopprad.taxonomyItemName"
            :tupleID="`${instans.id}-year${i - 1}`"
          />
        </template>
      </template>

      <div
        v-if="!embeddedComparisonTuples.includes(taxonomyItem.xmlName)"
        class="rubrik"
      >
        {{ displayHeader || taxonomyItem.additionalData.displayLabel }}
      </div>

      <table class="render-tuple-instance">
        <tbody>
          <tr
            v-for="instans in belopprad.instanser"
            :key="instans.id"
            :class="{
              [`level-${taxonomyItem.level}`]: true,
            }"
          >
            <td
              v-for="(
                instansBelopprad, instansBeloppradIndex
              ) in instans.belopprader"
              :key="instansBelopprad.taxonomyItemName"
            >
              <template
                v-if="instansBeloppradIndex < instans.belopprader.length - 1"
              >
                <RenderBeloppradCell
                  :additional-ixbrl-attrs="{
                    order: (instansBeloppradIndex + 1).toString(),
                    tupleRef: `${instans.id}-year0`,
                  }"
                  :belopprad="instansBelopprad"
                  :string-raw="true"
                  :taxonomy-manager="taxonomyManager"
                  :year-index="0"
                />

                <span class="d-none">
                  <RenderBeloppradCell
                    v-for="i in numPreviousYears"
                    :key="i"
                    :additional-ixbrl-attrs="{
                      order: (instansBeloppradIndex + 1).toString(),
                      tupleRef: `${instans.id}-year${i}`,
                    }"
                    :belopprad="instansBelopprad"
                    :context-ref-override-year-index="i"
                    :string-raw="true"
                    :taxonomy-manager="taxonomyManager"
                    :year-index="0"
                  />
                </span>
              </template>
            </td>

            <td class="value-container">
              <template
                v-if="
                  (
                    instans.belopprader[
                      instans.belopprader.length - 1
                    ] as BaseBeloppradComparable
                  ).beloppNuvarandeAr.length > 0
                "
              >
                <RenderBeloppradCellComparable
                  :additional-ixbrl-attrs="{
                    order: instans.belopprader.length.toString(),
                    tupleRef: `${instans.id}-year0`,
                  }"
                  :belopprad="
                    instans.belopprader[
                      instans.belopprader.length - 1
                    ] as BaseBeloppradComparable
                  "
                  :display-format="BeloppFormat.HELTAL"
                  :taxonomy-item="
                    getTaxonomyItemForBelopprad(
                      taxonomyManager,
                      instans.belopprader[instans.belopprader.length - 1],
                    )
                  "
                  :year-index="0"
                />
              </template>
              <template v-else>&ndash;</template>
            </td>
            <td v-for="i in numPreviousYears" :key="i" class="value-container">
              <template
                v-if="
                  (
                    instans.belopprader[
                      instans.belopprader.length - 1
                    ] as BaseBeloppradComparable
                  ).beloppTidigareAr[i - 1]?.length > 0
                "
              >
                <RenderBeloppradCellComparable
                  :additional-ixbrl-attrs="{
                    order: instans.belopprader.length.toString(),
                    tupleRef: `${instans.id}-year${i}`,
                  }"
                  :belopprad="
                    instans.belopprader[
                      instans.belopprader.length - 1
                    ] as BaseBeloppradComparable
                  "
                  :display-format="BeloppFormat.HELTAL"
                  :taxonomy-item="
                    getTaxonomyItemForBelopprad(
                      taxonomyManager,
                      instans.belopprader[instans.belopprader.length - 1],
                    )
                  "
                  :year-index="i"
                />
              </template>
              <template v-else>&ndash;</template>
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
}

.render-tuple-instance {
  margin-bottom: $spacing-sm;

  td.render-tuple {
    padding: 0 !important;
  }
}
</style>
