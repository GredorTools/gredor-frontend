<script lang="ts" setup>
import BaseEditBeloppradContainer from "@/components/edit/belopprad/BaseEditBeloppradContainer.vue";
import BaseEditBeloppradTitle from "@/components/edit/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";
import { computed } from "vue";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  numPreviousYears: number;
  allowNot?: boolean;
  isSummarad?: boolean;
  showBalanceSign?: boolean;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BaseBeloppradComparable>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(
    belopprad.value.taxonomyItemName,
    belopprad.value.labelType,
  );
});
</script>

<template>
  <BaseEditBeloppradContainer
    :belopprad="belopprad"
    :taxonomy-manager="taxonomyManager"
  >
    <td>
      <BaseEditBeloppradTitle
        :belopprad="belopprad"
        :taxonomy-manager="taxonomyManager"
      />
    </td>
    <td v-if="allowNot" class="not-container">
      <input
        v-if="taxonomyItem.properties.abstract !== 'true'"
        v-model.trim="belopprad.not"
        type="text"
      />
    </td>
    <td class="value-container">
      <template v-if="showBalanceSign">
        <span v-if="taxonomyItem.properties.balance === 'debit'">&minus;</span>
        <span v-if="taxonomyItem.properties.balance === 'credit'">+</span>
      </template>
      <input
        v-if="taxonomyItem.properties.abstract !== 'true'"
        v-model.trim="belopprad.beloppNuvarandeAr"
        :disabled="isSummarad"
        type="text"
      />
    </td>
    <td v-for="i in numPreviousYears" :key="i" class="value-container">
      <template v-if="showBalanceSign">
        <span v-if="taxonomyItem.properties.balance === 'debit'">&minus;</span>
        <span v-if="taxonomyItem.properties.balance === 'credit'">+</span>
      </template>
      <input
        v-if="taxonomyItem.properties.abstract !== 'true'"
        v-model.trim="belopprad.beloppTidigareAr[i - 1]"
        :disabled="isSummarad"
        type="text"
      />
    </td>
    <td>
      <BaseEditBeloppradDeleteButton :delete-callback="deleteCallback" />
    </td>
  </BaseEditBeloppradContainer>
</template>

<style lang="scss" scoped></style>
