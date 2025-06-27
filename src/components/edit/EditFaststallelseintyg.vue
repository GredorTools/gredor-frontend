<script lang="ts" setup>
/**
 * En komponent för att redigera fastställelseintyget i årsredovisningen.
 * Hanterar information om beslut om resultatdisposition och underskrift av fastställelseintyget.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import {
  FASTSTALLELSEINTYG_UNDERSKRIFT_ROLLER,
  RESULTATDISPOSITION_BESLUT,
} from "@/data/faststallelseintyg.ts";

/** Årsredovisningen som innehåller fastställelseintyget. */
defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});
</script>

<template>
  <h2>Fastställelseintyg</h2>
  <div class="form-section">
    <div class="form-group">
      <label for="resultatdispositionBeslut">Beslut resultatdisposition:</label>
      <select
        id="resultatdispositionBeslut"
        v-model="arsredovisning.faststallelseintyg.resultatdispositionBeslut"
        class="input-field"
      >
        <option
          v-for="resultatdispositionBeslut in RESULTATDISPOSITION_BESLUT"
          :key="resultatdispositionBeslut.xbrlId"
          :value="resultatdispositionBeslut"
        >
          {{ resultatdispositionBeslut.text }}
        </option>
      </select>
    </div>
  </div>
  <div class="form-section">
    <div class="form-group">
      <label for="tilltalsnamn">Underskrift, tilltalsnamn:</label>
      <input
        id="tilltalsnamn"
        v-model.trim="
          arsredovisning.faststallelseintyg.underskrift.tilltalsnamn
        "
        class="input-field"
        type="text"
      />
    </div>
    <div class="form-group">
      <label for="efternamn">Underskrift, efternamn:</label>
      <input
        id="efternamn"
        v-model.trim="arsredovisning.faststallelseintyg.underskrift.efternamn"
        class="input-field"
        type="text"
      />
    </div>
    <div class="form-group">
      <label for="roll">Underskrift, befattning:</label>
      <select
        id="roll"
        v-model="arsredovisning.faststallelseintyg.underskrift.roll"
        class="input-field"
      >
        <option
          v-for="roll in FASTSTALLELSEINTYG_UNDERSKRIFT_ROLLER"
          :key="roll"
          :value="roll"
        >
          {{ roll }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label for="datum">Underskrift, datum:</label>
      <input
        id="datum"
        v-model.trim="arsredovisning.faststallelseintyg.underskrift.datum"
        class="input-field"
        type="date"
      />
    </div>
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
