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

  /** Huruvida borttag ska tillåtas. */
  allowDelete: boolean;

  /** Huruvida beloppraden ska vara mindre än en typisk belopprad. */
  small: boolean;

  /** Antal tidigare räkenskapsår som ska visas för jämförelse. */
  numPreviousYears: number;

  /** Huruvida notfält ska visas för beloppraden. */
  allowNot?: boolean;

  /** Reguljärt uttryck som definierar vilka värden som är tillåtna. */
  allowedValueRegex?: RegExp;
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

// Hjälpfunktioner
function onBeforeValueInput(event: InputEvent) {
  if (!props.allowedValueRegex) {
    return;
  }

  // För att bara tillåta vissa tecken i värdet
  if (event.inputType.startsWith("insert")) {
    const inputElement = event.target as HTMLInputElement;
    const newValue =
      inputElement.value.substring(0, inputElement.selectionStart || 0) +
      (event.data ?? "") +
      inputElement.value.substring(inputElement.selectionEnd || 0);
    if (!props.allowedValueRegex.test(newValue.trim())) {
      event.preventDefault();
    }
  }
}
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
        :class="{ 'form-control-sm': small }"
        class="form-control"
        maxlength="2"
        type="text"
      />
    </td>
    <td class="value-container">
      <div class="d-flex align-items-center">
        <slot :taxonomy-item="taxonomyItem" name="input-current-year">
          <template v-if="showBalanceSign">
            <span v-if="taxonomyItem.properties.balance === 'debit'"
              >&minus;</span
            >
            <span v-if="taxonomyItem.properties.balance === 'credit'">+</span>
          </template>
          <input
            v-if="taxonomyItem.properties.abstract !== 'true'"
            v-model.trim="belopprad.beloppNuvarandeAr"
            :class="{ 'form-control-sm': small }"
            :disabled="isSummarad"
            class="form-control"
            type="text"
            @beforeinput="(event) => onBeforeValueInput(event as InputEvent)"
          />
        </slot>
      </div>
    </td>
    <td v-for="i in numPreviousYears" :key="i" class="value-container">
      <div class="d-flex align-items-center">
        <slot
          :previous-year-index="i - 1"
          :taxonomy-item="taxonomyItem"
          name="input-previous-year"
        >
          <template v-if="showBalanceSign">
            <span v-if="taxonomyItem.properties.balance === 'debit'"
              >&minus;</span
            >
            <span v-if="taxonomyItem.properties.balance === 'credit'">+</span>
          </template>
          <input
            v-if="taxonomyItem.properties.abstract !== 'true'"
            v-model.trim="belopprad.beloppTidigareAr[i - 1]"
            :class="{ 'form-control-sm': small }"
            :disabled="isSummarad"
            class="form-control"
            type="text"
            @beforeinput="(event) => onBeforeValueInput(event as InputEvent)"
          />
        </slot>
      </div>
    </td>
    <td v-if="allowDelete">
      <BaseEditBeloppradDeleteButton @delete="emit('delete')" />
    </td>
  </BaseEditBeloppradContainer>
</template>

<style lang="scss" scoped>
@import "@/assets/extendables.scss";

input.form-control {
  @extend %text-input;

  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
