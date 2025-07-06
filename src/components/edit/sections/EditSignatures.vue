<script lang="ts" setup>
/**
 * En komponent för att hantera underskrifter i årsredovisningen.
 * Tillåter användaren att lägga till, redigera och ta bort underskrifter med information om namn, efternamn, roll och datum.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

/** Årsredovisningen som innehåller underskriftsinformation. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

function addUnderskrift() {
  arsredovisning.value.redovisningsinformation.underskrifter.push({
    tilltalsnamn: "",
    efternamn: "",
    roll: "",
    datum: new Date().toISOString().split("T")[0],
  });
}

function removeUnderskrift(index: number) {
  arsredovisning.value.redovisningsinformation.underskrifter.splice(index, 1);
}
</script>

<template>
  <div class="form-group">
    <label for="underskriftOrt">Ort för underskrift:</label>
    <input
      id="underskriftOrt"
      v-model.trim="arsredovisning.redovisningsinformation.underskriftOrt"
      class="input-field"
      type="text"
    />
  </div>
  <div
    v-for="(underskrift, index) in arsredovisning.redovisningsinformation
      .underskrifter"
    :key="index"
    class="form-section"
  >
    <div class="form-group">
      <label :for="'tilltalsnamn' + index">Tilltalsnamn:</label>
      <input
        :id="'tilltalsnamn' + index"
        v-model.trim="underskrift.tilltalsnamn"
        class="input-field"
        type="text"
      />
    </div>
    <div class="form-group">
      <label :for="'efternamn' + index">Efternamn:</label>
      <input
        :id="'efternamn' + index"
        v-model.trim="underskrift.efternamn"
        class="input-field"
        type="text"
      />
    </div>
    <div class="form-group">
      <label :for="'roll' + index">Befattning (valfritt):</label>
      <input
        :id="'roll' + index"
        v-model.trim="underskrift.roll"
        class="input-field"
        type="text"
      />
    </div>
    <div class="form-group">
      <label :for="'datum' + index">Undertecknandedatum:</label>
      <input
        :id="'datum' + index"
        v-model.trim="underskrift.datum"
        class="input-field"
        type="date"
      />
    </div>
    <button type="button" @click="removeUnderskrift(index)">
      Ta bort person
    </button>
  </div>
  <button type="button" @click="addUnderskrift">Lägg till person</button>
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

button {
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.25);
  }
}
</style>
