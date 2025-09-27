<script lang="ts" setup>
/**
 * En komponent för att rendera faststälellseintyget i årsredovisningen.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { isFaststallseintygRequiresEgenText } from "@/model/arsredovisning/Faststallelseintyg.ts";

defineProps<{
  /** Årsredovisningen som innehåller fastställelseintyget. */
  arsredovisning: Arsredovisning;
}>();
</script>

<template>
  <div
    class="faststallelseintyg"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
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
          Jag intygar att resultaträkningen och balansräkningen har fastställts
          på årsstämma
          <!-- @delete-whitespace -->
        </ix:nonNumeric>
        {{ " " }}
        <ix:nonNumeric
          contextRef="balans_nuvarande"
          name="se-bol-base:Arsstamma"
        >
          <!-- @delete-whitespace -->
          {{ arsredovisning.faststallelseintyg.datumArsstamma
          }}<!-- @delete-whitespace --></ix:nonNumeric
        ><!-- @delete-whitespace -->.
        <br />
        <ix:nonNumeric
          :name="
            arsredovisning.faststallelseintyg.resultatdispositionBeslut.xbrlId
          "
          contextRef="balans_nuvarande"
        >
          <!-- @delete-whitespace -->
          {{ arsredovisning.faststallelseintyg.resultatdispositionBeslut.text }}
          <!-- @delete-whitespace -->
        </ix:nonNumeric>
        <template
          v-if="
            isFaststallseintygRequiresEgenText(
              arsredovisning.faststallelseintyg,
            )
          "
        >
          {{ " " }}
          <ix:nonNumeric
            contextRef="balans_nuvarande"
            name="se-bol-base:ArsstammaResultatDispositionBeslutstext"
          >
            {{
              arsredovisning.faststallelseintyg
                .resultatdispositionBeslutEgenText
            }}
          </ix:nonNumeric>
        </template>
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
</template>

<style lang="scss" scoped>
.faststallelseintyg {
  border: 0.25rem solid black;
  padding: 1rem 2rem;

  h2 {
    margin-top: 0.5rem;
  }

  .signature-header {
    font-weight: 600;
  }
}
</style>
