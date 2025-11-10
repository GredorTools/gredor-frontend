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
    Efter att du har färdigställt årsredovisningen kommer du behöva signera den,
    antingen digitalt eller på papper. Signeringen måste göras de datumen som du
    har fyllt i nedan, och även fältet "Datum då årsredovisningen var färdig för
    undertecknande" måste stämma överens med verkligheten. Därför är det ofta
    bäst att fylla i detta avsnitt allra sist.
  </div>

  <CommonAccordion>
    <CommonAccordionItem
      id="signatures-accordion-general"
      title="Ort och datum"
    >
      <div class="mb-3">
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
      <div class="mb-3">
        <label class="form-label" for="datering"
          >Datum då årsredovisningen var färdig för undertecknande:</label
        >
        <input
          id="datering"
          v-model.trim="arsredovisning.redovisningsinformation.datering"
          class="form-control"
          type="date"
        />
      </div>
    </CommonAccordionItem>

    <CommonAccordionItem
      id="signatures-accordion-signatures"
      title="Underskrifter"
    >
      <div class="row p-2">
        <div
          v-for="(underskrift, index) in arsredovisning.redovisningsinformation
            .underskrifter"
          :key="index"
          class="card mb-4 p-4 col-12 col-sm-6 col-lg-4"
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

        <button
          class="col-12 btn btn-primary"
          type="button"
          @click="addUnderskrift"
        >
          Lägg till person
        </button>
      </div>
    </CommonAccordionItem>
  </CommonAccordion>
</template>

<style lang="scss" scoped></style>
