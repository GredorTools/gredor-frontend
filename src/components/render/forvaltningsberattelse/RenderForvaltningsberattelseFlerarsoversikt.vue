<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";
import { type TaxonomyItem, TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { FormatUtil } from "@/util/FormatUtil.ts";
import { isBeloppradInTaxonomyItemList } from "@/model/arsredovisning/Belopprad.ts";
import BaseRenderBeloppradLevel1Header from "@/components/render/belopprad/BaseRenderBeloppradLevel1Header.vue";

defineProps<{
  arsredovisning: Arsredovisning;
  groupTaxonomyItem: TaxonomyItem;
  taxonomyManager: TaxonomyManager;
}>();
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th scope="col">
            <BaseRenderBeloppradLevel1Header
              :taxonomy-item="groupTaxonomyItem"
            />
          </th>
          <th class="value-container" scope="col">
            {{
              FormatUtil.formatDateForFlerarsoversikt(
                arsredovisning.verksamhetsarNuvarande.slutdatum,
              )
            }}
          </th>
          <th
            v-for="previousYearIndex in arsredovisning.verksamhetsarTidigare
              .length"
            :key="previousYearIndex"
            class="value-container"
            scope="col"
          >
            {{
              FormatUtil.formatDateForFlerarsoversikt(
                arsredovisning.verksamhetsarTidigare[previousYearIndex - 1]
                  .slutdatum,
              )
            }}
          </th>
        </tr>
      </thead>
      <tbody>
        <RenderBelopprad
          v-for="[index, belopprad] in [
            ...arsredovisning.forvaltningsberattelse.entries(),
          ].filter(([, b]) =>
            isBeloppradInTaxonomyItemList(
              [groupTaxonomyItem, ...groupTaxonomyItem.childrenFlat],
              b,
            ),
          )"
          :key="belopprad.taxonomyItemName"
          :belopprad="belopprad"
          :comparable-num-previous-years="
            Math.min(arsredovisning.verksamhetsarTidigare.length, 3)
          "
          :taxonomy-manager="taxonomyManager"
        />
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 100%;

  th,
  &:deep(td) {
    border-style: hidden;
    text-align: left;
    padding: 0.25rem 0;

    &:first-child {
      width: 99%;
    }

    &:not(:first-child) {
      padding-left: 1rem;
      white-space: nowrap;
    }

    &.not-container {
      min-width: 40px;
    }

    &.value-container {
      text-align: right;
      min-width: 100px;
    }
  }
}
</style>
