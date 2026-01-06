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

/**
 * Typ som bör användas i useGredorStorage och useGredorHighPerformanceStorage
 * för att wrappa andra typer som inte serialiseras och deserialiseras korrekt
 * (t.ex. booleans).
 */
export type WrappedType<T> = { wrappedValue: T };

/**
 * Hämtar ett fält från webbläsarens lagring, som en Vue-ref. Beroende på vilket
 * fält som anges används antingen localStorage eller sessionStorage.
 *
 * @param store - Nyckeln till fältet som ska hämtas
 * @param defaultValue - Värde som returneras om fältet inte har något sparat
 * värde
 * @returns Fältet som en Vue-ref
 */
export function useGredorStorage<T>(store: Store, defaultValue: T): Ref<T> {
  return useStorage(store, defaultValue, getStorage(store));
}

/**
 * Hämtar ett fält från webbläsarens lagring, som en Vue-ref. Beroende på vilket
 * fält som anges används antingen localStorage eller sessionStorage. Detta är
 * ett alternativ till useGredorStorage med högre prestanda; inkommande
 * förändringar synkas endast när sidan får fokus efter att ha varit ur fokus.
 *
 * @param store - Nyckeln till fältet som ska hämtas
 * @param defaultValue - Värde som returneras om fältet inte har något sparat
 * värde
 * @param options - Alternativ för lagringshantering. Innehåller just nu endast
 * preloadCallback, som anropas innan det sparade värdet laddas in och därmed
 * tillåter mutering av värdet.
 * @returns Fältet som en Vue-ref, samt en funktion för att avaktivera lyssnaren
 * som synkar inkommande förändringar
 */
export function useGredorHighPerformanceStorage<T>(
  store: Store,
  defaultValue: T,
  options?: {
    preloadCallback?: (newValue: T) => void;
  },
): { ref: Ref<T>; removeFocusChangeListener: () => void } {
  // Detta tillvägagångssätt verkar ge bättre prestanda med stora objekt
  // som t.ex. årsredovisningsobjekt.

  const storage = getStorage(store);

  // Hämta eventuellt sparat värde (eller sätt default) och skapa ref
  const existingStorageItem = localStorage.getItem(store);
  if (existingStorageItem == null) {
    storage.setItem(store, JSON.stringify(defaultValue));
  }

  let storageItemRef;
  if (existingStorageItem != null) {
    const parsedExistingStorageItem = JSON.parse(existingStorageItem);
    if (options?.preloadCallback) {
      options.preloadCallback(parsedExistingStorageItem);
    }
    storageItemRef = ref(parsedExistingStorageItem);
  } else {
    storageItemRef = ref(defaultValue);
  }

  // Lyssna på förändringar i applikationen och spara dem
  watchDeep(storageItemRef, (newValue) => {
    storage.setItem(store, JSON.stringify(newValue));
  });

  // Ladda in förändringar i storage när sidan får fokus
  const focusChangeListener = () => {
    const updatedItem = localStorage.getItem(store);
    if (updatedItem != null) {
      const parsedUpdatedItem = JSON.parse(updatedItem);
      if (options?.preloadCallback) {
        options.preloadCallback(parsedUpdatedItem);
      }
      storageItemRef.value = parsedUpdatedItem;
    }
  };
  document.addEventListener("focus", focusChangeListener);
  const removeFocusChangeListener = () => {
    document.removeEventListener("focus", focusChangeListener);
  };

  // Retunera Vue-ref, samt funktion för att avaktivera lyssnaren för
  // förändringar i storage
  return { ref: storageItemRef, removeFocusChangeListener };
}

function getStorage(store: Store): StorageLike {
  // Välj mellan localStorage/sessionStorage baserat på vilket fält som anges
  if ((localStores as ReadonlyArray<string>).includes(store)) {
    return localStorage;
  } else if ((sessionStores as ReadonlyArray<string>).includes(store)) {
    return sessionStorage;
  } else {
    throw new Error(`Unknown store: ${store}`);
  }
}
