<script lang="ts" setup>
import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

const arsredovsining = defineModel<Arsredovisning>("arsredovisning", {
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
      <label for="forfattare">Författare till årsredovisningen:</label>
      <input
        id="forfattare"
        v-model.trim="arsredovisning.redovisningsinformation.forfattare"
        class="input-field"
        type="text"
      />
    </div>
  </div>

  <div class="form-section">
    <div class="form-group">
      <label for="valutakod">Redovisningsvaluta – kod:</label>
      <input
        id="valutakod"
        v-model.trim="
          arsredovisning.redovisningsinformation.redovisningsvaluta.kod
        "
        class="input-field"
        type="text"
      />
    </div>
    <div class="form-group">
      <label for="valutanamn">Redovisningsvaluta – namn:</label>
      <input
        id="valutanamn"
        v-model.trim="
          arsredovisning.redovisningsinformation.redovisningsvaluta.namn
        "
        class="input-field"
        type="text"
      />
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

  <div class="form-section">
    <div class="form-group">
      <label for="startdatumTidigare">Startdatum senaste räkenskapsår:</label>
      <input
        id="startdatumTidigare"
        v-model.trim="arsredovisning.verksamhetsarTidigare[0].startdatum"
        class="input-field"
        type="date"
      />
    </div>
    <div class="form-group">
      <label for="slutdatumTidigare">Slutdatum senaste räkenskapsår:</label>
      <input
        id="slutdatumTidigare"
        v-model.trim="arsredovisning.verksamhetsarTidigare[0].slutdatum"
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
