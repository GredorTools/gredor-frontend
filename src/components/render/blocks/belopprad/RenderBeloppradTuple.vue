<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { computed } from "vue";
import { getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import RenderBelopprad from "@/components/render/blocks/RenderBelopprad.vue";
import type { BeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;

  /** Beloppraden med tuple-värdet som ska renderas. */
  belopprad: BeloppradTuple;
}>();

const tupleTaxonomyItem = computed(() =>
  getTaxonomyItemForBelopprad(props.taxonomyManager, props.belopprad),
);
</script>

<template>
  <tr>
    <td>
      {{ tupleTaxonomyItem?.additionalData.displayLabel }}
    </td>
  </tr>
  <tr v-for="instans in belopprad.instanser" :key="instans.uuid">
    <td colspan="3">
      <table class="edit-tuple-instance">
        <tbody>
          <RenderBelopprad
            v-for="instansBelopprad in instans.belopprader"
            :key="instansBelopprad.taxonomyItemName"
            :belopprad="instansBelopprad"
            :comparable-num-previous-years="0"
            :taxonomy-manager="taxonomyManager"
          />
        </tbody>
      </table>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
table.render-tuple-instance {
  margin-top: 0 !important;
  margin-left: 2rem;

  :deep(td.value-container input) {
    min-width: 200px !important;
  }
}
</style>
