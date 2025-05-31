<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";

defineProps<{
  arsredovsining: Arsredovisning;
}>();
</script>

<template>
  <div>
    <h2>Förvaltningsberättelse</h2>
    <table>
      <tbody>
        <RenderBelopprad
          v-for="belopprad in arsredovsining.forvaltningsberattelse"
          :key="belopprad.taxonomyItem.id"
          :belopprad="belopprad"
          string-show-header
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
