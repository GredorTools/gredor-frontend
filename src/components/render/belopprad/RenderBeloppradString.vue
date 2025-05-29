<script lang="ts" setup>
import { type BeloppradString } from "@/model/arsredovisning/Arsredovisning.ts";

const props = defineProps<{
  belopprad: BeloppradString;
  contextRefPrefix: "period" | "balans";
}>();

const isAbstract = props.belopprad.taxonomyItem.abstrakt === "true";
</script>

<template>
  <tr
    :class="{
      abstract: isAbstract,
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
        {{ belopprad.text }}
      </ix:nonNumeric>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.header {
  font-weight: 600;
}
</style>
