<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

defineProps<{
  arsredovsining: Arsredovisning;
}>();
</script>

<template>
  <div
    class="signatures-container"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <p>
      <!-- TODO -->
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-gen-base:UndertecknandeArsredovisningOrt"
        >Sundsvall
      </ix:nonNumeric>
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-gen-base:UndertecknandeArsredovisningDatum"
        >{{ new Date().toISOString().split("T")[0] }}
      </ix:nonNumeric>
    </p>
    <ix:tuple
      name="se-gaap-ext:UnderskriftArsredovisningForetradareTuple"
      tupleID="UnderskriftArsredovisningForetradareTuple1"
    />
    <ix:tuple
      name="se-gaap-ext:UnderskriftArsredovisningForetradareTuple"
      tupleID="UnderskriftArsredovisningForetradareTuple2"
    />
    <!-- TODO -->
    <div>
      <div class="name">
        <i>Karl Karlsson</i>
        <br />
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingTilltalsnamn"
          order="1.0"
          tupleRef="UnderskriftArsredovisningForetradareTuple1"
          >Karl
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingEfternamn"
          order="2.0"
          tupleRef="UnderskriftArsredovisningForetradareTuple1"
          >Karlsson
        </ix:nonNumeric>
      </div>
      <div class="name">
        <i>Karin Olsson</i>
        <br />
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingTilltalsnamn"
          order="1.0"
          tupleRef="UnderskriftArsredovisningForetradareTuple2"
          >Karin
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingEfternamn"
          order="2.0"
          tupleRef="UnderskriftArsredovisningForetradareTuple2"
          >Olsson
        </ix:nonNumeric>
        <br />
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:UnderskriftHandlingRoll"
          order="3.0"
          tupleRef="UnderskriftArsredovisningForetradareTuple2"
          >Verkställande direktör
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
}
</style>
