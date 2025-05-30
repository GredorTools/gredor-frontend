<script lang="ts" setup>
import { type BeloppradString } from "@/model/arsredovisning/Arsredovisning.ts";

const props = defineProps<{
  belopprad: BeloppradString;
  contextRefPrefix: "period" | "balans";
}>();
</script>

<template>
  <tr
    :class="{
      abstract: props.belopprad.taxonomyItem.abstrakt === 'true',
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td colspan="4">
      <div class="header">
        {{ belopprad.egetNamn || belopprad.taxonomyItem.radrubrik }}
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
          v-for="(line, index) in props.belopprad.text
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
