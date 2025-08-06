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
  <div class="form-section">
    <div class="form-group">
      <label for="resultatdispositionBeslut">Beslut resultatdisposition:</label>
      <select
        id="resultatdispositionBeslut"
        v-model="arsredovisning.faststallelseintyg.resultatdispositionBeslut"
        class="form-select"
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
    <div class="form-group">
      <label for="resultatdispositionBeslut">Datum för årsstämma:</label>
      <input
        id="datum"
        v-model.trim="arsredovisning.faststallelseintyg.datumArsstamma"
        class="form-control"
        type="date"
      />
    </div>
  </div>
  <div class="form-section">
    <div class="row">
      <div class="form-group col">
        <label for="tilltalsnamn">Underskrift, tilltalsnamn:</label>
        <input
          id="tilltalsnamn"
          v-model.trim="
            arsredovisning.faststallelseintyg.underskrift.tilltalsnamn
          "
          class="form-control"
          type="text"
        />
      </div>
      <div class="form-group col">
        <label for="efternamn">Underskrift, efternamn:</label>
        <input
          id="efternamn"
          v-model.trim="arsredovisning.faststallelseintyg.underskrift.efternamn"
          class="form-control"
          type="text"
        />
      </div>
      <div class="form-group col">
        <label for="roll">Underskrift, befattning:</label>
        <select
          id="roll"
          v-model="arsredovisning.faststallelseintyg.underskrift.roll"
          class="form-select"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.form-section {
  margin: $spacing-lg 0;
  padding: $spacing-lg;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

label {
  font-weight: bold;
  margin-bottom: $spacing-sm;
  color: #333;
}

.form-control,
.form-select {
  padding: 0.7rem;
}

h3 {
  font-size: $font-size-xl;
  margin-bottom: $spacing-md;
  color: #444;
}
</style>
