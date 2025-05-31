<script lang="ts" setup>
import { computed, useAttrs } from "vue";
import type { BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";

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
      <td
        :class="{ tooltip: belopprad.taxonomyItem.dokumentation }"
        colspan="5"
      >
        <span class="tooltip-target">{{
          belopprad.taxonomyItem.radrubrik
        }}</span>

        <span v-if="belopprad.taxonomyItem.dokumentation" class="tooltip-text">
          {{ belopprad.taxonomyItem.dokumentation }}
        </span>
      </td>
      <td>
        <button @click="deleteCallback">X</button>
      </td>
    </tr>
    <tr :class="trClasses">
      <td
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        :class="{ tooltip: belopprad.taxonomyItem.dokumentation }"
        colspan="6"
      >
        <textarea v-if="multiline" v-model="belopprad.text"></textarea>
      </td>
    </tr>
  </template>

  <tr v-else :class="trClasses">
    <td :class="{ tooltip: belopprad.taxonomyItem.dokumentation }">
      <span class="tooltip-target">{{ belopprad.taxonomyItem.radrubrik }}</span>

      <span v-if="belopprad.taxonomyItem.dokumentation" class="tooltip-text">
        {{ belopprad.taxonomyItem.dokumentation }}
      </span>
    </td>
    <td v-if="!isAbstract" colspan="4">
      <input v-model="belopprad.text" type="text" />
    </td>
    <td>
      <button v-if="!isAbstract" @click="deleteCallback">X</button>
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
