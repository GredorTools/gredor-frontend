import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

export type UnitRef =
  | "redovisningsvaluta"
  | "pure"
  | "shares"
  | `decimal-${string}`;

export const UNIT_REF_REDOVISNINGSVALUTA: UnitRef = "redovisningsvaluta";
export const UNIT_REF_PURE: UnitRef = "pure";
export const UNIT_REF_SHARES: UnitRef = "shares";

/**
 * Returnerar den lämpliga unitRef-nyckeln för ett taxonomiobjekt.
 *
 * @param taxonomyItem - Taxonomiobjektet vars enhetsreferens ska fastställas.
 * @returns En sträng som representerar unitRef-nyckeln.
 */
export function getUnitRef(taxonomyItem: TaxonomyItem): UnitRef {
  switch (taxonomyItem.properties.type) {
    case "xbrli:monetaryItemType":
      return UNIT_REF_REDOVISNINGSVALUTA;

    case "xbrli:pureItemType":
      return UNIT_REF_PURE;

    case "xbrli:sharesItemType":
      return UNIT_REF_SHARES;

    case "xbrli:decimalItemType":
      return `decimal-${taxonomyItem.properties.name}`;

    // TODO
    case "enum:enumerationItemType":
    case "nonnum:domainItemType":
      alert("Ännu ej implementerat");
      throw new Error(
        `Unsupported taxonomy item data type: ${taxonomyItem.properties.type}`,
      );

    case "xbrli:stringItemType":
      throw new Error(
        `Taxonomy item data type cannot have unitRef: ${taxonomyItem.properties.type}`,
      );

    default:
      throw new Error(
        `Unknown taxonomy item data type: ${taxonomyItem.properties.type}`,
      );
  }
}

/**
 * Returnerar skalan för ix:nonFraction-värden för ett taxonomiobjekt.
 *
 * @param taxonomyItem - Taxonomiobjektet vars skala ska fastställas.
 * @param defaultScale - Standardskalan som används om det inte finns en
 * specifik skala för det angivna taxonomiobjektet.
 * @returns Skalans värde som en sträng.
 */
export function getNonFractionScale(
  taxonomyItem: TaxonomyItem,
  defaultScale: string = "0",
): string {
  return isPercentageTaxonomyItem(taxonomyItem) ? "-2" : defaultScale;
}

/**
 * Avgör om ett taxonomiobjekt representerar ett procenttal.
 *
 * @param taxonomyItem - Taxonomiobjektet som ska kontrolleras.
 * @returns Sant om taxonomiobjektet är ett procenttal, annars falskt.
 */
export function isPercentageTaxonomyItem(taxonomyItem: TaxonomyItem): boolean {
  return PERCENTAGE_TAXONOMY_ITEMS.includes(taxonomyItem.xmlName);
}

const PERCENTAGE_TAXONOMY_ITEMS = ["se-gen-base:Soliditet"];
