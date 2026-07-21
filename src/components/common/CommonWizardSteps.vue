<script lang="ts" setup>
/**
 * En stegindikator för wizard-flöden som visar numrerade steg med etiketter.
 * Det aktuella steget markeras.
 */

defineProps<{
  /** Etiketterna för varje steg, i ordning. */
  steps: string[];

  /** Nuvarande stegnummer (1-baserat). */
  currentStepNumber: number;
}>();
</script>

<template>
  <div class="wizard-steps">
    <template v-for="(step, index) in steps" :key="index">
      <div v-if="index > 0" class="connector"></div>

      <div class="step" :class="{ active: index + 1 === currentStepNumber }">
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-label">{{ step }}</div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.wizard-steps {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.step {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  .step-number {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: var(--bs-primary-bg-subtle);
    color: $medium;
    font-weight: 600;
  }

  .step-label {
    color: $light;
    font-weight: 600;
    white-space: nowrap;
  }

  &.active {
    .step-number {
      background-color: $primary-color;
      color: white;
    }

    .step-label {
      color: $mediumdark;
    }
  }
}

.connector {
  flex: 1;
  min-width: $spacing-lg;
  height: 2px;
  background-color: $border-color-normal;
}
</style>
