<script lang="ts" setup>
/**
 * En komponent för att rendera förvaltningsberättelsen i årsredovisningen.
 * Visar olika delar av förvaltningsberättelsen som flerårsöversikt, förändringar i eget kapital och resultatdisposition.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderBelopprad from "@/components/render/blocks/RenderBelopprad.vue";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import RenderForvaltningsberattelseFlerarsoversikt from "@/components/render/sections/forvaltningsberattelse/RenderForvaltningsberattelseFlerarsoversikt.vue";
import RenderForvaltningsberattelseForandringar from "@/components/render/sections/forvaltningsberattelse/RenderForvaltningsberattelseForandringar.vue";
import {
  type Belopprad,
  isBeloppradInTaxonomyItemList,
} from "@/model/arsredovisning/Belopprad.ts";
import { computed } from "vue";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";
import { RenderBeloppradDisplayAsType } from "@/components/render/blocks/belopprad/RenderBeloppradDisplayAsType.ts";

const taxonomyManager = await getTaxonomyManager(
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
);
const availableTaxonomyItems = taxonomyManager.getRoot();

const props = defineProps<{
  /** Årsredovisningen som innehåller förvaltningsberättelsen. */
  arsredovisning: Arsredovisning;
}>();

const mappedGroups = computed(() => {
  return availableTaxonomyItems.children[0].children.map((group) => {
    let items = [
      ...props.arsredovisning.forvaltningsberattelse.entries(),
    ].filter(([, b]) =>
      isBeloppradInTaxonomyItemList([group, ...group.childrenFlat], b),
    );

    if (shouldDisplaySimpleUtdelning.value) {
      items = items.filter(
        (item) =>
          ![
            "se-gen-base:ForslagDispositionUtdelningSpecificationAbstract",
            "se-gen-base:ForslagDispositionUtdelningAterbetalningVillkoratAktieagartillskott",
            "se-gen-base:ForslagDispositionUtdelningAnnanUtdelning",
          ].includes(item[1].taxonomyItemName),
      );
    }

    return {
      group,
      items,
    };
  });
});

// Om fältet "Återbetalning av villkorat aktieägartillskott" inte har något
// värde, visas inte rubriken "Förslag till utdelning" och utdelningen visas
// då inte heller som en summa av andra fält.
const shouldDisplaySimpleUtdelning = computed(() => {
  return !props.arsredovisning.forvaltningsberattelse.some(
    (item) =>
      item.taxonomyItemName ===
      "se-gen-base:ForslagDispositionUtdelningAterbetalningVillkoratAktieagartillskott",
  );
});

function getDisplayAsType(belopprad: Belopprad) {
  if (
    shouldDisplaySimpleUtdelning.value &&
    [
      "se-gen-base:ForslagDispositionUtdelning",
      "se-gen-base:FrittEgetKapitalEfterUtdelningBeslutadExtraBolagsstamma",
      "se-gen-base:ForslagDisposition",
    ].includes(belopprad.taxonomyItemName)
  ) {
    return RenderBeloppradDisplayAsType.SIMPLE;
  }

  return RenderBeloppradDisplayAsType.AUTO;
}

function getDisplayHeader(belopprad: Belopprad) {
  if (
    shouldDisplaySimpleUtdelning.value &&
    belopprad.taxonomyItemName === "se-gen-base:ForslagDispositionUtdelning"
  ) {
    return "Utdelning till ägarna";
  }

  return undefined;
}

function getStringShowHeaderAsAbstract(belopprad: Belopprad) {
  return (
    belopprad.taxonomyItemName ===
    "se-gen-base:StyrelsensYttrandeVinstutdelning"
  );
}
</script>

<template>
  <div v-if="arsredovisning.forvaltningsberattelse.length > 0">
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
            v-for="[, belopprad] in items"
            :key="belopprad.taxonomyItemName"
            :belopprad="belopprad"
            :comparable-display-as-type="getDisplayAsType(belopprad)"
            :comparable-num-previous-years="0"
            :display-header="getDisplayHeader(belopprad)"
            :redovisningsvaluta="
              arsredovisning.redovisningsinformation.redovisningsvaluta
            "
            :string-show-header-as-abstract="
              getStringShowHeaderAsAbstract(belopprad)
            "
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
    margin-bottom: 2rem;
  }
}

table {
  &:deep(.level-1 + .abstract.level-2) {
    td {
      padding-top: 0; /* Fixar resultatdisposition */
    }
  }
}
</style>
