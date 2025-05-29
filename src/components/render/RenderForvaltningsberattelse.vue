<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";

defineProps<{
  arsredovsining: Arsredovisning;
}>();
</script>

<template>
  <table>
    <tbody>
      <!-- TODO: Olika context-ref-prefix -->
      <RenderBelopprad
        v-for="belopprad in arsredovsining.forvaltningsberattelse"
        :key="belopprad.taxonomyItem.id"
        :belopprad="belopprad"
        context-ref-prefix="balans"
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
