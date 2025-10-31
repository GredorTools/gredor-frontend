<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import type { BeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";
import RenderBeloppradCell from "@/components/render/blocks/belopprad/cell/RenderBeloppradCell.vue";
import { computed } from "vue";

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
</script>

<template>
  <tr v-if="belopprad.instanser.length > 0">
    <td colspan="3" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL">
      <template v-for="instans in belopprad.instanser" :key="instans.id">
        <ix:tuple :name="belopprad.taxonomyItemName" :tupleID="instans.id" />
      </template>

      <div class="rubrik">
        {{ displayHeader || taxonomyItem.additionalData.displayLabel }}
      </div>

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
}
</style>
