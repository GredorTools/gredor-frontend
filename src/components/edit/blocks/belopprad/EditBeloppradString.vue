<script lang="ts" setup>
/**
 * En komponent för att redigera belopprader som har strängar som datatyp.
 */

import { computed, useAttrs } from "vue";
import type { BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import BaseEditBeloppradTitle from "@/components/edit/blocks/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/blocks/belopprad/BaseEditBeloppradDeleteButton.vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import BaseEditBeloppradContainer from "@/components/edit/blocks/belopprad/BaseEditBeloppradContainer.vue";
import { getTestIdForBelopprad } from "@/util/inputUtils.ts";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Huruvida borttag ska tillåtas. */
  allowDelete: boolean;

  /** Huruvida beloppraden ska vara mindre än en typisk belopprad. */
  small: boolean;

  /** Antal kolumner som beloppradens värde ska vara. */
  valueColspanOverride?: number;

  /** Möjliggör att få beloppraden att se ut som en belopprad av en viss nivå,
   * även om den egentligen inte är en belopprad av den nivån. */
  displayAsLevel?: number;

  /** Huruvida radbrytningar ska vara tillåtna. */
  multiline: boolean;

  /** Hur många tidigare räkenskapsår som visas i andra belopprader i samma tabell. */
  comparableNumPreviousYears: number;
}>();

const emit = defineEmits<{
  /** Triggas när användaren tar bort beloppraden. */
  (e: "delete"): void;
}>();

/** Beloppraden med strängvärdet som ska redigeras. */
const belopprad = defineModel<BeloppradString>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value);
});

const isAbstract = computed(
  () => taxonomyItem.value.properties.abstract === "true",
);

const trClasses = computed(() => [
  attrs.class,
  {
    "full-width": props.multiline,
  },
]);
</script>

<template>
  <template v-if="multiline && !isAbstract">
    <BaseEditBeloppradContainer
      :belopprad="belopprad"
      :class="trClasses"
      :taxonomy-manager="taxonomyManager"
      disable-hover-effect
    >
      <td :colspan="comparableNumPreviousYears + 2">
        <BaseEditBeloppradTitle
          :belopprad="belopprad"
          :display-as-level="displayAsLevel"
          :taxonomy-manager="taxonomyManager"
        />
      </td>
      <td v-if="allowDelete">
        <button class="btn btn-danger" @click="emit('delete')">X</button>
      </td>
    </BaseEditBeloppradContainer>
    <BaseEditBeloppradContainer
      :belopprad="belopprad"
      :class="trClasses"
      :taxonomy-manager="taxonomyManager"
      disable-hover-effect
    >
      <td
        :class="{
          'gredor-tooltip': !!taxonomyItem.properties.documentation,
        }"
        :colspan="comparableNumPreviousYears + 3"
      >
        <textarea
          v-model="belopprad.text"
          :data-testid="getTestIdForBelopprad(belopprad)"
          class="form-control"
        ></textarea>
      </td>
    </BaseEditBeloppradContainer>
  </template>

  <BaseEditBeloppradContainer
    v-else
    :belopprad="belopprad"
    :class="trClasses"
    :taxonomy-manager="taxonomyManager"
  >
    <td>
      <BaseEditBeloppradTitle
        :belopprad="belopprad"
        :display-as-level="displayAsLevel"
        :taxonomy-manager="taxonomyManager"
      />
    </td>
    <td
      v-if="!isAbstract"
      :colspan="valueColspanOverride ?? comparableNumPreviousYears + 1"
      class="value-container text-left"
    >
      <input
        v-model="belopprad.text"
        :class="{ 'form-control-sm': small }"
        :data-testid="`edit-${belopprad.taxonomyItemName}`"
        class="form-control"
        type="text"
      />
    </td>
    <td v-if="allowDelete">
      <BaseEditBeloppradDeleteButton
        v-if="!isAbstract"
        @delete="emit('delete')"
      />
    </td>
  </BaseEditBeloppradContainer>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.full-width td {
  & > * {
    width: 100%;
  }

  textarea {
    margin-bottom: $spacing-md;
  }
}

textarea {
  min-height: 6rem;
  resize: vertical;
}
</style>
