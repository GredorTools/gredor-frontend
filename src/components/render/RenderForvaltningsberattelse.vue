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

const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

defineProps<{
  arsredovisning: Arsredovisning;
}>();
</script>

<template>
  <div>
    <h2>Förvaltningsberättelse</h2>
    <template
      v-for="(group, groupIndex) in availableTaxonomyItems.children[0].children"
      :key="groupIndex"
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
      <table v-else>
        <tbody>
          <RenderBelopprad
            v-for="[index, belopprad] in [
              ...arsredovisning.forvaltningsberattelse.entries(),
            ].filter(([, b]) =>
              isBeloppradInTaxonomyItemList([group, ...group.childrenFlat], b),
            )"
            :key="belopprad.taxonomyItemName"
            :belopprad="belopprad"
            :comparable-num-previous-years="0"
            :taxonomy-manager="taxonomyManager"
            string-show-header
          />
        </tbody>
      </table>
    </template>
  </div>
</template>

<style lang="scss" scoped>
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
