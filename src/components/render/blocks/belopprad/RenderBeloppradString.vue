<script lang="ts" setup>
/**
 * En komponent för att rendera belopprader som har strängar som datatyp.
 */

import {
  type BeloppradString,
  hasBeloppradStringValue,
} from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import { computed } from "vue";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med strängvärdet som ska renderas. */
  belopprad: BeloppradString;

  /** Eventuella ytterligare attribut för iXBRL-elementet. */
  additionalIxbrlAttrs: Record<string, string>;

  /** Möjliggör att få beloppraden att se ut som en belopprad av en viss nivå,
   * även om den egentligen inte är en belopprad av den nivån. */
  displayAsLevel?: number;

  /** Möjliggör att visa en egen rubrik för beloppraden. */
  displayHeader?: string;

  /** Beloppradens kontexttyp. */
  contextRefPrefix: "period" | "balans";

  /** Huruvida rubriken ska visas. */
  showHeader: boolean;

  /** Huruvida rubriken ska visas som en abstrakt radrubrik (om den visas). */
  showHeaderAsAbstract: boolean;

  /** Huruvida beloppraden ska renderas som "rå" text, utan p-taggar. */
  raw: boolean;
}>();

const taxonomyItem = computed(() =>
  getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad),
);

const displayLevel = computed(
  () => props.displayAsLevel ?? taxonomyItem.value.level,
);

const isEmptyValue = computed(() => !props.belopprad?.text?.trim());
</script>

<template>
  <tr
    v-if="
      (showHeader && taxonomyItem.properties.abstract === 'true') ||
      (taxonomyItem.children.length > 0 && showHeader) ||
      hasBeloppradStringValue(belopprad)
    "
    :class="{
      abstract: taxonomyItem.properties.abstract === 'true',
      'abstract-header': showHeader && showHeaderAsAbstract,
      [`level-${displayLevel}`]: true,
      'empty-value': isEmptyValue,
    }"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <td colspan="4">
      <div v-if="showHeader" class="header">
        {{ displayHeader || taxonomyItem.additionalData.displayLabel }}
      </div>
      <ix:nonNumeric
        v-if="belopprad.text"
        :contextRef="contextRefPrefix + '_nuvarande'"
        :name="taxonomyItem.xmlName"
        v-bind="additionalIxbrlAttrs"
      >
        <span v-if="raw">
          {{ belopprad.text }}
        </span>
        <p
          v-for="(line, index) in belopprad.text
            .split(/\r?\n/)
            .filter((l) => l.trim().length > 0)"
          v-else
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
.abstract-header.level-1 .header,
.level-1 .header {
  font-weight: 600;
  font-size: 1.15rem;

  &:not(:first-of-type) td {
    padding-top: 1.5rem;
  }
}

.level-2:not(.abstract) {
  &:not(:last-of-type):not(.empty-value) td {
    padding-bottom: 1.25rem;
  }
}

.level-2 {
  &.abstract,
  &.abstract-header .header {
    font-weight: 600;
    text-decoration: underline;
  }

  &.abstract,
  &.abstract-header {
    &:not(:first-of-type) td {
      padding-top: 1.25rem;
    }
  }
}

.abstract.level-3,
.abstract-header.level-3 .header {
  font-weight: 500;
}

tr:not(.abstract) {
  .header {
    font-weight: 600;
  }

  &:not(.empty-value) .header {
    margin-bottom: 0.5rem;
  }
}

p {
  margin-bottom: 0;

  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
}
</style>
