<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/RenderBelopprad.vue";
import {
  getTaxonomyManager,
  TaxonomyRootName,
} from "@/util/TaxonomyManager.ts";
import RenderForvaltningsberattelseFlerarsoversikt from "@/components/render/forvaltningsberattelse/RenderForvaltningsberattelseFlerarsoversikt.vue";
import RenderForvaltningsberattelseForandringar from "@/components/render/forvaltningsberattelse/RenderForvaltningsberattelseForandringar.vue";
import { isBeloppradInTaxonomyItemList } from "@/model/arsredovisning/Belopprad.ts";
import { computed } from "vue";

const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

const props = defineProps<{
  arsredovisning: Arsredovisning;
}>();

const mappedGroups = computed(() => {
  return availableTaxonomyItems.children[0].children.map((group) => {
    return {
      group,
      items: [...props.arsredovisning.forvaltningsberattelse.entries()].filter(
        ([, b]) =>
          isBeloppradInTaxonomyItemList([group, ...group.childrenFlat], b),
      ),
    };
  });
});
</script>

<template>
  <div>
    <h2>Förvaltningsberättelse</h2>
    <div
      v-for="({ group, items }, groupIndex) in mappedGroups"
      :key="groupIndex"
      class="group-container"
    >
      <RenderForvaltningsberattelseFlerarsoversikt
        v-if="group.xmlName === 'se-gen-base:Flerarsoversikt'"
        :arsredovisning="arsredovisning"
        :group-taxonomy-item="
          availableTaxonomyItems.childrenFlat.find(
            (item) => item.xmlName === 'se-gen-base:Flerarsoversikt',
          )!
        "
        :taxonomy-manager="taxonomyManager"
      />
      <RenderForvaltningsberattelseForandringar
        v-else-if="group.xmlName === 'se-gen-base:ForandringEgetKapital'"
        :arsredovisning="arsredovisning"
        :taxonomy-manager="taxonomyManager"
      />
      <table v-else-if="items.length > 0">
        <tbody>
          <RenderBelopprad
            v-for="[index, belopprad] in items"
            :key="belopprad.taxonomyItemName"
            :belopprad="belopprad"
            :comparable-num-previous-years="0"
            :taxonomy-manager="taxonomyManager"
            string-show-header
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group-container {
  &:not(:last-of-type) {
    margin-bottom: 1rem;
  }
}

table {
  width: 100%;

  &:deep(th),
  &:deep(td) {
    border-style: hidden;
    text-align: left;
    padding: 0.25rem 0;

    &:first-child {
      width: 99%;
    }

    &:not(:first-child) {
      padding-left: 1rem;
      white-space: nowrap;
    }

    &.not-container {
      min-width: 40px;
    }

    &.value-container {
      text-align: right;
      min-width: 100px;
    }
  }
}
</style>
