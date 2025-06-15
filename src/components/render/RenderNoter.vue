<script lang="ts" setup>
import type {
  Arsredovisning,
  Verksamhetsar,
} from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";
import { computed, h, type VNode } from "vue";
import {
  getTaxonomyManager,
  type TaxonomyItem,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";

const taxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);

const props = defineProps<{
  arsredovisning: Arsredovisning;
}>();

const items = computed(() => {
  return props.arsredovisning.noter.map((belopprad) => {
    return {
      belopprad,
      taxonomyItem: taxonomyManager.getItem(belopprad.taxonomyItemName),
    };
  });
});

function getValueColumnHeaderCell(
  taxonomyItem: TaxonomyItem,
  verksamhetsar: Verksamhetsar,
): VNode {
  const attrs = { scope: "col" };

  const firstNonStringItem = taxonomyItem.childrenFlat.find(
    (child) => child.properties.type !== "xbrli:stringItemType",
  );
  if (!firstNonStringItem) {
    // Finns inga icke-sträng-värden, vi ska inte ha någon kolumnrubrik
    return h("th", attrs);
  }
  switch (firstNonStringItem.properties.periodType) {
    case "duration":
      return h("th", attrs, [
        verksamhetsar.startdatum,
        h("br"),
        "–",
        verksamhetsar.slutdatum,
      ]);
    case "instant":
      return h("th", attrs, [verksamhetsar.slutdatum]);
    default:
      throw new Error("Unknown periodType");
  }
}
</script>

<template>
  <div>
    <h2>Noter</h2>
    <table
      v-for="(
        { belopprad: headerBelopprad, taxonomyItem: headerTaxonomyItem }, index
      ) in items.filter((i) => i.taxonomyItem.level === 2)"
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
          <th scope="col"></th>
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
              [headerTaxonomyItem, ...headerTaxonomyItem.childrenFlat].some(
                (c) => c.xmlName === i.belopprad.taxonomyItemName,
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

    &:nth-child(2) {
      min-width: 40px;
    }

    &:nth-child(3),
    &:nth-child(4) {
      text-align: right;
      min-width: 100px;
    }
  }
}
</style>
