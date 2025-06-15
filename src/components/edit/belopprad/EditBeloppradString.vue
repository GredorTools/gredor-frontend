<script lang="ts" setup>
import { computed, useAttrs } from "vue";
import type { BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import BaseEditBeloppradTitle from "@/components/edit/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  multiline: boolean;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradString>("belopprad", {
  required: true,
});

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(
    belopprad.value.taxonomyItemName,
    belopprad.value.labelType,
  );
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
      <td colspan="5">
        <BaseEditBeloppradTitle
          :belopprad="belopprad"
          :taxonomy-manager="taxonomyManager"
        />
      </td>
      <td>
        <button class="btn btn-danger" @click="deleteCallback">X</button>
      </td>
    </tr>
    <tr :class="trClasses">
      <td
        v-if="!isAbstract"
        :class="{
          'gredor-tooltip': !!taxonomyItem.properties.documentation,
        }"
        colspan="6"
      >
        <textarea v-if="multiline" v-model="belopprad.text"></textarea>
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
    <td v-if="!isAbstract" colspan="4">
      <input v-model="belopprad.text" type="text" />
    </td>
    <td>
      <BaseEditBeloppradDeleteButton
        v-if="!isAbstract"
        :delete-callback="deleteCallback"
      />
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.full-width td > * {
  width: 100%;
}

textarea {
  min-height: 6rem;
  resize: vertical;
}
</style>
