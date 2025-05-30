<script lang="ts" setup>
import type { BeloppradDecimal } from "@/model/arsredovisning/beloppradtyper/BeloppradDecimal.ts";

const belopprad = defineModel<BeloppradDecimal>("belopprad", {
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
    <td>
      <input v-model="belopprad.egetNamn" type="text" />
    </td>
    <td></td>
    <td>
      <input
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        v-model="belopprad.beloppNuvarandeAr"
        type="text"
      />
    </td>
    <td>
      <input
        v-if="belopprad.taxonomyItem.abstrakt !== 'true'"
        v-model="belopprad.beloppForegaendeAr"
        type="text"
      />
    </td>
  </tr>
</template>

<style lang="scss" scoped></style>
