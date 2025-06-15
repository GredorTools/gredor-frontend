type FormatOptions = {
  removeSign: boolean;
};

export class FormatUtil {
  /**
   * Formaterar en numerisk sträng genom att lägga till mellanslag som
   * tusentalsseparatorer.
   *
   * @param numberAsString - Strängrepresentation av ett tal som ska formateras.
   * @param options - Huruvida eventuella tecken (plus/minus) ska tas bort
   * @return Den formaterade numeriska strängen med mellanslag som
   * tusentalsseparator.
   */
  static formatNumber(numberAsString: string, options?: FormatOptions): string {
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
  static formatDateForFlerarsoversikt(balanceDateStr: string): string {
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
}
