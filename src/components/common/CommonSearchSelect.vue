<script lang="ts" setup>
/**
 * En sökbar väljare (combobox): ett textfält som filtrerar en lista med
 * alternativ medan användaren skriver, där man väljer ett alternativ ur listan.
 * Fältets värde (`modelValue`) är det valda alternativets `value` – man kan
 * alltså inte skriva in ett eget fritt värde, bara söka och välja.
 *
 * Standardfiltret matchar rent numeriska sökningar mot alternativets `value`
 * med prefix (t.ex. "20" → alternativ vars value börjar på "20"), och
 * textsökningar mot `label` som delsträng. En egen matchningsfunktion kan anges
 * via `matches`.
 */

import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from "vue";

export interface SearchSelectOption {
  /** Det värde som väljs (returneras via modelValue). */
  value: string;
  /** Texten som visas i listan och i fältet när alternativet är valt. */
  label: string;
  /** Valfri sekundär text (t.ex. kontointervall) som visas i listan. */
  hint?: string;
}

const props = defineProps<{
  /** Alternativen att välja bland. */
  options: SearchSelectOption[];

  /** Platshållartext i fältet. */
  placeholder?: string;

  /** Tillgänglighetsetikett (aria-label) för fältet. */
  ariaLabel?: string;

  /** data-testid som sätts på själva inmatningsfältet. */
  inputTestid?: string;

  /** Högsta antal alternativ som visas samtidigt i listan. */
  maxVisible?: number;

  /** Egen matchningsfunktion (sökterm mot alternativ). */
  matches?: (option: SearchSelectOption, query: string) => boolean;
}>();

/** Det valda alternativets `value` (tom sträng om inget är valt). */
const model = defineModel<string>({ required: true });

/** Söktexten i fältet. */
const query = ref<string>("");
const open = ref<boolean>(false);
const inputRef = ref<HTMLInputElement>();

/**
 * Positionen (i visningsfönstret) för förslagslistan. Listan teleporteras till
 * <body> och positioneras fast under fältet, så att den kan visas ovanpå
 * innehållet utan att klippas av modalens rullningsområde eller ändra dess
 * storlek.
 */
const dropdownStyle = reactive({ top: "0px", left: "0px", width: "0px" });

function updateDropdownPosition() {
  const element = inputRef.value;
  if (element == null) {
    return;
  }
  const rect = element.getBoundingClientRect();
  dropdownStyle.top = `${rect.bottom}px`;
  dropdownStyle.left = `${rect.left}px`;
  dropdownStyle.width = `${rect.width}px`;
}

function onReposition() {
  if (open.value) {
    updateDropdownPosition();
  }
}

// Följ med fältet om sidan/modalen rullas eller storleken ändras medan listan
// är öppen.
watch(open, (isOpen) => {
  if (isOpen) {
    void nextTick(updateDropdownPosition);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
  } else {
    window.removeEventListener("scroll", onReposition, true);
    window.removeEventListener("resize", onReposition);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onReposition, true);
  window.removeEventListener("resize", onReposition);
});

/** Visningsnamnet för det för tillfället valda alternativet. */
const selectedLabel = computed<string>(
  () => props.options.find((option) => option.value === model.value)?.label ?? "",
);

// Håll fältets text i synk med det valda alternativet när modellen ändras
// utifrån (t.ex. när modalen nollställs).
watch(
  [model, selectedLabel],
  () => {
    if (!open.value) {
      query.value = selectedLabel.value;
    }
  },
  { immediate: true },
);

function defaultMatches(option: SearchSelectOption, q: string): boolean {
  const trimmed = q.trim();
  if (trimmed === "") {
    return true;
  }
  if (/^\d+$/.test(trimmed)) {
    // Rent numerisk sökning: prefixmatcha mot alternativets value.
    return option.value.startsWith(trimmed);
  }
  const lower = trimmed.toLowerCase();
  return (
    option.label.toLowerCase().includes(lower) ||
    option.value.toLowerCase().includes(lower)
  );
}

const filteredOptions = computed<SearchSelectOption[]>(() => {
  const matches = props.matches ?? defaultMatches;
  return props.options
    .filter((option) => matches(option, query.value))
    .slice(0, props.maxVisible ?? 50);
});

function onInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value;
  open.value = true;
}

function selectOption(option: SearchSelectOption) {
  model.value = option.value;
  query.value = option.label;
  open.value = false;
}

function onBlur() {
  // Fördröj stängningen så att ett klick på ett alternativ hinner registreras.
  window.setTimeout(() => {
    open.value = false;
    // Om användaren har tömt fältet räknas det som "inget val"; annars
    // återställs texten till det valda alternativet.
    if (query.value.trim() === "") {
      model.value = "";
    } else {
      query.value = selectedLabel.value;
    }
  }, 150);
}
</script>

<template>
  <div class="search-select">
    <input
      ref="inputRef"
      :value="query"
      :aria-label="ariaLabel ?? placeholder"
      :data-testid="inputTestid"
      :placeholder="placeholder"
      autocomplete="off"
      class="form-control"
      type="text"
      @blur="onBlur"
      @focus="open = true"
      @input="onInput"
    />
    <Teleport to="body">
      <ul
        v-if="open && filteredOptions.length > 0"
        :style="dropdownStyle"
        class="search-select-suggestions"
      >
        <li v-for="option in filteredOptions" :key="option.value">
          <button
            :data-testid="
              inputTestid ? `${inputTestid}-option-${option.value}` : undefined
            "
            class="search-select-suggestion"
            type="button"
            @mousedown.prevent="selectOption(option)"
          >
            <span class="search-select-label">{{ option.label }}</span>
            <span v-if="option.hint" class="search-select-hint">
              {{ option.hint }}
            </span>
          </button>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.search-select {
  position: relative;
}

// Förslagslistan teleporteras till <body> och positioneras fast (fixed) under
// fältet. På så sätt ligger den ovanpå allt annat innehåll, klipps inte av
// modalens rullningsområde och ändrar inte modalens storlek när den öppnas.
.search-select-suggestions {
  position: fixed;
  z-index: 2000;
  margin: $spacing-xs 0 0;
  padding: 0;
  list-style: none;
  max-height: 14rem;
  overflow-y: auto;
  border: 1px solid var(--bs-border-color);
  border-radius: $border-radius;
  background-color: var(--bs-body-bg);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
}

.search-select-suggestion {
  display: block;
  width: 100%;
  padding: $spacing-xs $spacing-sm;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: var(--bs-primary-bg-subtle);
  }
}

.search-select-label {
  display: block;
}

.search-select-hint {
  display: block;
  color: var(--bs-secondary-color);
  font-size: $font-size-sm;
  font-variant-numeric: tabular-nums;
}
</style>
