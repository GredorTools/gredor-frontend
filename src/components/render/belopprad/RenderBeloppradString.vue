<script lang="ts" setup>
import type { BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

const props = defineProps<{
  taxonomyManager: TaxonomyManager;
  belopprad: BeloppradString;
  contextRefPrefix: "period" | "balans";
  showHeader: boolean;
}>();

const taxonomyItem = computed(() => {
  return props.taxonomyManager.getItem(props.belopprad.taxonomyItemName);
});
</script>

<template>
  <tr
    v-if="showHeader || belopprad.text"
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      [`level-${taxonomyItem.level}`]: true,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td colspan="4">
      <div v-if="showHeader" class="header">
        {{ taxonomyItem.additionalData.displayLabel }}
      </div>
      <ix:nonNumeric
        v-if="belopprad.text"
        :contextRef="contextRefPrefix + '_nuvarande'"
        :name="taxonomyItem.xmlName"
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
.abstract.level-1,
.level-1 .header {
  font-weight: 600;
  font-size: 1.15rem;

  &:not(:first-of-type) td {
    padding-top: 1.25rem;
  }
}

.level-2:not(.abstract) {
  &:not(:last-of-type) td {
    padding-bottom: 1rem;
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
  margin-bottom: 0;

  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
}
</style>
