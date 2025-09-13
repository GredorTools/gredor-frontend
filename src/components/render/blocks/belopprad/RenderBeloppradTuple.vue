<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { computed } from "vue";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import type { BeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import type { Redovisningsvaluta } from "@/model/arsredovisning/Arsredovisning.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import { getContextRefPrefix } from "@/util/renderUtils.ts";

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

const tupleTaxonomyItem = computed(() =>
  getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad),
);
</script>

<template>
  <tr>
    <td>
      {{ displayHeader || tupleTaxonomyItem?.additionalData.displayLabel }}
    </td>
  </tr>
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
            >
              <ix:nonNumeric
                v-if="
                  isBeloppradString(instansBelopprad) && instansBelopprad.text
                "
                :contextRef="
                  getContextRefPrefix(
                    getTaxonomyItemForBelopprad(
                      taxonomyManager,
                      instansBelopprad,
                    ),
                  ) + '_nuvarande'
                "
                :name="instansBelopprad.taxonomyItemName"
                :order="(instansBeloppradIndex + 1).toString()"
                :tupleRef="instans.id"
              >
                {{ instansBelopprad.text }}
              </ix:nonNumeric>
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

  th,
  td {
    padding-right: 3rem !important;
  }

  th:first-child,
  td:first-child {
    width: unset !important;
  }
}
</style>
