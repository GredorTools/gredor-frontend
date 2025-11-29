<script lang="ts" setup>
/**
 * Redigeringskomponent för belopprader av typen tuple.
 * Låter användaren lägga till/ta bort instanser och växla visningsformat
 * (endast detta år eller jämförelse mellan år).
 */
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import {
  type BeloppradTuple,
  BeloppradTupleFormat,
  generateTupleID,
  getBeloppradTupleFormat,
  isEditBeloppradTupleFormatAllowed,
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

  /** Antal tidigare räkenskapsår som ska visas för jämförelse, för tuples vars
   * värden kan jämföras mellan år. */
  comparableNumPreviousYears: number;
}>();

/** Beloppraden med tuple-värdet som ska redigeras. */
const belopprad = defineModel<BeloppradTuple>("belopprad", {
  required: true,
});

const tupleTaxonomyItem = computed(() =>
  getTaxonomyItemForBelopprad(props.taxonomyManager, belopprad.value),
);

const beloppradTupleFormat = computed(() =>
  getBeloppradTupleFormat(belopprad.value),
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
    <td :colspan="1 + comparableNumPreviousYears">
      {{ tupleTaxonomyItem?.additionalData.displayLabel }}

      <span
        v-if="
          belopprad.instanser.length > 0 &&
          isEditBeloppradTupleFormatAllowed(belopprad)
        "
        class="format-selector"
      >
        Format:
        <select v-model="belopprad.format" class="form-select form-select-sm">
          <option :value="BeloppradTupleFormat.SIMPLE">Endast detta år</option>
          <option :value="BeloppradTupleFormat.COMPARISON">
            Jämförelse mellan år
          </option>
        </select>
      </span>
    </td>

    <td>
      <button
        class="btn btn-sm btn-primary float-end"
        @click="createInstance()"
      >
        Lägg till
      </button>
    </td>
  </tr>

  <tr v-for="(instans, instansIndex) in belopprad.instanser" :key="instans.id">
    <td :colspan="2 + comparableNumPreviousYears">
      <div
        :class="{
          first: instansIndex === 0,
          last: instansIndex === belopprad.instanser.length - 1,
        }"
        class="edit-tuple-instance-container"
      >
        <div class="edit-tuple-instance-table-container">
          <table
            :class="{
              'simple-tuple':
                beloppradTupleFormat === BeloppradTupleFormat.SIMPLE,
              'comparison-tuple':
                beloppradTupleFormat === BeloppradTupleFormat.COMPARISON,
            }"
            class="edit-tuple-instance"
          >
            <tbody>
              <EditBelopprad
                v-for="(
                  instansBelopprad, instansBeloppradIndex
                ) in instans.belopprader"
                :key="instansBelopprad.taxonomyItemName"
                v-model:belopprad="instans.belopprader[instansBeloppradIndex]"
                v-model:belopprader="instans.belopprader"
                :comparable-num-previous-years="
                  beloppradTupleFormat === BeloppradTupleFormat.COMPARISON &&
                  instansBeloppradIndex === instans.belopprader.length - 1
                    ? comparableNumPreviousYears
                    : 0
                "
                :taxonomy-manager="taxonomyManager"
                :value-colspan-override="
                  beloppradTupleFormat === BeloppradTupleFormat.COMPARISON &&
                  instansBeloppradIndex !== instans.belopprader.length - 1
                    ? comparableNumPreviousYears + 1
                    : undefined
                "
                small
              />
            </tbody>
          </table>
          <BaseEditBeloppradDeleteButton
            v-if="beloppradTupleFormat === BeloppradTupleFormat.SIMPLE"
            class="edit-tuple-instance-delete"
            @delete="deleteInstance(instansIndex)"
          />
        </div>

        <template
          v-if="beloppradTupleFormat === BeloppradTupleFormat.COMPARISON"
        >
          <BaseEditBeloppradDeleteButton
            class="edit-tuple-instance-delete float-end"
            @delete="deleteInstance(instansIndex)"
          />
          <div class="clearfix"></div>
        </template>
        <hr />
      </div>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.format-selector {
  margin-left: $spacing-xl;
  border-left: 1px solid $border-color-dark;
  padding-left: $spacing-xl;

  select {
    margin-left: $spacing-sm;
    display: inline-block;
    width: fit-content !important;
  }
}

.edit-tuple-instance-container {
  &.first
    .edit-tuple-instance-table-container
    table.edit-tuple-instance.comparison-tuple {
    margin-top: $spacing-md;
  }

  &:not(&.last) {
    hr {
      width: 50%;
      float: right;
    }
  }

  &.last {
    margin-bottom: $spacing-xl;
  }

  .edit-tuple-instance-table-container {
    display: flex;
    margin-left: $spacing-xl;
    margin-bottom: $spacing-sm;

    table.edit-tuple-instance {
      margin: 0;

      &.simple-tuple :deep(td.value-container input) {
        min-width: 200px !important;
      }

      &.comparison-tuple :deep(td.value-container) {
        padding-right: 0 !important;
      }
    }

    .edit-tuple-instance-delete {
      margin: $spacing-xs 0;
    }
  }
}
</style>
