import type { Verksamhetsar } from "@/model/arsredovisning/Arsredovisning.ts";
import { h, type VNode } from "vue";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

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

  switch (getPeriodTypeForGroup(groupTaxonomyItem)) {
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
  }
}

export function getPeriodTypeForGroup(
  groupTaxonomyItem: TaxonomyItem,
): "duration" | "instant" | undefined {
  const firstComparableItem = groupTaxonomyItem.childrenFlat.find(
    (child) =>
      [
        "xbrli:monetaryItemType",
        "xbrli:decimalItemType",
        "xbrli:pureItemType",
        "xbrli:sharesItemType",
      ].includes(child.properties.type) &&
      !child.parent!.properties.type.endsWith("Tuple@anonymousType"),
  );
  if (!firstComparableItem) {
    // Finns inga jämförbara värden - ingen periodtyp
    return undefined;
  }

  switch (firstComparableItem.properties.periodType) {
    case "duration":
      // Verksamhetsåret som en period, från startdatumet till slutdatumet
      return firstComparableItem.properties.periodType;
    case "instant":
      // Verksamhetsårets balansdag, dvs slutdatum
      return firstComparableItem.properties.periodType;
    case undefined:
      return firstComparableItem.properties.periodType;
    default:
      throw new Error("Unknown periodType");
  }
}
