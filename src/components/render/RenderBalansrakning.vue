<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";

defineProps<{
  arsredovsining: Arsredovisning;
}>();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col"><h2>Balansräkning</h2></th>
        <th scope="col">Not</th>
        <th scope="col">
          {{ arsredovsining.verksamhetsarNuvarande.slutdatum }}
        </th>
        <th scope="col">
          {{ arsredovsining.verksamhetsarTidigare[0].slutdatum }}
        </th>
      </tr>
    </thead>
    <tbody>
      <RenderBelopprad
        v-for="belopprad in arsredovsining.balansrakning"
        :key="belopprad.taxonomyItem.id"
        :belopprad="belopprad"
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
