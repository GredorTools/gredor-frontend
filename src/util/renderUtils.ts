import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { Format } from "@/model/arsredovisning/Format.ts";

export type UnitRef =
  | "redovisningsvaluta"
  | "pure"
  | "shares"
  | `decimal-${string}`
  | undefined;

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

    case "xbrli:stringItemType":
    case "enum:enumerationItemType":
      return undefined;

    default:
      throw new Error(
        `Unknown taxonomy item data type: ${taxonomyItem.properties.type}`,
      );
  }
}

/**
 * Returnerar scale-värdet för ix:nonFraction-element.
 *
 * @param taxonomyItem - Taxonomiobjektet vars scale-värde ska fastställas.
 * @param displayFormat - Vilket format taxonomiobjektet ska visas i.
 */
export function getNonFractionScale(
  taxonomyItem: TaxonomyItem,
  displayFormat: Format,
): string {
  if (isPercentageTaxonomyItem(taxonomyItem)) {
    return "-2";
  } else {
    switch (displayFormat) {
      case Format.NORMAL:
        return "0";
      case Format.TUSENTAL:
        return "3";
      default:
        throw new Error("Unknown format");
    }
  }
}

/**
 * Returnerar decimals-värdet för ix:nonFraction-element.
 *
 * @param taxonomyItem - Taxonomiobjektet vars decimals-värde ska fastställas.
 * @param displayFormat - Vilket format taxonomiobjektet ska visas i.
 */
export function getNonFractionDecimals(
  taxonomyItem: TaxonomyItem,
  displayFormat: Format,
): string {
  if (isPercentageTaxonomyItem(taxonomyItem)) {
    return "INF";
  } else {
    switch (displayFormat) {
      case Format.NORMAL:
        return "INF";
      case Format.TUSENTAL:
        return "-3";
      default:
        throw new Error("Unknown format");
    }
  }
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

const PERCENTAGE_TAXONOMY_ITEMS = [
  "se-gen-base:Soliditet",
  "se-gen-base:Rorelsemarginal",
  "se-gen-base:AvkastningTotaltKapital",
  "se-gen-base:AvkastningSysselsattKapital",
  "se-gen-base:AvkastningEgetKapital",
  "se-gen-base:Kassalikviditet",
];
