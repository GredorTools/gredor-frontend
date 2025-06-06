<script lang="ts" setup>
import {
  type BeloppradMonetary,
  calculateValuesIntoBelopprad,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import BaseEditBeloppradContainer from "@/components/edit/belopprad/BaseEditBeloppradContainer.vue";
import BaseEditBeloppradTitle from "@/components/edit/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";
import { computed } from "vue";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getCalculationProcessor } from "@/util/CalculationProcessor.ts";

const calculationProcessor = await getCalculationProcessor();

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  showSaldo?: boolean;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradMonetary>("belopprad", {
  required: true,
});
const belopprader = defineModel<Belopprad[]>("belopprader", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(belopprad.value.taxonomyItemName);
});

const isSummarad = computed(() => {
  const result = taxonomyItem.value.additionalData.isTotalItem;

  if (result) {
    calculateValuesIntoBelopprad(
      calculationProcessor,
      belopprader.value,
      belopprad.value,
    );
  }

  return result;
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
    <td>
      <input v-model="belopprad.egetNamn" type="text" />
    </td>
    <td>
      <input
        v-if="taxonomyItem.properties.abstract !== 'true'"
        v-model.trim="belopprad.not"
        type="text"
      />
    </td>
    <td>
      <template v-if="showSaldo">
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
    <td>
      <template v-if="showSaldo">
        <span v-if="taxonomyItem.properties.balance === 'debit'">&minus;</span>
        <span v-if="taxonomyItem.properties.balance === 'credit'">+</span>
      </template>
      <input
        v-if="taxonomyItem.properties.abstract !== 'true'"
        v-model.trim="belopprad.beloppForegaendeAr"
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
