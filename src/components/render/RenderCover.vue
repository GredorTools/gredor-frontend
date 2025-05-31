<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";

const props = defineProps<{
  arsredovsining: Arsredovisning;
}>();

const rakenskapsarText = computed(() => {
  const startdatumAr = props.arsredovsining.verksamhetsarNuvarande.startdatum
    .trim()
    .split("-")[0];
  const slutdatumAr = props.arsredovsining.verksamhetsarNuvarande.slutdatum
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
    <div>
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-cd-base:ForetagetsNamn"
        >{{ arsredovsining.foretagsinformation.foretagsnamn }}
      </ix:nonNumeric>
      <br />
      <abbr>Org.nr</abbr>{{ " " }}
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-cd-base:Organisationsnummer"
        >{{ arsredovsining.foretagsinformation.organisationsnummer }}
      </ix:nonNumeric>
    </div>
    <h1>Årsredovisning för räkenskapsåret {{ rakenskapsarText }}</h1>
    <p>
      <ix:nonNumeric
        contextRef="period_nuvarande"
        name="se-gen-base:LopandeBokforingenAvslutasMening"
      >
        {{ arsredovsining.redovisningsinformation.forfattare }} avger härmed
        följande årsredovisning<br />för räkenskapsåret
        {{ arsredovsining.verksamhetsarNuvarande.startdatum }} –
        {{ arsredovsining.verksamhetsarNuvarande.slutdatum }}.
      </ix:nonNumeric>
    </p>
    <p class="currency-info">
      Om inte annat särskilt anges, redovisas alla belopp i hela
      {{ arsredovsining.redovisningsinformation.redovisningsvaluta.namn }}.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.cover {
  padding-top: 1rem;
}

h1 {
  margin-top: 4rem;
}

.currency-info {
  margin-top: 2rem;
}
</style>
