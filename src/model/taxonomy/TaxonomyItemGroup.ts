import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";
import { groupItems } from "@/util/GroupingUtil.ts";

export interface TaxonomyItemGroup {
  items: TaxonomyItem<TaxonomyItemType>[];
  ids: Set<string>;
}

/**
 * Grupperar taxonomiposter i logiska grupper baserat på nivå.
 *
 * @param {TaxonomyItem[]} taxonomyItems - En array med taxonomiposter som ska
 * grupperas.
 * @param {number} groupLevel - På vilken nivå taxonomiposter ska grupperas.
 * Endast poster med en `__Level` som är större än eller lika med denna nivå
 * kommer att inkluderas i grupperingen.
 * @return {TaxonomyItemGroup[]} En array med grupperade taxonomiposter. Varje
 * grupp innehåller en uppsättning av ids och en array av poster som hör till
 * den gruppen.
 */
export function groupTaxonomyItems(
  taxonomyItems: TaxonomyItem<TaxonomyItemType>[],
  groupLevel: number,
): TaxonomyItemGroup[] {
  return groupItems(taxonomyItems, groupLevel, (item) => ({
    id: item.id,
    level: item.__Level,
    isAbstract: item.abstrakt === "true",
  }));
}
