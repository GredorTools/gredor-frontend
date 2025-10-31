import type { Verksamhetsar } from "@/model/arsredovisning/Arsredovisning.ts";
import { h, type VNode } from "vue";
import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { type Belopprad, getBeloppradInList } from "@/model/arsredovisning/Belopprad.ts";
import {
  BeloppradTupleFormat,
  getBeloppradTupleFormat,
  isBeloppradTuple
} from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";

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
  noter: Belopprad[],
  verksamhetsar: Verksamhetsar,
): VNode {
  const attrs = { scope: "col", class: "value-container" };

  switch (getPeriodTypeForGroup(groupTaxonomyItem, noter)) {
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
  noter: Belopprad[],
): "duration" | "instant" | undefined {
  // Ta fram en belopprad i gruppen (vi tar den första som kan jämföras mellan
  // år) för att avgöra vilken periodtyp som den (och därmed gruppen) har
  const firstComparableItem = groupTaxonomyItem.childrenFlat.find((child) => {
    if (
      ![
        "xbrli:monetaryItemType",
        "xbrli:decimalItemType",
        "xbrli:pureItemType",
        "xbrli:sharesItemType",
      ].includes(child.properties.type)
    ) {
      // Beloppraden kan inte jämföras mellan år - vi ska inte titta på den
      return false;
    }

    const isInTuple = child.parent!.properties.type.endsWith(
      "Tuple@anonymousType",
    );

    if (!isInTuple) {
      // Beloppraden kan jämföras mellan år och ligger inte i en tuple - då vet
      // vi direkt att vi kan titta på den
      return true;
    } else {
      // Beloppraden kan jämföras mellan år men ligger i en tuple - då måste vi
      // kolla om tuplen som den ligger i också kan jämföras mellan år för att
      // veta om vi kan titata på den
      const belopprad = getBeloppradInList(noter, child.parent!);
      return (
        belopprad != null &&
        isBeloppradTuple(belopprad) &&
        getBeloppradTupleFormat(belopprad) === BeloppradTupleFormat.COMPARISON
      );
    }
  });
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
