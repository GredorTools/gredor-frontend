<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import type { BeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Arsredovisning.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import RenderBeloppradCellString from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellString.vue";
import RenderBeloppradCellComparable from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellComparable.vue";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import RenderBeloppradCellEnum from "@/components/render/blocks/belopprad/cell/RenderBeloppradCellEnum.vue";
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
</script>

<template>
  <tr v-if="belopprad.instanser.length > 0">
    <td colspan="3" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL">
      <template v-for="instans in belopprad.instanser" :key="instans.id">
        <ix:tuple :name="belopprad.taxonomyItemName" :tupleID="instans.id" />
      </template>
      <table class="render-tuple-instance">
        <thead>
          <tr>
            <th
              v-for="instansBelopprad in belopprad.instanser[0].belopprader"
              :key="instansBelopprad.taxonomyItemName"
              scope="col"
            >
              {{
                getTaxonomyItemForBelopprad(taxonomyManager, instansBelopprad)
                  .additionalData.displayLabel
              }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="instans in belopprad.instanser" :key="instans.id">
            <td
              v-for="(
                instansBelopprad, instansBeloppradIndex
              ) in instans.belopprader"
              :key="instansBelopprad.taxonomyItemName"
              :class="{ numeric: isBeloppradComparable(instansBelopprad) }"
            >
              <RenderBeloppradCellString
                v-if="
                  isBeloppradString(instansBelopprad) && instansBelopprad.text
                "
                :additional-ixbrl-attrs="{
                  order: (instansBeloppradIndex + 1).toString(),
                  tupleRef: instans.id,
                }"
                :belopprad="instansBelopprad"
                :raw="true"
                :taxonomy-item="
                  getTaxonomyItemForBelopprad(taxonomyManager, instansBelopprad)
                "
                :year-index="0"
              />
              <RenderBeloppradCellComparable
                v-if="
                  isBeloppradComparable(instansBelopprad) &&
                  instansBelopprad.beloppNuvarandeAr
                "
                :additional-ixbrl-attrs="{
                  order: (instansBeloppradIndex + 1).toString(),
                  tupleRef: instans.id,
                }"
                :belopprad="instansBelopprad"
                :display-format="BeloppFormat.HELTAL"
                :taxonomy-item="
                  getTaxonomyItemForBelopprad(taxonomyManager, instansBelopprad)
                "
                :year-index="0"
              />
              <RenderBeloppradCellEnum
                v-if="
                  isBeloppradEnum(instansBelopprad) &&
                  instansBelopprad.beloppNuvarandeAr
                "
                :additional-ixbrl-attrs="{
                  order: (instansBeloppradIndex + 1).toString(),
                  tupleRef: instans.id,
                }"
                :belopprad="instansBelopprad"
                :taxonomy-item="
                  getTaxonomyItemForBelopprad(taxonomyManager, instansBelopprad)
                "
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
}
</style>
