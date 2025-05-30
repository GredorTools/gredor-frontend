<script lang="ts" setup>
import type { BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import { computed } from "vue";

const props = defineProps<{
  belopprad: BeloppradString;
  contextRefPrefix: "period" | "balans";
  showHeader: boolean;
  headerMapper?: (text: string) => string;
}>();

const computedHeader = computed(() => {
  let result =
    props.belopprad.egetNamn || props.belopprad.taxonomyItem.radrubrik;
  if (props.headerMapper) {
    result = props.headerMapper(result);
  }
  return result;
});
</script>

<template>
  <tr
    :class="{
      abstract: belopprad.taxonomyItem.abstrakt === 'true',
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td colspan="4">
      <div v-if="showHeader" class="header">
        {{ computedHeader }}
      </div>
      <ix:nonNumeric
        v-if="belopprad.text"
        :contextRef="contextRefPrefix + '_nuvarande'"
        :name="
          belopprad.taxonomyItem.tillhor +
          ':' +
          belopprad.taxonomyItem.elementnamn
        "
      >
        <p
          v-for="(line, index) in belopprad.text
            .split(/\r?\n/)
            .filter((line) => line.trim().length > 0)"
          :key="index"
        >
          {{ line }}
        </p>
      </ix:nonNumeric>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.header {
  font-weight: 600;
}

p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  &:last-of-type {
    margin-bottom: 1rem;
  }
}
</style>
