import { ref, type Ref } from "vue";
import { type StorageLike, useStorage, watchDeep } from "@vueuse/core";

// Fält som sparas i localStorage
const localStores = [
  "AppShowFirstLaunchScreen", // huruvida välkommen-rutan ska visas
  "AppTourTooltipHasBeenDisplayed", // huruvida rundtur-tooltipen har visats
  "AppAutosaveArsredovisning", // autosparad årsredovisning
  "FinalizeCallBolagsverket", // huruvida Bolagsverkets kontroller ska köras i färdigställ-flödet
] as const;

// Fält som sparas i sessionStorage
const sessionStores = [
  "UserPersonalNumber", // användarens personnummer
  "UserNotificationEmail", // användarens e-postadress för aviseringar
] as const;

type Store = (typeof localStores)[number] | (typeof sessionStores)[number];

function useHighPerformanceStorage<T>(
  store: Store,
  defaultValue: T,
  storage: StorageLike,
): Ref<T> {
  // Detta tillvägagångssätt verkar ge bättre prestanda med stora objekt
  // som t.ex. årsredovisningsobjekt.

  const existingLocalStorageItem = localStorage.getItem(store);
  if (existingLocalStorageItem == null) {
    storage.setItem(store, JSON.stringify(defaultValue));
  }

  const localStorageItemRef = ref(
    existingLocalStorageItem != null
      ? JSON.parse(existingLocalStorageItem)
      : defaultValue,
  );

  watchDeep(localStorageItemRef, (newValue) => {
    storage.setItem(store, JSON.stringify(newValue));
  });

  return localStorageItemRef;
}

/**
 * Hämtar ett fält från webbläsarens lagring, som en Vue-ref. Beroende på vilket
 * fält som anges används antingen localStorage eller sessionStorage.
 *
 * @param store - Nyckeln till fältet som ska hämtas
 * @param defaultValue - Värde som returneras om fältet inte har något sparat
 * värde
 * @param options - Inställningar; just nu finns möjligheten att välja att
 * använda en högprestandalösning istället för den vanliga lösningen
 */
export function useGredorStorage<T>(
  store: Store,
  defaultValue: T,
  options?: {
    highPerformance?: boolean;
  },
): Ref<T> {
  // Välj storage baserat på vilket fält som anges
  let storage;
  if ((localStores as ReadonlyArray<string>).includes(store)) {
    storage = localStorage;
  } else if ((sessionStores as ReadonlyArray<string>).includes(store)) {
    storage = sessionStorage;
  } else {
    throw new Error(`Unknown store: ${store}`);
  }

  // Returnerar en Vue-ref
  if (options?.highPerformance) {
    return useHighPerformanceStorage(store, defaultValue, storage);
  } else {
    return useStorage(store, defaultValue, storage);
  }
}
