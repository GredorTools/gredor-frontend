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
    <tr :class="trClasses">
      <td :colspan="comparableNumPreviousYears + 2">
        <BaseEditBeloppradTitle
          :belopprad="belopprad"
          :taxonomy-manager="taxonomyManager"
        />
      </td>
      <td v-if="allowDelete">
        <button class="btn btn-danger" @click="emit('delete')">X</button>
      </td>
    </tr>
    <tr :class="trClasses">
      <td
        v-if="!isAbstract"
        :class="{
          'gredor-tooltip': !!taxonomyItem.properties.documentation,
        }"
        :colspan="comparableNumPreviousYears + 3"
      >
        <textarea
          v-if="multiline"
          v-model="belopprad.text"
          class="form-control"
        ></textarea>
      </td>
    </tr>
  </template>

  <tr v-else :class="trClasses">
    <td>
      <BaseEditBeloppradTitle
        :belopprad="belopprad"
        :taxonomy-manager="taxonomyManager"
      />
    </td>
    <td
      v-if="!isAbstract"
      :colspan="comparableNumPreviousYears + 1"
      class="value-container text-left"
    >
      <input
        v-model="belopprad.text"
        :class="{ 'form-control-sm': small }"
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
  </tr>
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
