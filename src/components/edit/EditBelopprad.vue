<script lang="ts" setup>
import {
  type Belopprad,
  isBeloppradMonetary,
  isBeloppradString,
} from "@/model/arsredovisning/Arsredovisning.ts";
import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";

const props = defineProps<{
  showSaldo?: boolean;
}>();

const belopprad = defineModel<Belopprad<TaxonomyItemType>>("belopprad", {
  required: true,
});
</script>

<template>
  <tr
    :class="{
      abstract: belopprad.taxonomyItem.abstrakt === 'true',
      [`level-${belopprad.taxonomyItem.__Level}`]: true,
    }"
  >
    <td :class="{ tooltip: belopprad.taxonomyItem.dokumentation }">
      <span class="tooltip-target">{{ belopprad.taxonomyItem.radrubrik }}</span>

      <span v-if="belopprad.taxonomyItem.dokumentation" class="tooltip-text">
        {{ belopprad.taxonomyItem.dokumentation }}
      </span>
    </td>
    <td
      v-if="
        belopprad.taxonomyItem.abstrakt !== 'true' &&
        isBeloppradString(belopprad)
      "
      colspan="4"
    >
      <input v-model="belopprad.text" type="text" />
    </td>
    <template v-if="isBeloppradMonetary(belopprad)">
      <td>
        <input v-model="belopprad.egetNamn" type="text" />
      </td>
      <td>
        <input
          v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
          v-model="belopprad.not"
          type="text"
        />
      </td>
      <td>
        <template v-if="props.showSaldo">
          <span v-if="belopprad.taxonomyItem.saldo === 'debit'">-</span>
          <span v-if="belopprad.taxonomyItem.saldo === 'credit'">+</span>
        </template>
        <input
          v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
          v-model="belopprad.beloppNuvarandeAr"
          type="text"
        />
      </td>
      <td>
        <template v-if="props.showSaldo">
          <span v-if="belopprad.taxonomyItem.saldo === 'debit'">-</span>
          <span v-if="belopprad.taxonomyItem.saldo === 'credit'">+</span>
        </template>
        <input
          v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
          v-model="belopprad.beloppForegaendeAr"
          type="text"
        />
      </td>
    </template>
  </tr>
</template>

<style lang="scss" scoped>
.abstract.level-1 {
  font-weight: 600;
  font-size: 1.2rem;
}

.abstract.level-2 {
  font-weight: 600;
  text-decoration: underline;
}

.abstract.level-3 {
  font-weight: 500;
}

.abstract.level-4 {
  font-weight: 400;
  text-decoration: underline;
}

.tooltip .tooltip-target {
  border-bottom: 1px dotted black;
}

.tooltip .tooltip-text {
  display: none;
  max-width: 320px;
  background-color: black;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltip-text {
  display: block;
}
</style>
