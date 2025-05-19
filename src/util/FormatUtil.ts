export class FormatUtil {
  static formatNumber(numberAsString: string): string {
    return numberAsString
      .trim()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
  }
}
