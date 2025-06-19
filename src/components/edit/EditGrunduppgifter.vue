<script lang="ts" setup>
/**
 * En komponent för att redigera grunduppgifter i årsredovisningen.
 * Hanterar information som företagsnamn, organisationsnummer, författare, redovisningsvaluta och räkenskapsår.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { REDOVISNINGSVALUTOR } from "@/data/redovisningsvalutor.ts";
import { FORFATTARE_TYPER } from "@/data/forfattare.ts";

/** Årsredovisningen som innehåller grunduppgifterna. */
defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
</script>

<template>
  <h3>Grunduppgifter</h3>
  <div class="form-section">
    <div class="form-group">
      <label for="foretagsnamn">Företagsnamn:</label>
      <input
        id="foretagsnamn"
        v-model.trim="arsredovisning.foretagsinformation.foretagsnamn"
        class="input-field"
        type="text"
      />
    </div>
    <div class="form-group">
      <label for="organisationsnummer">Organisationsnummer:</label>
      <input
        id="organisationsnummer"
        v-model.trim="arsredovisning.foretagsinformation.organisationsnummer"
        class="input-field"
        type="text"
      />
    </div>
  </div>

  <div class="form-section">
    <div class="form-group">
      <label for="forfattare">Författare:</label>
      <select
        id="forfattare"
        v-model="arsredovisning.redovisningsinformation.forfattare"
        class="input-field"
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

  <div class="form-section">
    <div class="form-group">
      <label for="valutakod">Redovisningsvaluta:</label>
      <select
        id="valutakod"
        v-model="arsredovisning.redovisningsinformation.redovisningsvaluta"
        class="input-field"
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

  <div class="form-section">
    <div class="form-group">
      <label for="startdatumNuvarande"
        >Startdatum nuvarande räkenskapsår:</label
      >
      <input
        id="startdatumNuvarande"
        v-model.trim="arsredovisning.verksamhetsarNuvarande.startdatum"
        class="input-field"
        type="date"
      />
    </div>
    <div class="form-group">
      <label for="slutdatumNuvarande">Slutdatum nuvarande räkenskapsår:</label>
      <input
        id="slutdatumNuvarande"
        v-model.trim="arsredovisning.verksamhetsarNuvarande.slutdatum"
        class="input-field"
        type="date"
      />
    </div>
  </div>

  <div v-for="i in 3" :key="i" class="form-section">
    <label :for="'verksamhetsarTidigareAktivt' + i"
      >Verksamheten fanns {{ i }} år före nuvarande räkenskapsår:
    </label>
    <input
      :id="'verksamhetsarTidigareAktivt' + i"
      :checked="arsredovisning.verksamhetsarTidigare[i - 1] != null"
      :disabled="arsredovisning.verksamhetsarTidigare.length > i"
      type="checkbox"
      @change="
        (el) => {
          if (el.target) {
            if (el.target.checked) {
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
    <template v-if="arsredovisning.verksamhetsarTidigare.length > i - 1">
      <div class="form-group">
        <label for="startdatumTidigare"
          >Startdatum tidigare räkenskapsår, {{ i }} år sedan:</label
        >
        <input
          id="startdatumTidigare"
          v-model.trim="arsredovisning.verksamhetsarTidigare[i - 1].startdatum"
          class="input-field"
          type="date"
        />
      </div>
      <div class="form-group">
        <label for="slutdatumTidigare"
          >Slutdatum tidigare räkenskapsår, {{ i }} år sedan:</label
        >
        <input
          id="slutdatumTidigare"
          v-model.trim="arsredovisning.verksamhetsarTidigare[i - 1].slutdatum"
          class="input-field"
          type="date"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.form-section {
  margin: 1.5rem 0;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.input-field {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.25);
    outline: none;
  }
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #444;
}
</style>
