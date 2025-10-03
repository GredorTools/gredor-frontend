<script lang="ts" setup>
import { computed } from "vue";
import { formatNumber } from "@/util/formatUtils.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

const props = defineProps<{
  /** XML-namn för beloppet, t.ex.:
   * se-bol-base:ArsstammaResultatDispositionAktieutdelning. */
  xbrlId: string;

  /** Text som ska visas före beloppet. */
  textBefore: string;

  /** Text som ska visas efter beloppet. */
  textAfter: string;

  /** Beloppet. */
  belopp?: string;

  /** XML-namn för samtliga delar i stämmans egna resultatdisposition, oavsett
   * om de har värden eller inte. De ska vara sorterade i den ordning som de
   * visas i. */
  allStammansDispositionPartXmlNames: string[];

  /** Belopp för samtliga delar i stämmans egna resultatdisposition, oavsett om
   * de har värden eller inte. De ska vara sorterade i den ordning som de visas
   * i. */
  allStammansDispositionPartBelopp: (string | undefined)[];
}>();

// Hjälpfunktioner för att bestämma om det ska stå "," eller "och" eller "."
// efter beloppet. Så att man får t.ex.: "Istället beslöt årsstämman om 5 000 i
// aktieutdelning, att sätta av 5 000 till reservfond och att 10 000 balanseras
// i ny räkning."
const beloppNextPart = computed(() => {
  const currentIndex = props.allStammansDispositionPartXmlNames.indexOf(
    props.xbrlId,
  );
  const remainingParts = props.allStammansDispositionPartBelopp
    .slice(currentIndex + 1)
    .filter((belopp) => belopp);
  return remainingParts.length === 1;
});

const beloppNextNextPart = computed(() => {
  const currentIndex = props.allStammansDispositionPartXmlNames.indexOf(
    props.xbrlId,
  );
  const remainingParts = props.allStammansDispositionPartBelopp
    .slice(currentIndex + 1)
    .filter((belopp) => belopp);
  return remainingParts.length >= 2;
});
</script>

<template>
  <template v-if="belopp">
    {{ textBefore }}
    <ix:nonFraction
      :name="xbrlId"
      contextRef="balans_nuvarande"
      decimals="INF"
      format="ixt:numspacecomma"
      scale="0"
      unitRef="redovisningsvaluta"
      xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
    >
      {{ formatNumber(belopp, null, BeloppFormat.HELTAL) }}
    </ix:nonFraction>
    {{ textAfter }}<template v-if="beloppNextNextPart">, </template>
    <template v-else-if="beloppNextPart"> och </template>
    <template v-else><!-- @delete-whitespace -->.</template>
  </template>
</template>

<style lang="scss" scoped></style>
