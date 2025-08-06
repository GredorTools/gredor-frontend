<script lang="ts" setup>
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import {
  type BeloppradTuple,
  generateTupleID,
} from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
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
    id: generateTupleID(),
    belopprader: tupleTaxonomyItem.value.childrenFlat
      .filter((child) => child.properties.type !== "nonnum:domainItemType") // Hanteras av enum-rader själva
      .map((child) => createBelopprad(child)),
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
  <tr v-for="(instans, instansIndex) in belopprad.instanser" :key="instans.id">
    <td colspan="3">
      <div
        :class="{ last: instansIndex === belopprad.instanser.length - 1 }"
        class="edit-tuple-instance-container"
      >
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
              small
            />
          </tbody>
        </table>
        <BaseEditBeloppradDeleteButton
          class="edit-tuple-instance-delete"
          @delete="deleteInstance(instansIndex)"
        />
      </div>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.edit-tuple-instance-container {
  display: flex;
  margin-left: $spacing-xl;
  margin-bottom: $spacing-sm;

  &.last {
    margin-bottom: $spacing-lg;
  }

  table.edit-tuple-instance {
    margin: 0;

    :deep(td.value-container input) {
      min-width: 200px !important;
    }
  }

  .edit-tuple-instance-delete {
    margin: $spacing-xs 0;
  }
}
</style>
