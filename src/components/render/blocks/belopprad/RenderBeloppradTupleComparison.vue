<script lang="ts" setup>
/**
 * En komponent för att rendera tuples med årsjämförelser i tabellform.
 * Skapar dolda iXBRL-tuple-instanser för nuvarande och tidigare år.
 */

import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import {
  type BeloppradTuple,
  filterInstanserWithValuesInTuple,
  getMainValueBeloppradForInstans,
  getTaxonomyItemNamesWithValuesInTuple,
} from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import RenderBeloppradCellComparable from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellComparable.vue";
import { computed } from "vue";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import RenderBeloppradCell from "@/components/render/blocks/belopprad/cell/RenderBeloppradCell.vue";
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

const taxonomyItemNamesWithValues = computed(() =>
  getTaxonomyItemNamesWithValuesInTuple(
    props.belopprad,
    props.numPreviousYears,
  ),
);

const filteredInstanser = computed(() =>
  filterInstanserWithValuesInTuple(
    props.belopprad.instanser,
    taxonomyItemNamesWithValues.value,
    props.numPreviousYears,
  ),
);

const instansForTableHeader = computed(() =>
  filteredInstanser.value[0].belopprader.filter(
    (instansBelopprad) =>
      instansBelopprad.taxonomyItemName !== mainValueTaxonomyItemName.value,
  ),
);

const mainValueBeloppradPerFilteredInstans = computed(() =>
  filteredInstanser.value.map((instans) =>
    getMainValueBeloppradForInstans(instans, props.belopprad.instanser),
  ),
);

const mainValueTaxonomyItemName = computed(
  () => mainValueBeloppradPerFilteredInstans.value?.[0]?.taxonomyItemName,
);
</script>

<template>
  <tr v-if="filteredInstanser.length > 0">
    <td
      class="render-tuple"
      colspan="3"
      xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
    >
      <template v-for="instans in filteredInstanser" :key="instans.id">
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

      <table
        :class="{
          [`num-columns-${filteredInstanser[0].belopprader.length}`]: true,
        }"
        class="render-tuple-instance"
      >
        <thead v-if="!embeddedComparisonTuples.includes(taxonomyItem.xmlName)">
          <tr>
            <th
              v-for="instansBelopprad in instansForTableHeader"
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
          <tr
            v-for="(instans, instansIndex) in filteredInstanser"
            :key="instans.id"
            :class="{
              [`level-${taxonomyItem.level}`]: true,
            }"
          >
            <td
              v-for="(
                instansBelopprad, instansBeloppradIndex
              ) in instans.belopprader.filter(
                (b) => b.taxonomyItemName !== mainValueTaxonomyItemName,
              )"
              :key="instansBelopprad.taxonomyItemName"
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
            </td>

            <td class="value-container">
              <template
                v-if="
                  !!mainValueBeloppradPerFilteredInstans[instansIndex]
                    ?.beloppNuvarandeAr
                "
              >
                <RenderBeloppradCellComparable
                  :additional-ixbrl-attrs="{
                    order: instans.belopprader.length.toString(),
                    tupleRef: `${instans.id}-year0`,
                  }"
                  :belopprad="
                    mainValueBeloppradPerFilteredInstans[instansIndex]
                  "
                  :display-format="BeloppFormat.HELTAL"
                  :taxonomy-item="
                    getTaxonomyItemForBelopprad(
                      taxonomyManager,
                      mainValueBeloppradPerFilteredInstans[instansIndex],
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
                  mainValueBeloppradPerFilteredInstans[
                    instansIndex
                  ]?.beloppTidigareAr?.some((belopp) => !!belopp)
                "
              >
                <RenderBeloppradCellComparable
                  :additional-ixbrl-attrs="{
                    order: instans.belopprader.length.toString(),
                    tupleRef: `${instans.id}-year${i}`,
                  }"
                  :belopprad="
                    mainValueBeloppradPerFilteredInstans[instansIndex]
                  "
                  :display-format="BeloppFormat.HELTAL"
                  :taxonomy-item="
                    getTaxonomyItemForBelopprad(
                      taxonomyManager,
                      mainValueBeloppradPerFilteredInstans[instansIndex],
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

table.render-tuple-instance {
  margin-bottom: $spacing-sm;

  td.render-tuple {
    padding: 0 !important;
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
