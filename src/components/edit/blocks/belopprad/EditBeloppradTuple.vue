<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { type BeloppradTuple } from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import { computed } from "vue";
import EditBelopprad from "@/components/edit/blocks/EditBelopprad.vue";
import {
  createBelopprad,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import BaseEditBeloppradDeleteButton from "@/components/edit/blocks/belopprad/BaseEditBeloppradDeleteButton.vue";

const props = defineProps<{
  /** TaxonomyManager för att hantera taxonomiobjekt för beloppraden. */
  taxonomyManager: TaxonomyManager;
}>();

/** Beloppraden med tuple-värdet som ska redigeras. */
const belopprad = defineModel<BeloppradTuple>("belopprad", {
  required: true,
});

const tupleTaxonomyItem = computed(() =>
  getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value),
);

// Hjälpfunktioner
function createInstance() {
  belopprad.value.instanser.push({
    uuid: self.crypto.randomUUID(),
    belopprader: tupleTaxonomyItem.value.childrenFlat.map((child) =>
      createBelopprad(child),
    ),
  });
}

function deleteInstance(index: number) {
  belopprad.value.instanser.splice(index, 1);
}
</script>

<template>
  <tr>
    <td>
      {{ tupleTaxonomyItem?.additionalData.displayLabel }}
    </td>
    <td colspan="3">
      <button class="btn btn-sm btn-primary" @click="createInstance()">
        Lägg till
      </button>
    </td>
  </tr>
  <tr
    v-for="(instans, instansIndex) in belopprad.instanser"
    :key="instans.uuid"
  >
    <td colspan="3">
      <table class="edit-tuple-instance">
        <tbody>
          <EditBelopprad
            v-for="(
              instansBelopprad, instansBeloppradIndex
            ) in instans.belopprader"
            :key="instansBelopprad.taxonomyItemName"
            v-model:belopprad="instans.belopprader[instansBeloppradIndex]"
            v-model:belopprader="instans.belopprader"
            :comparable-num-previous-years="0"
            :taxonomy-manager="taxonomyManager"
          />
        </tbody>
      </table>
    </td>
    <td>
      <BaseEditBeloppradDeleteButton @delete="deleteInstance(instansIndex)" />
    </td>
  </tr>
</template>

<style lang="scss" scoped>
table.edit-tuple-instance {
  margin-top: 0 !important;
  margin-left: 2rem;

  :deep(td.value-container input) {
    min-width: 200px !important;
  }
}
</style>
