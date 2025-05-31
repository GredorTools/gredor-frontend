import xmlFormat from "xml-formatter";

export class DocumentUtil {
  /**
   * Extraherar och returnerar CSS-texten för alla CSSStyleRules som används av
   * de angivna DOM-elementen.
   *
   * @param elements - En samling av DOM-element som ska kontrolleras för
   * matchande CSS-regler.
   * @return En sträng som innehåller den sammanfogade CSS-texten för alla
   * matchande regler.
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

  /**
   * Konverterar innehållet i ett Vue HTML-element till iXBRL-format.
   *
   * Funktionens syfte är att bearbeta innehållet i ett HTML-element skapat av Vue,
   * omvandla det så att det följer iXBRL-standarder och returnera resultatet som
   * en formaterad XHTML-sträng.
   *
   * @param rootElement - HTML-elementet som ska konverteras. Elementets innehåll
   * bearbetas och omvandlas till iXBRL-format.
   * @param title - Titeln på det resulterande iXBRL-dokumentet.
   * @return En sträng som representerar det konverterade iXBRL-innehållet.
   */
  static convertVueHTMLToiXBRL(
    rootElement: HTMLElement,
    title: string,
  ): string {
    const doc = new DOMParser().parseFromString(
      rootElement.innerHTML,
      "text/html",
    );

    // Lägg till CSS
    let rulesCss = DocumentUtil.getCssTextForUsedRules(
      doc.querySelectorAll("*"),
    );

    // Omvandla CSS-attribut som inte är kompatibla med wkhtmltopdf som Bolagsverket använder
    rulesCss = rulesCss.replace(
      /break-after: page/g,
      "page-break-after: always",
    );

    // Omvandla attribut som börjar på "data-" eftersom de inte är giltig XHTML/iXBRL
    for (const element of doc.querySelectorAll("*")) {
      for (const attribute of [...element.attributes]) {
        if (attribute.name.startsWith("data-")) {
          if (!element.tagName.includes(":")) {
            // För rena HTML-element lägger vi på attributnamnet som en klass
            element.classList.add(attribute.name);
          }
          element.removeAttribute(attribute.name);
        }
      }
    }
    rulesCss = rulesCss.replace(/\[(data-.+?)]/g, ".$1");

    // Fixa versalisering i taggar och attribut (som blir fel pga att vi kör HTML5 i gui:t)
    function fixTag(
      tagName: string,
      attributeNamesToFix: string[],
      namespaceURI: string,
    ) {
      for (const oldElement of [
        ...doc.getElementsByTagName(tagName.toLowerCase()),
      ]) {
        const newElement = document.createElementNS(namespaceURI, tagName);

        // Copy the children
        while (oldElement.firstChild) {
          newElement.appendChild(oldElement.firstChild); // *Moves* the child
        }

        // Copy the attributes
        for (
          let index = oldElement.attributes.length - 1;
          index >= 0;
          --index
        ) {
          let attributeName = oldElement.attributes[index].name;
          for (const fixedAttributeName of attributeNamesToFix) {
            if (attributeName === fixedAttributeName.toLowerCase()) {
              attributeName = fixedAttributeName;
            }
          }
          newElement.setAttribute(
            attributeName,
            oldElement.attributes[index].value,
          );
        }

        // Replace it
        oldElement.parentNode?.replaceChild(newElement, oldElement);
      }
    }

    fixTag(
      "ix:nonNumeric",
      ["contextRef"],
      "http://www.xbrl.org/2013/inlineXBRL",
    );
    fixTag(
      "ix:nonFraction",
      ["contextRef", "unitRef"],
      "http://www.xbrl.org/2013/inlineXBRL",
    );
    fixTag("link:schemaRef", [], "http://www.xbrl.org/2003/linkbase");
    fixTag("xbrli:startDate", [], "http://www.xbrl.org/2003/instance");
    fixTag("xbrli:endDate", [], "http://www.xbrl.org/2003/instance");

    // Skapa slutlig HTML
    doc.head.innerHTML += `
      <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
      <meta name="programvara" content="Gredor" />
      <meta name="programversion" content="${import.meta.env.VITE_APP_VERSION}" />
      <title>${title}</title>
      <style type="text/css">${rulesCss}</style>
    `;
    let xhtml = new XMLSerializer().serializeToString(doc);
    xhtml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xhtml;
    xhtml = xhtml.replace(
      '<html xmlns="http://www.w3.org/1999/xhtml">',
      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:iso4217="http://www.xbrl.org/2003/iso4217" xmlns:ixt="http://www.xbrl.org/inlineXBRL/transformation/2010-04-20" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL" xmlns:se-gen-base="http://www.taxonomier.se/se/fr/gen-base/2017-09-30" xmlns:se-cd-base="http://www.taxonomier.se/se/fr/cd-base/2017-09-30" xmlns:se-k2-type="http://www.taxonomier.se/se/fr/k2/datatype">',
    );
    return xmlFormat(xhtml, { collapseContent: true });
  }
}
