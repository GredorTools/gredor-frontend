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
 * @param displayFormat - Vilket format taxonomiobjektets värde ska visas i.
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
 * @param displayFormat - Vilket format taxonomiobjektets värde ska visas i.
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
 * Returnerar lämpligt contextRef baserat på bl.a. etikett-typen för det angivna
 * taxonomiobjektet.
 *
 * Det kan vara lite lurigt eftersom om det är etikett-typ periodStartLabel på
 * en balansrad ingår det i förra årets context.
 *
 * @param taxonomyItem - Taxonomiobjektet vars contextRef ska bestämmas.
 * @param prefix - Prefix för contextRef, kan hämtas med getContextRefPrefix.
 * @param yearIndex - 0 för nuvarande räkenskapsår, 1 för senaste tidigare
 * räkenskapsåret, osv.
 * @returns contextRef som motsvarar bl.a. taxonomiobjektets etikett-typ.
 */
export function getContextRef(
  taxonomyItem: TaxonomyItem,
  prefix: "period" | "balans",
  yearIndex: number = 0,
): string {
  if (
    prefix === "balans" &&
    taxonomyItem.additionalData.labelType === "periodStartLabel"
  ) {
    return `${prefix}_tidigare${yearIndex + 1}`;
  }

  if (yearIndex === 0) {
    return `${prefix}_nuvarande`;
  } else {
    return `${prefix}_tidigare${yearIndex}`;
  }
}

/**
 * Returnerar sign-attributet för det givna taxonomiobjektet och beloppvärdet.
 *
 * Användningen av sign-attribut är lite lurigt - om taxonomiobjektet är ett
 * belopp som är en minskning blir användningen av attributet "omvänt".
 *
 * @param taxonomyItem - Taxonomiobjektet vars sign-attribut ska bestämmas.
 * @param belopp - Beloppet.
 *
 * @returns Korrekt sign-attribut för taxonomiobjektet och beloppvärdet.
 */
export function getSignAttribute(
  taxonomyItem: TaxonomyItem,
  belopp: string,
): string | undefined {
  belopp = belopp.trim();

  if (belopp.length < 1 || parseInt(belopp, 10) === 0) {
    // Inget sign-attribut för noll
    return undefined;
  }

  const isNegativeValue = belopp.startsWith("-");

  // Källa: https://xbrl.taxonomier.se/se/exempel/taggning/exempel-7/taggning-exempel-7-rev20240214.xhtml
  if (
    taxonomyItem.properties.balance === "credit" ||
    taxonomyItem.properties.balance === "debit"
  ) {
    // Som man förväntar sig
    return isNegativeValue ? "-" : undefined;
  } else {
    // Begrepp som saknar debit/credit; standardrubriken vägleder om förväntat värde i instansdokumentet
    if (
      (taxonomyItem.properties.label.startsWith("Minskning ") &&
        !/^Minskning(?: \(ökning\))? av(?: ackumulerade)? (?:av|ned)skrivningar /i.test(
          taxonomyItem.properties.label,
        )) ||
      /^Ökning(?: \(minskning\))? av(?: ackumulerade)? (?:av|ned)skrivningar /i.test(
        taxonomyItem.properties.label,
      ) ||
      taxonomyItem.properties.label.startsWith("Periodens avskrivningar ") ||
      taxonomyItem.properties.label.startsWith("Återförda uppskrivningar ") ||
      taxonomyItem.properties.label.startsWith("Avskrivningar av ") ||
      taxonomyItem.properties.label.startsWith("Periodens nedskrivningar ")
    ) {
      // "Vänd" på tecknet pga att det är en minskning, eller för att det är en av-/nedskrivning
      return !isNegativeValue ? "-" : undefined;
    } else {
      // I övriga fall blir det mer intuitivt
      return isNegativeValue ? "-" : undefined;
    }
  }
}

/**
 * Returnerar huruvida balanstecken (plus/minus) ska visas visuellt.
 *
 * @param taxonomyItem - Taxonomiobjektet som renderas.
 * @param belopp - Beloppet.
 * @param displayFormat - Vilket format taxonomiobjektets värde ska visas i.
 * @param showBalanceSign - Huruvida balanstecken (plus/minus) får visas för
 * beloppraden utifrån det motsvarande taxonomiobjektets balance-värde.
 *
 * @returns Huruvida balanstecken (plus/minus) ska visas visuellt.
 */
export function shouldShowSign(
  taxonomyItem: TaxonomyItem,
  belopp: string,
  displayFormat: BeloppFormat,
  showBalanceSign: boolean,
): boolean {
  belopp = belopp.trim();

  if (belopp.length < 1) {
    // Tomt värde, inget tecken
    return false;
  }

  let beloppToDisplay = parseInt(belopp, 10);
  switch (displayFormat) {
    case BeloppFormat.HELTAL:
      break;
    case BeloppFormat.TUSENTAL:
      beloppToDisplay = Math.round(beloppToDisplay / 1000);
      break;
    default:
      throw new Error("Unknown format");
  }

  if (beloppToDisplay === 0) {
    // Inget tecken för noll
    return false;
  }

  let result: boolean;
  if (showBalanceSign) {
    if (taxonomyItem.properties.balance === "debit") {
      result = !belopp.startsWith("-");
    } else if (taxonomyItem.properties.balance === "credit") {
      result = belopp.startsWith("-");
    } else {
      result = belopp.startsWith("-");
    }

    if (
      taxonomyItem.properties.periodType === "instant" &&
      taxonomyItem.properties.balance
    ) {
      // Visas "tvärtom" för balansposter
      result = !result;
    }
  } else {
    result = belopp.startsWith("-");
  }

  return result;
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
