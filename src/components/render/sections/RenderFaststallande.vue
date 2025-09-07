<script lang="ts" setup>
/**
 * En komponent för att rendera underskrifter i årsredovisningen.
 * Visar ort, datum och underskrifter från personer som undertecknar årsredovisningen.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

defineProps<{
  /** Årsredovisningen som innehåller underskriftsinformation. */
  arsredovisning: Arsredovisning;
}>();
</script>

<template>
  <div
    class="signatures-container"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <p>
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-gen-base:UndertecknandeArsredovisningOrt"
        >{{ arsredovisning.redovisningsinformation.faststallandeOrt }}
      </ix:nonNumeric>
      <template
        v-if="
          new Date(arsredovisning.verksamhetsarNuvarande.slutdatum) <
            new Date('2021-12-31') ||
          new Date(arsredovisning.verksamhetsarNuvarande.startdatum) >=
            new Date('2024-07-01')
        "
      >
        {{ " " }}
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:UndertecknandeArsredovisningDatum"
          >{{ arsredovisning.redovisningsinformation.faststallandeDatum }}
        </ix:nonNumeric>
      </template>
    </p>
    <ix:tuple
      v-for="(_, index) in arsredovisning.redovisningsinformation.underskrifter"
      :key="index"
      :tupleID="'UnderskriftArsredovisningForetradareTuple' + index"
      name="se-gaap-ext:UnderskriftArsredovisningForetradareTuple"
    />
    <div>
      <div
        v-for="(underskrift, index) in arsredovisning.redovisningsinformation
          .underskrifter"
        :key="index"
        class="name"
      >
        <span class="signature"
          >{{ underskrift.tilltalsnamn }} {{ underskrift.efternamn }}</span
        >
        <br />
        <ix:nonNumeric
          :tupleRef="'UnderskriftArsredovisningForetradareTuple' + index"
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingTilltalsnamn"
          order="1"
          >{{ underskrift.tilltalsnamn }}
        </ix:nonNumeric>
        {{ " " }}
        <ix:nonNumeric
          :tupleRef="'UnderskriftArsredovisningForetradareTuple' + index"
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingEfternamn"
          order="2"
          >{{ underskrift.efternamn }}
        </ix:nonNumeric>
        <br />
        <ix:nonNumeric
          v-if="underskrift.roll"
          :tupleRef="'UnderskriftArsredovisningForetradareTuple' + index"
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingRoll"
          order="3"
          >{{ underskrift.roll }}
        </ix:nonNumeric>
        <br />
        <ix:nonNumeric
          :tupleRef="'UnderskriftArsredovisningForetradareTuple' + index"
          contextRef="period_nuvarande"
          name="se-gen-base:UndertecknandeDatum"
          order="4"
          >{{ underskrift.datum }}
        </ix:nonNumeric>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.signatures-container {
  margin-top: 8rem;
}

.name {
  display: inline-block;
  width: 49%;
  vertical-align: top;
  margin-bottom: 1rem;

  .signature {
    font-weight: 600;
    font-style: italic;
  }
}
</style>
