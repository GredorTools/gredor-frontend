<script lang="ts" setup>
import { computed, useAttrs } from "vue";
import type { BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import BaseEditBeloppradTitle from "@/components/edit/belopprad/BaseEditBeloppradTitle.vue";
import BaseEditBeloppradDeleteButton from "@/components/edit/belopprad/BaseEditBeloppradDeleteButton.vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const props = defineProps<{
  multiline: boolean;
  deleteCallback: () => void;
}>();

const belopprad = defineModel<BeloppradString>("belopprad", {
  required: true,
});

const isAbstract = computed(
  () => belopprad.value.taxonomyItem.abstrakt === "true",
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
        <BaseEditBeloppradTitle :belopprad="belopprad" />
      </td>
      <td>
        <button class="btn btn-danger" @click="deleteCallback">X</button>
      </td>
    </tr>
    <tr :class="trClasses">
      <td
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        :class="{ 'gredor-tooltip': belopprad.taxonomyItem.dokumentation }"
        colspan="6"
      >
        <textarea v-if="multiline" v-model="belopprad.text"></textarea>
      </td>
    </tr>
  </template>

  <tr v-else :class="trClasses">
    <td>
      <BaseEditBeloppradTitle :belopprad="belopprad" />
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
