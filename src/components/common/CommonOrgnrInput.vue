<script lang="ts" setup>
/**
 * Ett generiskt fält för inmatning av organisationsnummer. Inkluderar
 * validering som dels visas visuellt och dels kan hämtas genom ett event.
 */

import { tryFormatOrgnr } from "@/util/formatUtils.ts";
import { computed, type ComputedRef, watch } from "vue";
import LuhnAlgorithm from "@designbycode/luhn-algorithm";

export type OrgnrValidationStatus =
  | "awaiting_input"
  | "ok"
  | "invalid_luhn"
  | "likely_not_aktiebolag";

defineOptions({
  inheritAttrs: false,
});

/** Organisationsnumret som matas in. */
const orgnr = defineModel<string>({
  required: true,
});

const emit = defineEmits<{
  /** Triggas när resultatet av valideringen har ändrats. */
  (e: "validationStatusChange", validationStatus: OrgnrValidationStatus): void;
}>();

// Formatering av organisationsnummer
watch(orgnr, () => {
  orgnr.value = tryFormatOrgnr(orgnr.value);
});

// Validering av organisationsnummer
const orgnrRegex = /^\d{6}-?\d{4}$/;
const aktiebolagRegex = /^(?:556|559)\d{3}-?\d{4}$/;

const orgnrValidationStatus: ComputedRef<OrgnrValidationStatus> = computed(
  () => {
    if (!orgnrRegex.test(orgnr.value)) {
      return "awaiting_input";
    }

    if (!LuhnAlgorithm.isValid(orgnr.value.replace("-", ""))) {
      return "invalid_luhn";
    }

    if (!aktiebolagRegex.test(orgnr.value)) {
      return "likely_not_aktiebolag";
    }

    return "ok";
  },
);

watch(orgnrValidationStatus, function () {
  emit("validationStatusChange", orgnrValidationStatus.value);
});
</script>

<template>
  <input v-bind="$attrs" v-model.trim="orgnr" maxlength="11" type="text" />

  <!-- Valideringsmeddelanden -->
  <strong v-if="orgnrValidationStatus === 'invalid_luhn'" class="d-block mt-2">
    Ogiltigt organisationsnummer.
  </strong>
  <strong
    v-else-if="orgnrValidationStatus === 'likely_not_aktiebolag'"
    class="d-block mt-2"
  >
    Utifrån organisationsnumret ser företaget inte ut att vara ett aktiebolag.
    Tänk på att Gredor endast stöder aktiebolag.
  </strong>
</template>
