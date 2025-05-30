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
import { computed } from "vue";

const props = defineProps<{
  arsredovsining: Arsredovisning;
}>();

const groupedBelopprader = computed(() =>
  groupBelopprader(props.arsredovsining.noter, 2),
);
//const groupedBelopprader = computed(() =>
//    groupBelopprader(props.arsredovsining.noter, 2).map((group) =>
//        groupBelopprader(group.items, 3),
//    ),
//);

function getValueHeader(
  beloppradGroup: BeloppradGroup,
  verksamhetsar: Verksamhetsar,
): string {
  const firstNonStringItem = beloppradGroup.items.find(
    (belopprad) => belopprad.taxonomyItem.datatyp !== "xbrli:stringItemType",
  );
  if (!firstNonStringItem) {
    // Finns inga icke-sträng-värden, vi ska inte ha någon kolumnrubrik
    return "";
  }
  switch (firstNonStringItem.taxonomyItem.periodtyp) {
    case "duration":
      return `${verksamhetsar.startdatum}<br />–${verksamhetsar.slutdatum}`;
    case "instant":
      return verksamhetsar.slutdatum;
    default:
      throw new Error("Unknown periodtyp");
  }
}
</script>

<template>
  <table
    v-for="(beloppradGroup, index) in groupedBelopprader"
    :key="beloppradGroup.items[0].taxonomyItem.id"
  >
    <thead>
      <tr>
        <th colspan="2" scope="col"></th>
        <th scope="col">
          {{
            getValueHeader(
              beloppradGroup,
              arsredovsining.verksamhetsarNuvarande,
            )
          }}
        </th>
        <th scope="col">
          {{
            getValueHeader(
              beloppradGroup,
              arsredovsining.verksamhetsarTidigare[0],
            )
          }}
        </th>
      </tr>
    </thead>
    <tbody>
      <RenderBelopprad
        v-for="belopprad in beloppradGroup.items.filter(
          (b) =>
            b.taxonomyItem.__Level > 2 || b.taxonomyItem.abstrakt !== 'true',
        )"
        :key="belopprad.taxonomyItem.id"
        :belopprad="belopprad"
        :string-header-mapper="
          belopprad.taxonomyItem.__Level === 2
            ? (text) => 'Not ' + (index + 1) + ': ' + text
            : undefined
        "
        string-show-header
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  width: 100%;

  th,
  &:deep(td) {
    text-align: left;
    padding: 0.25rem;

    &:first-child {
      width: 99%;
    }

    &:not(:first-child) {
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
