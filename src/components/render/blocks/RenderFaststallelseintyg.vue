<script lang="ts" setup>
/**
 * En komponent för att rendera faststälellseintyget i årsredovisningen.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderFaststallelseintygResultatdispositionStammansPart
  from "@/components/render/blocks/faststallelseintyg/RenderFaststallelseintygResultatdispositionStammansPart.vue";
import { computed } from "vue";
import {
  isFaststallseintygRequiresStammansResultatdisposition,
  RESULTATDISPOSITION_STAMMANS_DEFINITIONS
} from "@/data/faststallelseintyg.ts";

const props = defineProps<{
  /** Årsredovisningen som innehåller fastställelseintyget. */
  arsredovisning: Arsredovisning;
}>();

const allStammansDispositionPartBelopp = computed(() =>
  RESULTATDISPOSITION_STAMMANS_DEFINITIONS.map(
    (definition) =>
      props.arsredovisning.faststallelseintyg.resultatdispositionStammans[
        definition.key
      ],
  ),
);

const allStammansDispositionPartXmlNames =
  RESULTATDISPOSITION_STAMMANS_DEFINITIONS.map(
    (definition) => definition.xbrlId,
  );
</script>

<template>
  <div
    class="faststallelseintyg"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
  >
    <h2>Fastställelseintyg</h2>
    <p>
      <ix:nonNumeric
        contextRef="balans0"
        continuedAt="intygande_forts"
        name="se-bol-base:ArsstammaIntygande"
      >
        <ix:nonNumeric
          contextRef="balans0"
          name="se-bol-base:FaststallelseResultatBalansrakning"
        >
          <!-- @delete-whitespace -->
          Jag intygar att resultaträkningen och balansräkningen har fastställts
          på årsstämma
          <!-- @delete-whitespace -->
        </ix:nonNumeric>
        {{ " " }}
        <ix:nonNumeric contextRef="balans0" name="se-bol-base:Arsstamma">
          <!-- @delete-whitespace -->
          {{ arsredovisning.faststallelseintyg.datumArsstamma
          }}<!-- @delete-whitespace --></ix:nonNumeric
        ><!-- @delete-whitespace -->.
        <br />
        <ix:nonNumeric
          :name="
            arsredovisning.faststallelseintyg.resultatdispositionBeslut.xbrlId
          "
          contextRef="balans0"
        >
          <!-- @delete-whitespace -->
          {{ arsredovisning.faststallelseintyg.resultatdispositionBeslut.text }}
          <!-- @delete-whitespace -->
        </ix:nonNumeric>
        <template
          v-if="
            isFaststallseintygRequiresStammansResultatdisposition(
              arsredovisning.faststallelseintyg,
            )
          "
        >
          {{ " " }}
          <ix:nonNumeric
            contextRef="balans0"
            name="se-bol-base:ArsstammaResultatDispositionBeslutstext"
          >
            Istället beslöt årsstämman
            <RenderFaststallelseintygResultatdispositionStammansPart
              v-for="definition in RESULTATDISPOSITION_STAMMANS_DEFINITIONS"
              :key="definition.key"
              :all-stammans-disposition-part-belopp="
                allStammansDispositionPartBelopp
              "
              :all-stammans-disposition-part-xml-names="
                allStammansDispositionPartXmlNames
              "
              :belopp="
                arsredovisning.faststallelseintyg.resultatdispositionStammans[
                  definition.key
                ]
              "
              :text-after="definition.textAfter"
              :text-before="definition.textBefore"
              :xbrl-id="definition.xbrlId"
            />
          </ix:nonNumeric>
        </template>
      </ix:nonNumeric>
    </p>
    <p>
      <ix:continuation id="intygande_forts">
        <ix:nonNumeric
          contextRef="balans0"
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
          contextRef="balans0"
          name="se-bol-base:UnderskriftFaststallelseintygElektroniskt"
          >Elektroniskt underskriven av</ix:nonNumeric
        >:
      </span>
      <br />
      <ix:nonNumeric
        contextRef="period0"
        name="se-bol-base:UnderskriftFaststallelseintygForetradareTilltalsnamn"
      >
        {{ arsredovisning.faststallelseintyg.underskrift.tilltalsnamn }}
      </ix:nonNumeric>
      {{ " " }}
      <ix:nonNumeric
        contextRef="period0"
        name="se-bol-base:UnderskriftFaststallelseintygForetradareEfternamn"
      >
        {{
          arsredovisning.faststallelseintyg.underskrift.efternamn
        }} </ix:nonNumeric
      ><!-- @delete-whitespace -->,
      <ix:nonNumeric
        contextRef="period0"
        name="se-bol-base:UnderskriftFaststallelseintygForetradareForetradarroll"
      >
        <!-- @delete-whitespace -->
        {{ arsredovisning.faststallelseintyg.underskrift.roll }}
        <!-- @delete-whitespace -->
      </ix:nonNumeric>
      <br />
      <ix:nonNumeric
        id="ID_DATUM_UNDERTECKNANDE_FASTSTALLELSEINTYG"
        contextRef="balans0"
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
