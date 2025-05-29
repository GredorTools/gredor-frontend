<script lang="ts" setup>
import {
  type Belopprad,
  isBeloppradMonetary,
  isBeloppradString,
} from "@/model/arsredovisning/Arsredovisning.ts";
import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";
import EditBeloppradMonetary from "@/components/edit/belopprad/EditBeloppradMonetary.vue";
import EditBeloppradString from "@/components/edit/belopprad/EditBeloppradString.vue";

defineProps<{
  monetaryShowSaldo?: boolean;
  stringMultiline?: boolean;
}>();

const belopprad = defineModel<Belopprad<TaxonomyItemType>>("belopprad", {
  required: true,
});

const classes = {
  abstract: belopprad.value.taxonomyItem.abstrakt === "true",
  [`level-${belopprad.value.taxonomyItem.__Level}`]: true,
};
</script>

<template>
  <EditBeloppradMonetary
    v-if="isBeloppradMonetary(belopprad)"
    :belopprad="belopprad"
    :class="[$style.belopprad, classes]"
    :show-saldo="monetaryShowSaldo || false"
  />
  <EditBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :class="[$style.belopprad, classes]"
    :multiline="stringMultiline || false"
  />
</template>

<style lang="scss" module>
.belopprad {
  &:global(.abstract.level-1) {
    font-weight: 600;
    font-size: 1.2rem;
  }

  &:global(.abstract.level-2) {
    font-weight: 600;
    text-decoration: underline;
  }

  &:global(.abstract.level-3) {
    font-weight: 500;
  }

  &:global(.abstract.level-4) {
    font-weight: 400;
    text-decoration: underline;
  }

  :global(.tooltip .tooltip-target) {
    border-bottom: 1px dotted black;
  }

  :global(.tooltip .tooltip-text) {
    display: none;
    max-width: 320px;
    background-color: black;
    color: #fff;
    border-radius: 0.5rem;
    padding: 0.5rem;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
  }

  :global(.tooltip:hover .tooltip-text) {
    display: block;
  }
}
</style>
