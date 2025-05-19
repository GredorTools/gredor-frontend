export class DocumentUtil {
  /**
   * Extraherar och returnerar CSS-texten för alla CSSStyleRules som används av
   * de angivna DOM-elementen.
   *
   * @param {NodeListOf<Element>} elements - En samling av DOM-element som ska
   * kontrolleras för matchande CSS-regler.
   * @return {string} En sträng som innehåller den sammanfogade CSS-texten för
   * alla matchande regler.
   */
  static getCssTextForUsedRules(elements: NodeListOf<Element>): string {
    const rulesUsed = new Set<CSSStyleRule>();
    for (const sheet of Object.values(document.styleSheets)) {
      for (const rule of Object.values(sheet.cssRules)) {
        for (const element of elements) {
          if (
            rule instanceof CSSStyleRule &&
            element.matches &&
            element.matches(rule.selectorText)
          ) {
            rulesUsed.add(rule);
          }
        }
      }
    }

    let rulesCss = "";
    for (const rule of rulesUsed) {
      rulesCss += rule.cssText + "\n";
    }
    return rulesCss;
  }
}
