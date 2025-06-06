<script lang="ts" setup>
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";
import BaseEditBeloppradTitle from "@/components/edit/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { computed } from "vue";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradDecimal>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(belopprad.value.taxonomyItemName);
});
</script>

<template>
  <tr
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      [`level-${taxonomyItem.level}`]: true,
    }"
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
    <td></td>
    <td>
      <input
        v-if="taxonomyItem.properties.abstract !== 'true'"
        v-model.trim="belopprad.beloppNuvarandeAr"
        type="text"
      />
    </td>
    <td>
      <input
        v-if="taxonomyItem.properties.abstract !== 'true'"
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
