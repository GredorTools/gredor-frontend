<script lang="ts" setup>
/**
 * En komponent för att rendera belopprader som har strängar som datatyp.
 */

import type { BeloppradString } from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med strängvärdet som ska renderas. */
  belopprad: BeloppradString;

  /** Beloppradens kontexttyp. */
  contextRefPrefix: "period" | "balans";

  /** Huruvida rubriken ska visas. */
  showHeader: boolean;
}>();

const taxonomyItem = computed(() => {
  return getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad);
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
