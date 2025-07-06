<script lang="ts" setup>
/**
 * En baskomponent för att redigera belopprader där man kan jämföra värden mellan nuvarande och tidigare år.
 * Används som grund för t.ex. monetära och decimala belopprader.
 */

import BaseEditBeloppradContainer from "@/components/edit/blocks/belopprad/BaseEditBeloppradContainer.vue";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/blocks/belopprad/BaseEditBeloppradDeleteButton.vue";
import { computed } from "vue";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface EditBeloppradComparablePropsBase {
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Antal tidigare räkenskapsår som ska visas för jämförelse. */
  numPreviousYears: number;

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot?: boolean;
}

export interface EditBeloppradComparableEmitsBase {
  /** Triggas när användaren tar bort beloppraden. */
  (e: "delete"): void;
}

const props = defineProps<
  EditBeloppradComparablePropsBase & {
    /** Huruvida beloppraden är en summarad som inte kan redigeras direkt. */
    isSummarad?: boolean;

    /** Huruvida balanstecken (plus/minus) ska visas för beloppraden. */
    showBalanceSign?: boolean;
  }
>();

const emit = defineEmits<EditBeloppradComparableEmitsBase>();

/** Beloppraden som ska redigeras. */
const belopprad = defineModel<BaseBeloppradComparable>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
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
        class="form-control"
        maxlength="2"
        type="text"
      />
    </td>
    <td class="value-container">
      <div class="d-flex align-items-center">
        <template v-if="showBalanceSign">
          <span v-if="taxonomyItem.properties.balance === 'debit'"
            >&minus;</span
          >
          <span v-if="taxonomyItem.properties.balance === 'credit'">+</span>
        </template>
        <input
          v-if="taxonomyItem.properties.abstract !== 'true'"
          v-model.trim="belopprad.beloppNuvarandeAr"
          :disabled="isSummarad"
          class="form-control"
          type="text"
        />
      </div>
    </td>
    <td v-for="i in numPreviousYears" :key="i" class="value-container">
      <div class="d-flex align-items-center">
        <template v-if="showBalanceSign">
          <span v-if="taxonomyItem.properties.balance === 'debit'"
            >&minus;</span
          >
          <span v-if="taxonomyItem.properties.balance === 'credit'">+</span>
        </template>
        <input
          v-if="taxonomyItem.properties.abstract !== 'true'"
          v-model.trim="belopprad.beloppTidigareAr[i - 1]"
          :disabled="isSummarad"
          class="form-control"
          type="text"
        />
      </div>
    </td>
    <td>
      <BaseEditBeloppradDeleteButton @delete="emit('delete')" />
    </td>
  </BaseEditBeloppradContainer>
</template>

<style lang="scss" scoped>
input.form-control {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
