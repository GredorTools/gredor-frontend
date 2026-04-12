import Decimal from "decimal.js";

/**
 * Jämför två numeriska strängar genom att ta hänsyn till angivet antal
 * decimaler.
 *
 * Funktionen normaliserar båda talen till samma skalnivå innan jämförelsen
 * görs, vilket gör att värden som representerar samma tal men har olika
 * decimalprecision kan betraktas som lika.
 *
 * @param num1 - Första talet som sträng
 * @param num1Decimals - Antal decimaler för `num1`, eller "INF" för
 * obegränsad precision
 * @param num2 - Andra talet som sträng
 * @param num2Decimals - Antal decimaler för `num2`, eller "INF" för
 * obegränsad precision
 * @returns true om talen är lika efter normalisering, annars false
 */
export function equalsWithDecimals(
  num1: string,
  num1Decimals: string,
  num2: string,
  num2Decimals: string,
): boolean {
  const num1Scale =
    num1Decimals === "INF" ? 0 : -1 * Number.parseInt(num1Decimals, 10);
  const num2Scale =
    num2Decimals === "INF" ? 0 : -1 * Number.parseInt(num2Decimals, 10);
  const finalScale = -1 * Math.max(num1Scale, num2Scale);

  const normalizedNum1 = Decimal(num1.replace(",", "."))
    .mul(Decimal(10).pow(finalScale))
    .round();

  const normalizedNum2 = Decimal(num2.replace(",", "."))
    .mul(Decimal(10).pow(finalScale))
    .round();

  return normalizedNum1.eq(normalizedNum2);
}
