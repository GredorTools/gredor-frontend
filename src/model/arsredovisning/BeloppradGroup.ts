import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";
import { groupItems } from "@/util/GroupingUtil.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BeloppradGroup {
  items: Belopprad<TaxonomyItemType>[];
  ids: Set<string>;
}

/**
 * Grupperar belopprader i logiska grupper baserat på nivå.
 *
 * @param {Belopprad[]} belopprader - En array med belopprader som ska
 * grupperas.
 * @param {number} groupLevel - På vilken nivå belopprader ska grupperas.
 * Endast poster med en `__Level` som är större än eller lika med denna nivå
 * kommer att inkluderas i grupperingen.
 * @return {BeloppradGroup[]} En array med grupperade belopprader. Varje grupp
 * innehåller en uppsättning av ids och en array av poster som hör till den
 * gruppen.
 */
export function groupBelopprader(
  belopprader: Belopprad<TaxonomyItemType>[],
  groupLevel: number,
): BeloppradGroup[] {
  return groupItems(belopprader, groupLevel, (item) => ({
    id: item.taxonomyItem.id,
    level: item.taxonomyItem.__Level,
    isAbstract: item.taxonomyItem.abstrakt === "true",
  }));
}
