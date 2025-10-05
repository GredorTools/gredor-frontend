import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

/**
 * För att bara tillåta vissa tecken i inmatade värden. Ska användas på
 * beforeInput-event.
 *
 * @param event - beforeInput-event från inmatningsfältet.
 * @param allowedValueRegex - Reguljärt uttryck som definierar vilka värden som
 * är tillåtna.
 */
export function handleEventForInputWithValueWhitelist(
  event: InputEvent,
  allowedValueRegex: RegExp,
) {
  if (event.inputType.startsWith("insert")) {
    const inputElement = event.target as HTMLInputElement;
    const newValue =
      inputElement.value.substring(0, inputElement.selectionStart || 0) +
      (event.data ?? "") +
      inputElement.value.substring(inputElement.selectionEnd || 0);
    if (!allowedValueRegex.test(newValue.trim())) {
      event.preventDefault();
    }
  }
}

/**
 * Returnerar test-id (för Cypress) för den givna beloppraden.
 *
 * @param belopprad - Beloppraden som ska vara testbar
 * @param suffix - Eventuellt suffix för test-id:t
 *
 * @returns Test-id som kan sättas i attributet data-testid
 */
export function getTestIdForBelopprad(belopprad: Belopprad, suffix?: string) {
  let result = `edit-${belopprad.taxonomyItemName}`;
  if (belopprad.labelType) {
    result += `-${belopprad.labelType}`;
  }
  if (suffix) {
    result += `-${suffix}`;
  }
  return result;
}
