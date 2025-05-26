import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

export interface TaxonomyItemGroup {
  items: TaxonomyItem[];
  ids: Set<string>;
}

/**
 * Grupperar taxonomiposter i logiska grupper baserat på nivå.
 *
 * @param {TaxonomyItem[]} taxonomyItems - En array med taxonomiposter som ska
 * grupperas.
 * @param {number} groupLevel - Nivån som används för att avgöra på vilken nivå
 * taxonomiposter ska grupperas. Endast poster med en `__Level` som är större
 * än eller lika med denna nivå kommer att inkluderas i grupperingen.
 * @return {TaxonomyItemGroup[]} En array med grupperade taxonomiposter. Varje
 * grupp innehåller en uppsättning av ids och en array av poster som hör till
 * den gruppen.
 */
export function groupTaxonomyItems(
  taxonomyItems: TaxonomyItem[],
  groupLevel: number,
): TaxonomyItemGroup[] {
  const groupedTaxonomyItems: TaxonomyItemGroup[] = [];
  let currentGroup: TaxonomyItemGroup = { items: [], ids: new Set() };
  for (const taxonomyItem of taxonomyItems) {
    if (taxonomyItem.__Level < groupLevel) {
      continue;
    }
    if (
      taxonomyItem.abstrakt === "true" &&
      taxonomyItem.__Level === groupLevel &&
      currentGroup.items.length > 0
    ) {
      groupedTaxonomyItems.push(currentGroup);
      currentGroup = { items: [], ids: new Set() };
    }
    currentGroup.ids.add(taxonomyItem.id);
    currentGroup.items.push(taxonomyItem);
  }
  if (currentGroup.items.length > 0) {
    groupedTaxonomyItems.push(currentGroup);
  }
  return groupedTaxonomyItems;
}
