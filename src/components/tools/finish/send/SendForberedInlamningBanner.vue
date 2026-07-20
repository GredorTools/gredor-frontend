<script lang="ts" setup>
/**
 * En banner som visas i skicka-in-wizarden när årsredovisningen har hämtats
 * från en länk, i stället för att ha laddats upp manuellt av användaren.
 */

defineProps<{
  /** Origin för webbplatsen som årsredovisningen hämtades från. */
  kallaOrigin: string;
}>();
</script>

<template>
  <div
    class="alert alert-warning d-flex align-items-start gap-2 mb-0"
    data-testid="send-wizard-forbered-inlamning-banner"
    role="alert"
  >
    <i aria-hidden="true" class="bi bi-exclamation-triangle-fill"></i>
    <span>
      Årsredovisningen laddades från <strong>{{ kallaOrigin }}</strong
      >. Granska innehållet noggrant innan du loggar in och skriver under.
    </span>
  </div>
</template>

<style lang="scss" scoped></style>
