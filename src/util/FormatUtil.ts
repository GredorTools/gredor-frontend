type FormatOptions = {
  removeSign: boolean;
};

export class FormatUtil {
  /**
   * Formaterar en numerisk sträng genom att lägga till mellanslag som
   * tusentalsseparatorer.
   *
   * @param {string} numberAsString - Strängrepresentation av ett nummer som
   * ska formateras.
   * @param {FormatOptions} options - Huruvida tecken (plus/minus) ska tas bort
   * @return {string} Den formaterade numeriska strängen med mellanslag som
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
}
