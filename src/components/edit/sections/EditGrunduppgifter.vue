<script lang="ts" setup>
/**
 * En komponent för att redigera grunduppgifter i årsredovisningen.
 * Hanterar information som företagsnamn, organisationsnummer, författare, redovisningsvaluta och räkenskapsår.
 */

import { type Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { REDOVISNINGSVALUTOR } from "@/data/redovisningsvalutor.ts";
import { AVGIVANDE_TYPER } from "@/data/avgivande.ts";
import { tryFormatOrgnr } from "@/util/formatUtils.ts";
import CommonFileInput from "@/components/common/CommonFileInput.vue";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";
import CommonDeleteButton from "@/components/common/CommonDeleteButton.vue";

/** Årsredovisningen som innehåller grunduppgifterna. */
const arsredovisning = defineModel<Arsredovisning>("arsredovisning", {
  required: true,
});

const { showMessageModal } = useModalStore();

const maxLogoSizeKB = 512;

function onLogoFilePicked(file: File) {
  if (file.size > maxLogoSizeKB * 1024) {
    showMessageModal(
      `Logotypen får inte vara större än ${maxLogoSizeKB} kB.`,
      "Fel",
    );
    return;
  }

  const fileReader = new FileReader();
  fileReader.addEventListener("load", () => {
    if (typeof fileReader.result !== "string") {
      throw new Error("Unexpected file reader result type");
    }
    arsredovisning.value.foretagsinformation.logotyp.base64 = fileReader.result;
  });
  fileReader.readAsDataURL(file);
}
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
        maxlength="11"
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
      <label class="form-label"
        >Logotyp (valfri; max {{ maxLogoSizeKB }} kB):</label
      >
      <CommonFileInput
        v-if="arsredovisning.foretagsinformation.logotyp.base64 == null"
        :allowed-data-types="['image/png', 'image/jpeg', 'image/gif']"
        :allowed-file-extensions="['.png', '.jpg', '.jpeg', '.gif']"
        hide-selected-file-name
        @file-picked="onLogoFilePicked"
      />
      <div v-else class="d-flex justify-content-between">
        <div class="logo-container">
          <img
            :src="arsredovisning.foretagsinformation.logotyp.base64"
            alt="Logotyp"
            class="logo"
          />
        </div>
        <CommonDeleteButton
          description="Ta bort logotyp"
          @delete="
            () => {
              arsredovisning.foretagsinformation.logotyp.base64 = null;
            }
          "
        />
      </div>
    </div>
    <div v-if="arsredovisning.foretagsinformation.logotyp.base64" class="mb-3">
      <label class="form-label" for="logotyp-placering"
        >Placering av logotyp:</label
      >
      <select
        id="logotyp-placering"
        v-model="arsredovisning.foretagsinformation.logotyp.placering"
        class="form-select"
      >
        <option value="vänster">Vänster</option>
        <option value="höger">Höger</option>
        <option value="topp">Topp</option>
      </select>
    </div>
  </div>

  <div class="card mb-4 p-4">
    <div class="mb-3">
      <label class="form-label" for="avgivande"
        >Vem som avger årsredovisningen:</label
      >
      <select
        id="avgivande"
        v-model="arsredovisning.redovisningsinformation.avgivande"
        class="form-select"
      >
        <option
          v-for="avgivande in AVGIVANDE_TYPER"
          :key="avgivande.xbrlId"
          :value="avgivande"
        >
          {{ avgivande.namn }}
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

  <div
    class="card mb-4 p-4"
    data-testid="edit-grunduppgifter-rakenskapsar-nuvarande"
  >
    <div class="mb-3">
      <label class="form-label" for="startdatumNuvarande">
        Startdatum räkenskapsår för årsredovisningen:
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
        >Slutdatum räkenskapsår för årsredovisningen:</label
      >
      <input
        id="slutdatumNuvarande"
        v-model.trim="arsredovisning.verksamhetsarNuvarande.slutdatum"
        class="form-control"
        type="date"
      />
    </div>
  </div>

  <div
    v-for="i in 3"
    :key="i"
    :class="{ 'mb-4': i < 3 }"
    :data-testid="`edit-grunduppgifter-rakenskapsar-nuvarande-${i}`"
    class="card p-4"
  >
    <div class="form-check mb-3">
      <input
        :id="`verksamhetsarTidigareAktivt${i}`"
        :checked="arsredovisning.verksamhetsarTidigare[i - 1] != null"
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
                arsredovisning.verksamhetsarTidigare.length = i - 1;
              }
            }
          }
        "
      />
      <label :for="`verksamhetsarTidigareAktivt${i}`" class="form-check-label">
        Verksamheten existerade {{ i }} år före årsredovisningens räkenskapsår
      </label>
    </div>
    <template v-if="arsredovisning.verksamhetsarTidigare.length > i - 1">
      <div class="mb-3">
        <label :for="`startdatumTidigare${i}`" class="form-label"
          >Startdatum tidigare räkenskapsår, {{ i }} år före årsredovisningens
          räkenskapsår:</label
        >
        <input
          :id="`startdatumTidigare${i}`"
          v-model.trim="arsredovisning.verksamhetsarTidigare[i - 1].startdatum"
          class="form-control"
          type="date"
        />
      </div>
      <div class="mb-3">
        <label :for="`slutdatumTidigare${i}`" class="form-label"
          >Slutdatum tidigare räkenskapsår, {{ i }} år före årsredovisningens
          räkenskapsår:</label
        >
        <input
          :id="`slutdatumTidigare${i}`"
          v-model.trim="arsredovisning.verksamhetsarTidigare[i - 1].slutdatum"
          class="form-control"
          type="date"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.logo-container {
  border: 1px solid black;

  .logo {
    height: 2.48rem; // Matcha rendering
  }
}
</style>
