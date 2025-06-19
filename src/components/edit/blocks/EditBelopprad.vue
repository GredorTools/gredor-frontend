<script lang="ts" setup>
import EditBeloppradMonetary from "@/components/edit/blocks/belopprad/EditBeloppradMonetary.vue";
import EditBeloppradString from "@/components/edit/blocks/belopprad/EditBeloppradString.vue";

import { isBeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { isBeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import EditBeloppradDecimal from "@/components/edit/blocks/belopprad/EditBeloppradDecimal.vue";
import { isBeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";

defineProps<{
  taxonomyManager: TaxonomyManager;
  deleteCallback: () => void;
  comparableNumPreviousYears?: number;
  comparableAllowNot?: boolean;
  monetaryShowBalanceSign?: boolean;
  stringMultiline?: boolean;
}>();

const belopprad = defineModel<Belopprad>("belopprad", {
  required: true,
});
const belopprader = defineModel<Belopprad[]>("belopprader", {
  required: true,
});
</script>

<template>
  <EditBeloppradString
    v-if="isBeloppradString(belopprad)"
    :belopprad="belopprad"
    :comparable-num-previous-years="comparableNumPreviousYears || 0"
    :delete-callback="deleteCallback"
    :multiline="stringMultiline || false"
    :taxonomy-manager="taxonomyManager"
  />
  <EditBeloppradMonetary
    v-if="isBeloppradMonetary(belopprad)"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :belopprader="belopprader"
    :delete-callback="deleteCallback"
    :num-previous-years="comparableNumPreviousYears || 0"
    :show-balance-sign="monetaryShowBalanceSign || false"
    :taxonomy-manager="taxonomyManager"
  />
  <EditBeloppradDecimal
    v-if="isBeloppradDecimal(belopprad)"
    :allow-not="comparableAllowNot || false"
    :belopprad="belopprad"
    :delete-callback="deleteCallback"
    :num-previous-years="comparableNumPreviousYears || 0"
    :taxonomy-manager="taxonomyManager"
  />
</template>

<style lang="scss" scoped></style>
