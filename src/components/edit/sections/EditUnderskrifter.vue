<script lang="ts" setup>
/**
 * En komponent för att hantera underskrifter i årsredovisningen.
 * Tillåter användaren att lägga till, redigera och ta bort underskrifter med information om namn, efternamn, roll och datum.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import CommonAccordion from "@/components/common/CommonAccordion.vue";
import CommonAccordionItem from "@/components/common/CommonAccordionItem.vue";

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
  <div class="alert alert-primary d-flex gap-2" role="alert">
    <i class="bi bi-info-circle-fill"></i>
    <span>
      Efter att du har färdigställt årsredovisningen kommer du behöva signera
      den, antingen digitalt eller på papper. Signeringen måste göras de datumen
      som du har fyllt i nedan, och även fältet "Datum då årsredovisningen var
      färdig för undertecknande" måste stämma överens med verkligheten. Därför
      är det ofta bäst att fylla i detta avsnitt allra sist.
    </span>
  </div>

  <hr class="mt-4 mb-4" />

  <CommonAccordion>
    <CommonAccordionItem
      id="signatures-accordion-general"
      title="Ort och datum"
    >
      <div class="input-section">
        <label class="form-label" for="undertecknandeOrt"
          >Ort för undertecknande:</label
        >
        <input
          id="undertecknandeOrt"
          v-model.trim="
            arsredovisning.redovisningsinformation.undertecknandeOrt
          "
          class="form-control"
          type="text"
        />
      </div>
      <div class="input-section">
        <label class="form-label" for="datering"
          >Datum då årsredovisningen var upprättad (redo att skrivas
          under):</label
        >
        <input
          id="datering"
          v-model.trim="arsredovisning.redovisningsinformation.datering"
          class="form-control"
          type="date"
        />
        <div class="form-text muted">
          Får <strong>inte</strong> vara senare än datumet för tidigaste
          underskriften nedan.
        </div>
      </div>
    </CommonAccordionItem>

    <CommonAccordionItem
      id="signatures-accordion-signatures"
      title="Underskrifter"
    >
      <div class="row p-2">
        <div class="alert alert-primary d-flex gap-2" role="alert">
          <i class="bi bi-info-circle-fill"></i>
          <span>
            Namnen <strong>måste</strong> stämma överens med vad som är
            registrerat hos Bolagsverket.
          </span>
        </div>

        <div
          v-for="(underskrift, index) in arsredovisning.redovisningsinformation
            .underskrifter"
          :key="index"
          class="mb-2 p-2 col-12 col-sm-6"
        >
          <div class="card p-3">
            <div class="input-section">
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
            <div class="input-section">
              <label :for="'efternamn' + index" class="form-label"
                >Efternamn:</label
              >
              <input
                :id="'efternamn' + index"
                v-model.trim="underskrift.efternamn"
                class="form-control"
                type="text"
              />
            </div>
            <div class="input-section">
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
            <div class="input-section">
              <label :for="'datum' + index" class="form-label"
                >Underskriftsdatum:</label
              >
              <input
                :id="'datum' + index"
                v-model.trim="underskrift.datum"
                class="form-control"
                type="date"
              />
              <div class="alert alert-primary d-flex gap-2 mt-2" role="alert">
                <i class="bi bi-info-circle-fill"></i>
                <span class="small">
                  <strong>OBS!</strong> Detta är inte samma sak som datum för
                  årsstämma eller fastställelseintyg. Årsstämman ska hållas
                  efter att årsredovisningen skrivits under, dvs den får
                  <strong>inte</strong> hållas tidigare än detta datum.
                </span>
              </div>
            </div>
            <button
              class="btn btn-danger mt-2"
              type="button"
              @click="removeUnderskrift(index)"
            >
              Ta bort person
            </button>
          </div>
        </div>

        <button
          class="col-12 mt-3 btn btn-primary"
          type="button"
          @click="addUnderskrift"
        >
          Lägg till person
        </button>
      </div>
    </CommonAccordionItem>
  </CommonAccordion>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.input-section {
  margin-bottom: $spacing-md;

  &:first-child {
    margin-top: $spacing-sm;
  }
}
</style>
