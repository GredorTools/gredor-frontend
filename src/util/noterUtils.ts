import type { TaxonomyItem } from "@/util/TaxonomyManager.ts";
import type { Verksamhetsar } from "@/model/arsredovisning/Arsredovisning.ts";
import { h, type VNode } from "vue";

/**
 * Genererar en VNode för verksamhetsår som visas i tabellhuvudet, för en grupp
 * taxonomiobjekt. T.ex. "2025-12-31" eller "2027-01-01 – 2027-12-31", beroende
 * på vad det är för grupp.
 *
 * @param groupTaxonomyItem - Taxonomiobjektetsgruppen.
 * @param verksamhetsar - Verksamhetsåret för vilken data ska visas.
 * @returns Ett VNode-element som representerar den genererade
 * tabellhuvudcellen.
 */
export function getValueColumnHeaderCell(
  groupTaxonomyItem: TaxonomyItem,
  verksamhetsar: Verksamhetsar,
): VNode {
  const attrs = { scope: "col", class: "value-container" };

  const firstNonStringItem = groupTaxonomyItem.childrenFlat.find(
    (child) => child.properties.type !== "xbrli:stringItemType",
  );
  if (!firstNonStringItem) {
    // Finns inga icke-sträng-värden, vi ska inte ha någon kolumnrubrik
    return h("th", attrs);
  }
  switch (firstNonStringItem.properties.periodType) {
    case "duration":
      // Verksamhetsåret som en period, från startdatumet till slutdatumet
      return h("th", attrs, [
        verksamhetsar.startdatum,
        h("br"),
        "–",
        verksamhetsar.slutdatum,
      ]);
    case "instant":
      // Verksamhetsårets balansdag, dvs slutdatum
      return h("th", attrs, [verksamhetsar.slutdatum]);
    case undefined:
      return h("th", attrs, []);
    default:
      throw new Error("Unknown periodType");
  }
}
