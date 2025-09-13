import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { type Belopprad } from "@/model/arsredovisning/Belopprad.ts";

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
  displayFormat: BeloppFormat,
): string {
  if (isPercentageTaxonomyItem(taxonomyItem)) {
    return "-2";
  } else {
    switch (displayFormat) {
      case BeloppFormat.HELTAL:
        return "0";
      case BeloppFormat.TUSENTAL:
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
  displayFormat: BeloppFormat,
): string {
  if (isPercentageTaxonomyItem(taxonomyItem)) {
    return "INF";
  } else {
    switch (displayFormat) {
      case BeloppFormat.HELTAL:
        return "INF";
      case BeloppFormat.TUSENTAL:
        return "-3";
      default:
        throw new Error("Unknown format");
    }
  }
}

/**
 * Returnerar prefix för contextRef baserat på periodtypen för det angivna
 * taxonomiobjektet.
 *
 * @param taxonomyItem - Taxonomiobjektet vars prefix för contextRef ska
 * bestämmas.
 * @returns Prefix för contextRef som motsvarar taxonomiobjektets periodtyp.
 */
export function getContextRefPrefix(
  taxonomyItem: TaxonomyItem,
): "period" | "balans" {
  switch (taxonomyItem.properties.periodType) {
    case "duration":
      return "period";
    case "instant":
      return "balans";
    default:
      throw new Error("Unknown periodType");
  }
}

/**
 * Returnerar sign-attributet för det givna taxonomiobjektet och beloppvärdet.
 *
 * Användningen av sign-attribut är lite lurigt - om taxonomiobjektet är ett
 * belopp som är en minskning blir användningen av attributet "omvänt".
 *
 * @param taxonomyItem - Taxonomiobjektet vars sign-attribut ska bestämmas.
 * @param isNegativeValue - Huruvida beloppvärdet är negativt.
 * @return Korrekt sign-attribut för taxonomiobjektet och beloppvärdet.
 */
export function getSignAttribute(
  taxonomyItem: TaxonomyItem,
  isNegativeValue: boolean,
): string | undefined {
  if (!taxonomyItem.properties.label.startsWith("Minskning ")) {
    return isNegativeValue ? "-" : undefined;
  } else {
    return !isNegativeValue ? "-" : undefined;
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

/**
 * Avgör om en belopprad representerar ett procenttal.
 *
 * @param belopprad - Beloppraden som ska kontrolleras.
 * @returns Sant om beloppraden är ett procenttal, annars falskt.
 */
export function isPercentageBelopprad(belopprad: Belopprad): boolean {
  return PERCENTAGE_TAXONOMY_ITEMS.includes(belopprad.taxonomyItemName);
}

const PERCENTAGE_TAXONOMY_ITEMS = [
  "se-gen-base:Soliditet",
  "se-gen-base:Rorelsemarginal",
  "se-gen-base:AvkastningTotaltKapital",
  "se-gen-base:AvkastningSysselsattKapital",
  "se-gen-base:AvkastningEgetKapital",
  "se-gen-base:Kassalikviditet",
];
