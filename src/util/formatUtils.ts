import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import { isPercentageTaxonomyItem } from "@/util/renderUtils.ts";

/**
 * Formaterar en numerisk sträng genom att lägga till mellanslag som
 * tusentalsseparatorer.
 *
 * @param numberAsString - Strängrepresentation av ett tal som ska formateras.
 * @param taxonomyItem - Taxonomiobjektet vars värde representeras i talet.
 * @param displayFormat - Vilket format talet ska visas i.
 * @param options - Huruvida eventuella tecken (plus/minus) ska tas bort.
 * @returns Den formaterade numeriska strängen med mellanslag som
 * tusentalsseparator.
 */
export function formatNumber(
  numberAsString: string,
  taxonomyItem: TaxonomyItem,
  displayFormat: BeloppFormat,
  options?: {
    removeSign: boolean;
  },
): string {
  if (!isPercentageTaxonomyItem(taxonomyItem)) {
    switch (displayFormat) {
      case BeloppFormat.NORMAL:
        break;
      case BeloppFormat.TUSENTAL:
        numberAsString = Math.round(
          parseInt(numberAsString.trim(), 10) / 1000,
        ).toString();
        break;
      default:
        throw new Error("Unknown format");
    }
  }

  let result = numberAsString
    .trim()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");

  if (options?.removeSign) {
    result = result.replace(/^[-+]/, "");
  }

  return result;
}

/**
 * Transformerar en datumsträng till "ÅÅÅÅ" om det är den sista dagen på året,
 * annars till "ÅÅÅÅ-MM".
 *
 * @param balanceDateStr - Balansdatum i formatet "ÅÅÅÅ-MM-DD".
 * @returns Den transformerade strängen i formatet "ÅÅÅÅ" eller "ÅÅÅÅ-MM".
 */
export function formatDateForFlerarsoversikt(balanceDateStr: string): string {
  const [year, month, day] = balanceDateStr.split("-").map(Number);
  if (!year || !month || !day) {
    return "";
  }

  // Kontrollera om det är den sista dagen på året
  if (month === 12 && day === 31) {
    return year.toString(); // Returnera endast året
  }

  // Annars, returnera år och månad
  return `${year}-${month.toString().padStart(2, "0")}`;
}

/**
 * Formatera ett organisationsnummer om möjligt (lägg till bindestreck). Indatat
 * formateras endast om det är en sträng som endast innehåller tio siffror.
 *
 * @param orgnr - Organisationsnumret att försöka formatera
 * @returns Det formaterade organisationsnumret om det formaterades, annars det
 * värde som skickades in i funktionen
 */
export function tryFormatOrgnr(orgnr: string) {
  if (/^\d{10}$/.test(orgnr)) {
    return orgnr.substring(0, 6) + "-" + orgnr.substring(6);
  }
  return orgnr;
}

/**
 * Hämtar visningsetiketten för ett värde som kommer från en vallista.
 * Tar bort eventuellt efterföljande "Värde" från etiketten om det finns.
 *
 * @param taxonomyItem - Taxonomiobjektet för värdet från vallistan.
 * @return Den bearbetade visningsetiketten om tillgänglig, annars undefined.
 */
export function formatEnumValueDisplayLabel(
  taxonomyItem: TaxonomyItem,
): string | undefined {
  return taxonomyItem.additionalData.displayLabel?.replace(/ \(Värde\)$/g, "");
}
