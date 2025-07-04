<script lang="ts" setup>
/**
 * En komponent för att rendera försättsbladet i årsredovisningen.
 * Visar företagsinformation, räkenskapsår och fastställelseintyg.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { computed } from "vue";

const props = defineProps<{
  /** Årsredovisningen som innehåller information för försättsbladet. */
  arsredovisning: Arsredovisning;
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
      {{ arsredovisning.redovisningsinformation.forfattare.namn }} avger härmed
      följande årsredovisning<br />för räkenskapsåret
      {{ arsredovisning.verksamhetsarNuvarande.startdatum }} –
      {{ arsredovisning.verksamhetsarNuvarande.slutdatum }}.
    </p>
    <p class="currency-info">
      Om inte annat särskilt anges, redovisas alla belopp i hela
      {{ arsredovisning.redovisningsinformation.redovisningsvaluta.namn }}.
    </p>
    <div class="certification">
      <h2>Fastställelseintyg</h2>
      <p>
        <ix:nonNumeric
          contextRef="balans_nuvarande"
          continuedAt="intygande_forts"
          name="se-bol-base:ArsstammaIntygande"
        >
          <ix:nonNumeric
            contextRef="balans_nuvarande"
            name="se-bol-base:FaststallelseResultatBalansrakning"
          >
            <!-- @delete-whitespace -->
            Jag intygar att resultaträkningen och balansräkningen har
            fastställts på årsstämma
            <!-- @delete-whitespace -->
          </ix:nonNumeric>
          {{ " " }}
          <ix:nonNumeric
            contextRef="balans_nuvarande"
            name="se-bol-base:Arsstamma"
            >{{ new Date().toISOString().split("T")[0] }} </ix:nonNumeric
          ><!-- @delete-whitespace -->.
          <br />
          <ix:nonNumeric
            :name="
              arsredovisning.faststallelseintyg.resultatdispositionBeslut.xbrlId
            "
            contextRef="balans_nuvarande"
          >
            <!-- @delete-whitespace -->
            {{
              arsredovisning.faststallelseintyg.resultatdispositionBeslut.text
            }}
            <!-- @delete-whitespace -->
          </ix:nonNumeric>
        </ix:nonNumeric>
      </p>
      <p>
        <ix:continuation id="intygande_forts">
          <ix:nonNumeric
            contextRef="balans_nuvarande"
            name="se-bol-base:IntygandeOriginalInnehall"
          >
            <!-- @delete-whitespace -->
            Jag intygar att innehållet i dessa elektroniska handlingar
            överensstämmer med originalen och att originalen undertecknats av
            samtliga personer som enligt lag ska underteckna dessa.
            <!-- @delete-whitespace -->
          </ix:nonNumeric>
        </ix:continuation>
      </p>

      <p>
        <span class="signature-header">
          <ix:nonNumeric
            contextRef="balans_nuvarande"
            name="se-bol-base:UnderskriftFaststallelseintygElektroniskt"
            >Elektroniskt underskriven av</ix:nonNumeric
          >:
        </span>
        <br />
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-bol-base:UnderskriftFaststallelseintygForetradareTilltalsnamn"
        >
          {{ arsredovisning.faststallelseintyg.underskrift.tilltalsnamn }}
        </ix:nonNumeric>
        {{ " " }}
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-bol-base:UnderskriftFaststallelseintygForetradareEfternamn"
        >
          {{
            arsredovisning.faststallelseintyg.underskrift.efternamn
          }} </ix:nonNumeric
        ><!-- @delete-whitespace -->,
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-bol-base:UnderskriftFaststallelseintygForetradareForetradarroll"
        >
          <!-- @delete-whitespace -->
          {{ arsredovisning.faststallelseintyg.underskrift.roll }}
          <!-- @delete-whitespace -->
        </ix:nonNumeric>
        <br />
        <ix:nonNumeric
          id="ID_DATUM_UNDERTECKNANDE_FASTSTALLELSEINTYG"
          contextRef="balans_nuvarande"
          name="se-bol-base:UnderskriftFastallelseintygDatum"
          >{{ new Date().toISOString().split("T")[0] }}
        </ix:nonNumeric>
      </p>
    </div>
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

.certification {
  margin-top: 20rem;
  border: 0.25rem solid black;
  padding: 1rem 2rem;
}

.signature-header {
  font-weight: 600;
}
</style>
