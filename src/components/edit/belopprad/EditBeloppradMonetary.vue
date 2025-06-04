<script lang="ts" setup>
import type { BeloppradMonetary } from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import BaseEditBeloppradContainer from "@/components/edit/belopprad/BaseEditBeloppradContainer.vue";
import BaseEditBeloppradTitle from "@/components/edit/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";

defineProps<{
  showSaldo?: boolean;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradMonetary>("belopprad", {
  required: true,
});
</script>

<template>
  <BaseEditBeloppradContainer :belopprad="belopprad">
    <td>
      <BaseEditBeloppradTitle :belopprad="belopprad" />
    </td>
    <td>
      <input v-model="belopprad.egetNamn" type="text" />
    </td>
    <td>
      <input
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        v-model.trim="belopprad.not"
        type="text"
      />
    </td>
    <td>
      <template v-if="showSaldo">
        <span v-if="belopprad.taxonomyItem.saldo === 'debit'">&minus;</span>
        <span v-if="belopprad.taxonomyItem.saldo === 'credit'">+</span>
      </template>
      <input
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        v-model.trim="belopprad.beloppNuvarandeAr"
        type="text"
      />
    </td>
    <td>
      <template v-if="showSaldo">
        <span v-if="belopprad.taxonomyItem.saldo === 'debit'">&minus;</span>
        <span v-if="belopprad.taxonomyItem.saldo === 'credit'">+</span>
      </template>
      <input
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        v-model.trim="belopprad.beloppForegaendeAr"
        type="text"
      />
    </td>
    <td>
      <BaseEditBeloppradDeleteButton :delete-callback="deleteCallback" />
    </td>
  </BaseEditBeloppradContainer>
</template>

<style lang="scss" scoped></style>
