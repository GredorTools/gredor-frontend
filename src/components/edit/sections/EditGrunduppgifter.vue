<script lang="ts" setup>
/**
 * En komponent för att redigera grunduppgifter i årsredovisningen.
 * Hanterar information som företagsnamn, organisationsnummer, författare, redovisningsvaluta och räkenskapsår.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { REDOVISNINGSVALUTOR } from "@/data/redovisningsvalutor.ts";
import { FORFATTARE_TYPER } from "@/data/forfattare.ts";
import { tryFormatOrgnr } from "@/util/formatUtils.ts";

/** Årsredovisningen som innehåller grunduppgifterna. */
defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
</script>

<template>
  <div class="card mb-4 p-4">
    <div class="mb-3">
      <label class="form-label" for="foretagsnamn">Företagsnamn:</label>
      <input
        id="foretagsnamn"
        v-model.trim="arsredovisning.foretagsinformation.foretagsnamn"
        class="form-control"
        type="text"
      />
    </div>
    <div class="mb-3">
      <label class="form-label" for="organisationsnummer"
        >Organisationsnummer:</label
      >
      <input
        id="organisationsnummer"
        v-model.trim="arsredovisning.foretagsinformation.organisationsnummer"
        class="form-control"
        type="text"
        @input="
          arsredovisning.foretagsinformation.organisationsnummer =
            tryFormatOrgnr(
              arsredovisning.foretagsinformation.organisationsnummer,
            )
        "
      />
    </div>
  </div>

  <div class="card mb-4 p-4">
    <div class="mb-3">
      <label class="form-label" for="forfattare">Författare:</label>
      <select
        id="forfattare"
        v-model="arsredovisning.redovisningsinformation.forfattare"
        class="form-select"
      >
        <option
          v-for="forfattare in FORFATTARE_TYPER"
          :key="forfattare.xbrlId"
          :value="forfattare"
        >
          {{ forfattare.namn }}
        </option>
      </select>
    </div>
  </div>

  <div class="card mb-4 p-4">
    <div class="mb-3">
      <label class="form-label" for="valutakod">Redovisningsvaluta:</label>
      <select
        id="valutakod"
        v-model="arsredovisning.redovisningsinformation.redovisningsvaluta"
        class="form-select"
      >
        <option
          v-for="redovisningsvaluta in REDOVISNINGSVALUTOR"
          :key="redovisningsvaluta.xbrlId"
          :value="redovisningsvaluta"
        >
          {{ redovisningsvaluta.kod }} – {{ redovisningsvaluta.namn }}
        </option>
      </select>
    </div>
  </div>

  <div class="card mb-4 p-4">
    <div class="mb-3">
      <label class="form-label" for="startdatumNuvarande">
        Startdatum nuvarande räkenskapsår:
      </label>
      <input
        id="startdatumNuvarande"
        v-model.trim="arsredovisning.verksamhetsarNuvarande.startdatum"
        class="form-control"
        min="2024-07-01"
        type="date"
      />
      <div class="form-text text-muted">
        (OBS: Gredor stödjer ej räkenskapsår som börjar tidigare än 2024-07-01.)
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label" for="slutdatumNuvarande"
        >Slutdatum nuvarande räkenskapsår:</label
      >
      <input
        id="slutdatumNuvarande"
        v-model.trim="arsredovisning.verksamhetsarNuvarande.slutdatum"
        class="form-control"
        type="date"
      />
    </div>
  </div>

  <div v-for="i in 3" :key="i" class="card mb-4 p-4">
    <div class="form-check mb-3">
      <input
        :id="'verksamhetsarTidigareAktivt' + i"
        :checked="arsredovisning.verksamhetsarTidigare[i - 1] != null"
        :disabled="arsredovisning.verksamhetsarTidigare.length > i"
        class="form-check-input"
        type="checkbox"
        @change="
          (event: Event) => {
            if (event.target) {
              if ((<HTMLInputElement>event.target).checked) {
                while (arsredovisning.verksamhetsarTidigare.length < i) {
                  arsredovisning.verksamhetsarTidigare.push({
                    startdatum: '2000-01-01',
                    slutdatum: '2000-12-31',
                  });
                }
              } else {
                arsredovisning.verksamhetsarTidigare.splice(i - 1, 1);
              }
            }
          }
        "
      />
      <label :for="'verksamhetsarTidigareAktivt' + i" class="form-check-label">
        Verksamheten fanns {{ i }} år före nuvarande räkenskapsår
      </label>
    </div>
    <template v-if="arsredovisning.verksamhetsarTidigare.length > i - 1">
      <div class="mb-3">
        <label class="form-label" for="startdatumTidigare"
          >Startdatum tidigare räkenskapsår, {{ i }} år sedan:</label
        >
        <input
          id="startdatumTidigare"
          v-model.trim="arsredovisning.verksamhetsarTidigare[i - 1].startdatum"
          class="form-control"
          type="date"
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="slutdatumTidigare"
          >Slutdatum tidigare räkenskapsår, {{ i }} år sedan:</label
        >
        <input
          id="slutdatumTidigare"
          v-model.trim="arsredovisning.verksamhetsarTidigare[i - 1].slutdatum"
          class="form-control"
          type="date"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
