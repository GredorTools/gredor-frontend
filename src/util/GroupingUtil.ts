export class GroupingUtil {
  /**
   * Generisk funktion för att gruppera objekt baserat på nivå.
   *
   * @template T - Typen av objekt som ska grupperas.
   * @param items - Objekten som ska grupperas.
   * @param groupLevel - På vilken nivå objekt ska grupperas. Endast poster med
   * en `__Level` som är större än eller lika med denna nivå kommer att
   * inkluderas i utdatat.
   * @param filter - En funktion som används för att filtrera objekten. Endast
   * objekt som uppfyller villkoren i denna funktion inkluderas i utdatat.
   * @param keyExtractor
   * Funktion för att extrahera grupperingsegenskaper (id, nivå och om objektet
   * är abstrakt).
   * @return Array av grupperade objekt.
   */
  static groupItems<T>(
    items: T[],
    groupLevel: number,
    filter: (item: T) => boolean,
    keyExtractor: (item: T) => {
      id: string;
      level: number;
      isAbstract: boolean;
    },
  ): Array<{ items: T[]; ids: Set<string> }> {
    const groupedItems: Array<{ items: T[]; ids: Set<string> }> = [];
    let currentGroup = { items: [] as T[], ids: new Set<string>() };

    // Bygg grupperna
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

    // Filtrera baserat på filter-argumentet
    for (const group of groupedItems) {
      const idsToDelete = group.items
        .filter((item) => !filter(item))
        .map((item) => keyExtractor(item).id);
      for (const id of idsToDelete) {
        group.ids.delete(id);
      }
      group.items = group.items.filter(filter);
    }

    // Returnera grupperna
    return groupedItems;
  }
}
