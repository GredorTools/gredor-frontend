<script lang="ts" setup>
/**
 * Accordion-post. Används inuti CommonAccordion.
 */

defineProps<{
  /** Unikt ID (över hela applikationen) för denna accordion-post. */
  id: string;

  /** Accordion-postens rubrik. */
  title?: string;
}>();
</script>

<template>
  <div class="accordion-item">
    <div class="accordion-header">
      <button
        :aria-controls="id"
        :data-bs-target="`#${id}`"
        aria-expanded="true"
        class="accordion-button collapsed"
        data-bs-toggle="collapse"
        type="button"
      >
        {{ title }}
      </button>
    </div>
    <div :id="id" class="accordion-collapse collapse">
      <div class="accordion-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
