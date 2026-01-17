<script lang="ts" setup>
/**
 * En komponent för att rendera försättsbladet i årsredovisningen.
 * Visar företagsinformation, räkenskapsår och fastställelseintyg.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";
import RenderFaststallelseintyg from "@/components/render/blocks/RenderFaststallelseintyg.vue";

const props = defineProps<{
  /** Årsredovisningen som innehåller information för försättsbladet. */
  arsredovisning: Arsredovisning;

  /** Huruvida fastställelseintyget ska visas. **/
  showFaststallelseintyg: boolean;
}>();

const rakenskapsarText = computed(() => {
  const startdatumAr = props.arsredovisning.verksamhetsarNuvarande.startdatum
    .trim()
    .split("-")[0];
  const slutdatumAr = props.arsredovisning.verksamhetsarNuvarande.slutdatum
    .trim()
    .split("-")[0];
  if (startdatumAr === slutdatumAr) {
    return startdatumAr;
  } else {
    return `${startdatumAr}–${slutdatumAr}`;
  }
});
</script>

<template>
  <div class="cover" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL">
    <img
      v-if="arsredovisning.foretagsinformation.logotyp.base64"
      :class="{
        left:
          arsredovisning.foretagsinformation.logotyp.placering === 'vänster',
        right: arsredovisning.foretagsinformation.logotyp.placering === 'höger',
        top: arsredovisning.foretagsinformation.logotyp.placering === 'topp',
      }"
      :src="arsredovisning.foretagsinformation.logotyp.base64"
      alt=""
      class="logo"
    />

    <div>
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-cd-base:ForetagetsNamn"
        >{{ arsredovisning.foretagsinformation.foretagsnamn }}
      </ix:nonNumeric>
      <br />
      <abbr>Org.nr</abbr>{{ " " }}
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-cd-base:Organisationsnummer"
        >{{ arsredovisning.foretagsinformation.organisationsnummer }}
      </ix:nonNumeric>
    </div>

    <h1>Årsredovisning för räkenskapsåret {{ rakenskapsarText }}</h1>

    <p>
      {{ arsredovisning.redovisningsinformation.avgivande.namn }} avger härmed
      följande årsredovisning<br />för räkenskapsåret
      {{ arsredovisning.verksamhetsarNuvarande.startdatum }} –
      {{ arsredovisning.verksamhetsarNuvarande.slutdatum }}.
    </p>

    <p class="currency-info">
      Om inte annat särskilt anges, redovisas alla belopp i hela
      {{ arsredovisning.redovisningsinformation.redovisningsvaluta.namn }}.
    </p>

    <RenderFaststallelseintyg
      v-if="showFaststallelseintyg"
      :arsredovisning="arsredovisning"
      class="faststallelseintyg"
    />
  </div>
</template>

<style lang="scss" scoped>
.cover {
  padding-top: 1rem;
}

.logo {
  height: 2.48rem; // Passar bra med texten intill

  &.left {
    float: left;
    margin-right: 1rem;
  }

  &.right {
    float: right;
  }

  &.top {
    margin-bottom: 0.5rem;
  }
}

h1 {
  clear: both;
  margin-top: 4rem;
}

.currency-info {
  margin-top: 2rem;
}

.faststallelseintyg {
  margin-top: 20rem;
}
</style>
