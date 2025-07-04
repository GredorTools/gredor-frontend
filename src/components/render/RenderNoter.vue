<script lang="ts" setup>
/**
 * En komponent för att rendera noter i årsredovisningen.
 * Visar noter grupperade efter typ med korrekt numrering och formatering.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/blocks/RenderBelopprad.vue";
import { computed } from "vue";
import {
  getTaxonomyManager,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import {
  getTaxonomyItemForBelopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import { getValueColumnHeaderCell } from "@/util/noterUtils.ts";

const taxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);

const props = defineProps<{
  /** Årsredovisningen som innehåller noterna. */
  arsredovisning: Arsredovisning;
}>();

const items = computed(() => {
  return props.arsredovisning.noter.map((belopprad) => {
    return {
      belopprad,
      taxonomyItem: getTaxonomyItemForBelopprad(taxonomyManager, belopprad),
    };
  });
});
</script>

<template>
  <div>
    <h2>Noter</h2>
    <table
      v-for="(
        { belopprad: headerBelopprad, taxonomyItem: headerTaxonomyItem }, index
      ) in items.filter(
        (i) =>
          i.taxonomyItem.xmlName ===
            'se-gen-base:RedovisningsprinciperAbstract' ||
          (i.taxonomyItem.level === 2 &&
            i.taxonomyItem.parent?.xmlName !==
              'se-gen-base:RedovisningsprinciperAbstract'),
      )"
      :key="headerBelopprad.taxonomyItemName"
    >
      <thead>
        <tr>
          <th scope="col">
            <h3>
              {{
                "Not " +
                (index + 1) +
                ": " +
                headerTaxonomyItem.additionalData.displayLabel
              }}
            </h3>
          </th>
          <component
            :is="
              getValueColumnHeaderCell(
                headerTaxonomyItem,
                arsredovisning.verksamhetsarNuvarande,
              )
            "
          />
          <component
            :is="
              getValueColumnHeaderCell(
                headerTaxonomyItem,
                arsredovisning.verksamhetsarTidigare[0],
              )
            "
            v-if="arsredovisning.verksamhetsarTidigare.length > 0"
          />
        </tr>
      </thead>
      <tbody>
        <RenderBelopprad
          v-for="belopprad in items
            .filter((i) =>
              isBeloppradInTaxonomyItemList(
                [headerTaxonomyItem, ...headerTaxonomyItem.childrenFlat],
                i.belopprad,
              ),
            )
            .map((i) => i.belopprad)"
          :key="belopprad.taxonomyItemName"
          :belopprad="belopprad"
          :comparable-num-previous-years="
            Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
          "
          :taxonomy-manager="taxonomyManager"
        />
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  margin-bottom: 0;
}

table {
  width: 100%;
  margin-bottom: 1rem;

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

    &.value-container {
      text-align: right;
      min-width: 100px;
    }
  }
}
</style>
