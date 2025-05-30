/**
 * Generisk funktion för att gruppera objekt baserat på nivå.
 *
 * @template T - Typen av objekt som ska grupperas.
 * @param {T[]} items - Objekten som ska grupperas.
 * @param {number} groupLevel - På vilken nivå objekt ska grupperas. Endast
 * poster med en `__Level` som är större än eller lika med denna nivå kommer
 * att inkluderas i grupperingen.
 * @param {(item: T) => { id: string; level: number; isAbstract: boolean }} keyExtractor
 * Funktion för att extrahera grupperingsegenskaper (id, nivå och om objektet
 * är abstrakt).
 * @return {Array<{ items: T[]; ids: Set<string> }>} Array av grupperade
 * objekt.
 */
export function groupItems<T>(
  items: T[],
  groupLevel: number,
  keyExtractor: (item: T) => { id: string; level: number; isAbstract: boolean },
): Array<{ items: T[]; ids: Set<string> }> {
  const groupedItems: Array<{ items: T[]; ids: Set<string> }> = [];
  let currentGroup = { items: [] as T[], ids: new Set<string>() };

  for (const item of items) {
    const { id, level, isAbstract } = keyExtractor(item);

    if (level < groupLevel) {
      continue;
    }

    if (isAbstract && level === groupLevel && currentGroup.items.length > 0) {
      groupedItems.push(currentGroup);
      currentGroup = { items: [], ids: new Set() };
    }
    currentGroup.ids.add(id);
    currentGroup.items.push(item);
  }

  if (currentGroup.items.length > 0) {
    groupedItems.push(currentGroup);
  }

  return groupedItems;
}
