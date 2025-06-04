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
  const originalHeader =
    props.belopprad.taxonomyItem.abstrakt === "true"
      ? props.belopprad.taxonomyItem.radrubrik
      : props.belopprad.taxonomyItem.standardrubrik;
  let result = props.belopprad.egetNamn || originalHeader;
  if (props.headerMapper) {
    result = props.headerMapper(result);
  }
  return result;
});
</script>

<template>
  <tr
    v-if="showHeader || belopprad.text"
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
            .filter((l) => l.trim().length > 0)"
          :key="index"
        >
          {{ line }}
        </p>
      </ix:nonNumeric>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.abstract.level-1 {
  font-weight: 600;
  font-size: 1.15rem;

  &:not(:first-of-type) td {
    padding-top: 2.25rem;
  }
}

.abstract.level-2 {
  font-weight: 600;
  text-decoration: underline;

  &:not(:first-of-type) td {
    padding-top: 1.25rem;
  }
}

.abstract.level-3 {
  font-weight: 500;

  &:not(:first-of-type) td {
    padding-top: 0.75rem;
  }
}

tr:not(.abstract) .header {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 0.5rem;

  &:last-of-type {
    margin-bottom: 1rem;
  }
}
</style>
