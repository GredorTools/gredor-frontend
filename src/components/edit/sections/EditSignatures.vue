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
  <div class="mb-3">
    <label class="form-label" for="underskriftOrt">Ort för underskrift:</label>
    <input
      id="underskriftOrt"
      v-model.trim="arsredovisning.redovisningsinformation.underskriftOrt"
      class="form-control"
      type="text"
    />
  </div>
  <div
    v-for="(underskrift, index) in arsredovisning.redovisningsinformation
      .underskrifter"
    :key="index"
    class="card mb-4 p-4"
  >
    <div class="mb-3">
      <label :for="'tilltalsnamn' + index" class="form-label"
        >Tilltalsnamn:</label
      >
      <input
        :id="'tilltalsnamn' + index"
        v-model.trim="underskrift.tilltalsnamn"
        class="form-control"
        type="text"
      />
    </div>
    <div class="mb-3">
      <label :for="'efternamn' + index" class="form-label">Efternamn:</label>
      <input
        :id="'efternamn' + index"
        v-model.trim="underskrift.efternamn"
        class="form-control"
        type="text"
      />
    </div>
    <div class="mb-3">
      <label :for="'roll' + index" class="form-label"
        >Befattning (valfritt):</label
      >
      <input
        :id="'roll' + index"
        v-model.trim="underskrift.roll"
        class="form-control"
        type="text"
      />
    </div>
    <div class="mb-3">
      <label :for="'datum' + index" class="form-label"
        >Undertecknandedatum:</label
      >
      <input
        :id="'datum' + index"
        v-model.trim="underskrift.datum"
        class="form-control"
        type="date"
      />
    </div>
    <button
      class="btn btn-danger mt-2"
      type="button"
      @click="removeUnderskrift(index)"
    >
      Ta bort person
    </button>
  </div>
  <button class="btn btn-primary" type="button" @click="addUnderskrift">
    Lägg till person
  </button>
</template>

<style lang="scss" scoped></style>
