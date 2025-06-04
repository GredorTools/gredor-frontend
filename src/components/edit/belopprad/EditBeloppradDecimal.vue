<script lang="ts" setup>
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import BaseEditBeloppradTitle from "@/components/edit/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";

defineProps<{
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradDecimal>("belopprad", {
  required: true,
});
</script>

<template>
  <tr
    :class="{
      abstract: belopprad.taxonomyItem.abstrakt === 'true',
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
  >
    <td>
      <BaseEditBeloppradTitle :belopprad="belopprad" />
    </td>
    <td>
      <input v-model="belopprad.egetNamn" type="text" />
    </td>
    <td></td>
    <td>
      <input
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        v-model.trim="belopprad.beloppNuvarandeAr"
        type="text"
      />
    </td>
    <td>
      <input
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        v-model.trim="belopprad.beloppForegaendeAr"
        type="text"
      />
    </td>
    <td>
      <BaseEditBeloppradDeleteButton :delete-callback="deleteCallback" />
    </td>
  </tr>
</template>

<style lang="scss" scoped></style>
