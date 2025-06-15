<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";
import {
  getTaxonomyManager,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";

const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
);

defineProps<{
  arsredovisning: Arsredovisning;
}>();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col"><h2>Resultaträkning</h2></th>
        <th scope="col">Not</th>
        <th scope="col">
          {{ arsredovisning.verksamhetsarNuvarande.startdatum }}<br />
          –{{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
        </th>
        <th v-if="arsredovisning.verksamhetsarTidigare.length > 0" scope="col">
          {{ arsredovisning.verksamhetsarTidigare[0].startdatum }}<br />
          –{{ arsredovisning.verksamhetsarTidigare[0].slutdatum }}
        </th>
      </tr>
    </thead>
    <tbody>
      <RenderBelopprad
        v-for="belopprad in arsredovisning.resultatrakning"
        :key="belopprad.taxonomyItemName"
        :belopprad="belopprad"
        :comparable-num-previous-years="
          Math.min(arsredovisning.verksamhetsarTidigare.length, 1)
        "
        :taxonomy-manager="taxonomyManager"
        monetary-show-saldo
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
    border-style: hidden;
    text-align: left;
    vertical-align: bottom;
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
