import { useStorage } from "@vueuse/core";
import type { Ref } from "vue";

type Store = "AppTourTooltipHasBeenDisplayed" | "AutosaveArsredovisning";

/**
 * Hämtar ett fält från LocalStorage, som en Vue-ref.
 *
 * @param store - Nyckeln till fältet som ska hämtas
 * @param defaultValue - Värde som returneras om fältet inte har något sparat
 * värde
 */
export function useGredorStorage<T>(store: Store, defaultValue: T): Ref<T> {
  return useStorage(store, defaultValue);
}
