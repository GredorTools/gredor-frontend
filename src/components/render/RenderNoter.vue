<script lang="ts" setup>
import type {
  Arsredovisning,
  Verksamhetsar,
} from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";
import {
  type BeloppradGroup,
  groupBelopprader,
} from "@/model/arsredovisning/BeloppradGroup.ts";
import { computed, h, type VNode } from "vue";
import { getDisplayNameForTaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

const props = defineProps<{
  arsredovsining: Arsredovisning;
}>();

const groupedBelopprader = computed(() =>
  groupBelopprader(
    props.arsredovsining.noter,
    1,
    (belopprad) => belopprad.taxonomyItem.__Level > 1,
  ),
);

function getValueColumnHeaderCell(
  beloppradGroup: BeloppradGroup,
  verksamhetsar: Verksamhetsar,
): VNode {
  const attrs = { scope: "col" };

  const firstNonStringItem = beloppradGroup.items.find(
    (belopprad) => belopprad.taxonomyItem.datatyp !== "xbrli:stringItemType",
  );
  if (!firstNonStringItem) {
    // Finns inga icke-sträng-värden, vi ska inte ha någon kolumnrubrik
    return h("th", attrs);
  }
  switch (firstNonStringItem.taxonomyItem.periodtyp) {
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
      throw new Error("Unknown periodtyp");
  }
}
</script>

<template>
  <div>
    <h2>Noter</h2>
    <table
      v-for="(beloppradGroup, index) in groupedBelopprader"
      :key="beloppradGroup.items[0].taxonomyItem.id"
    >
      <thead>
        <tr>
          <th scope="col">
            <h3>
              {{
                "Not " +
                (index + 1) +
                ": " +
                getDisplayNameForTaxonomyItem(
                  beloppradGroup.items[0].taxonomyItem,
                )
              }}
            </h3>
          </th>
          <th scope="col"></th>
          <component
            :is="
              getValueColumnHeaderCell(
                beloppradGroup,
                arsredovsining.verksamhetsarNuvarande,
              )
            "
          />
          <component
            :is="
              getValueColumnHeaderCell(
                beloppradGroup,
                arsredovsining.verksamhetsarTidigare[0],
              )
            "
          />
        </tr>
      </thead>
      <tbody>
        <RenderBelopprad
          v-for="belopprad in beloppradGroup.items"
          :key="belopprad.taxonomyItem.id"
          :belopprad="belopprad"
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
