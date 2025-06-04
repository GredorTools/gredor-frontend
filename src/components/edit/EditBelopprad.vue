<script lang="ts" setup>
import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";
import EditBeloppradMonetary from "@/components/edit/belopprad/EditBeloppradMonetary.vue";
import EditBeloppradString from "@/components/edit/belopprad/EditBeloppradString.vue";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import EditBeloppradDecimal from "@/components/edit/belopprad/EditBeloppradDecimal.vue";
import { isBeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";

defineProps<{
  deleteCallback: () => void;
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
  <EditBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :class="[$style.belopprad, classes]"
    :delete-callback="deleteCallback"
    :multiline="stringMultiline || false"
  />
  <EditBeloppradMonetary
    v-if="isBeloppradMonetary(belopprad)"
    :belopprad="belopprad"
    :class="[$style.belopprad, classes]"
    :delete-callback="deleteCallback"
    :show-saldo="monetaryShowSaldo || false"
  />
  <EditBeloppradDecimal
    v-if="isBeloppradDecimal(belopprad)"
    :belopprad="belopprad"
    :class="[$style.belopprad, classes]"
    :delete-callback="deleteCallback"
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

  :global(.gredor-tooltip-target) {
    border-bottom: 1px dotted black;
  }
}
</style>
