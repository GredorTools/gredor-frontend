export class FormatUtil {
  /**
   * Formaterar en numerisk sträng genom att lägga till mellanslag som
   * tusentalsseparatorer.
   *
   * @param {string} numberAsString - Strängrepresentation av ett nummer som
   * ska formateras.
   * @return {string} Den formaterade numeriska strängen med mellanslag som
   * tusentalsseparator.
   */
  static formatNumber(numberAsString: string): string {
    return numberAsString
      .trim()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
  }
}
