import { ref, type Ref } from "vue";
import { useStorage, watchDeep } from "@vueuse/core";

type Store = "AppTourTooltipHasBeenDisplayed" | "AutosaveArsredovisning";

function useHighPerformanceStorage<T>(store: Store, defaultValue: T): Ref<T> {
  // Detta tillvägagångssätt verkar ge bättre prestanda med stora objekt
  // som t.ex. årsredovisningsobjekt.

  const existingLocalStorageItem = localStorage.getItem(store);

  const localStorageItemRef = ref(
    existingLocalStorageItem != null
      ? JSON.parse(existingLocalStorageItem)
      : defaultValue,
  );

  watchDeep(localStorageItemRef, (newValue) => {
    localStorage.setItem(store, JSON.stringify(newValue));
  });

  return localStorageItemRef;
}

/**
 * Hämtar ett fält från LocalStorage, som en Vue-ref.
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
  if (options?.highPerformance) {
    return useHighPerformanceStorage(store, defaultValue);
  } else {
    return useStorage(store, defaultValue);
  }
}
