import xmlFormat from "xml-formatter";
import { getConfigValue } from "@/util/configUtils.ts";

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
 * @returns En sträng som representerar det konverterade iXBRL-innehållet.
 */
export async function convertVueHTMLToiXBRL(
  rootElement: HTMLElement,
  title: string,
): Promise<string> {
  const doc = new DOMParser().parseFromString(
    rootElement.innerHTML,
    "text/html",
  );

  // Lägg till CSS
  let rulesCss = await getCssTextForUsedRules(doc.querySelectorAll("*"));

  // Omvandla CSS-attribut som inte är kompatibla med wkhtmltopdf som Bolagsverket använder
  rulesCss = rulesCss.replace(
    /([^A-Za-z-])break-after: page/g,
    "$1page-break-after: always",
  );
  rulesCss = rulesCss.replace(
    /([^A-Za-z-])break-inside: /g,
    "$1page-break-inside: ",
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
      for (let index = oldElement.attributes.length - 1; index >= 0; --index) {
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
    ["contextRef", "continuedAt", "tupleRef"],
    "http://www.xbrl.org/2013/inlineXBRL",
  );
  fixTag(
    "ix:nonFraction",
    ["contextRef", "tupleRef", "unitRef"],
    "http://www.xbrl.org/2013/inlineXBRL",
  );
  fixTag("ix:tuple", ["tupleID"], "http://www.xbrl.org/2013/inlineXBRL");
  fixTag("link:schemaRef", [], "http://www.xbrl.org/2003/linkbase");
  fixTag("xbrli:startDate", [], "http://www.xbrl.org/2003/instance");
  fixTag("xbrli:endDate", [], "http://www.xbrl.org/2003/instance");

  let version = __APP_VERSION__;
  const environmentName = getConfigValue("VITE_ENV_NAME");
  if (environmentName) {
    version = `${__APP_VERSION__} ${environmentName}`;
  }

  // Skapa slutlig HTML
  doc.head.innerHTML += `
      <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
      <meta name="programvara" content="Gredor" />
      <meta name="programversion" content="${version}" />
      <title>${title}</title>
      <style type="text/css">${rulesCss}</style>
    `;
  let xhtml = new XMLSerializer().serializeToString(doc);
  xhtml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xhtml;
  xhtml = xhtml.replace(
    '<html xmlns="http://www.w3.org/1999/xhtml">',
    '<html xmlns="http://www.w3.org/1999/xhtml" ' +
      'xmlns:iso4217="http://www.xbrl.org/2003/iso4217" ' +
      'xmlns:ixt="http://www.xbrl.org/inlineXBRL/transformation/2010-04-20" ' +
      'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
      'xmlns:link="http://www.xbrl.org/2003/linkbase" ' +
      'xmlns:xbrli="http://www.xbrl.org/2003/instance" ' +
      'xmlns:ix="http://www.xbrl.org/2013/inlineXBRL" ' +
      'xmlns:se-gen-base="http://www.taxonomier.se/se/fr/gen-base/2021-10-31" ' +
      'xmlns:se-cd-base="http://www.taxonomier.se/se/fr/cd-base/2021-10-31" ' +
      'xmlns:se-bol-base="http://www.bolagsverket.se/se/fr/comp-base/2020-12-01" ' +
      'xmlns:se-k2-type="http://www.taxonomier.se/se/fr/k2/datatype" ' +
      'xmlns:se-mem-base="http://www.taxonomier.se/se/fr/mem-base/2021-10-31" ' +
      'xmlns:se-gaap-ext="http://www.taxonomier.se/se/fr/gaap/gaap-ext/2021-10-31">',
  );
  xhtml = xmlFormat(xhtml, { collapseContent: true });

  // Ta bort tomrum kring och inklusive <!-- @delete whitespace -->
  // för att fixa rendrering i XHTML i de aktuella fallen
  xhtml = xhtml.replace(/\s*<!--\s*@delete-whitespace\s?.*?-->\s*/g, "");

  // Fixa ">" blir felaktigt "&gt;" i style-tagg
  xhtml = xhtml.replace(
    /(<style[^>]*>)([\s\S]*?)(<\/style>)/g,
    (match, openTag, content, closeTag) => {
      return `${openTag}${content.replace(/&gt;/g, ">")}${closeTag}`;
    },
  );

  // Returnera
  return xhtml;
}

/**
 * Extraherar och returnerar CSS-texten för alla CSSStyleRules som används av
 * de angivna DOM-elementen.
 *
 * @param elements - En samling av DOM-element som ska kontrolleras för
 * matchande CSS-regler.
 * @returns En sträng som innehåller den sammanfogade CSS-texten för alla
 * matchande regler.
 */
async function getCssTextForUsedRules(
  elements: NodeListOf<Element>,
): Promise<string> {
  const rulesUsed = new Set<CSSRule>();
  const fontFamiliesUsed = new Set<string>();

  function processRule(
    rule: CSSRule,
    styleRule: CSSStyleRule,
    element: Element,
  ) {
    if (element.matches && element.matches(styleRule.selectorText)) {
      rulesUsed.add(rule);

      if (styleRule.style.fontFamily) {
        const fontFamilies = styleRule.style.fontFamily
          .split(",")
          .map((fontFamily) => fontFamily.trim().replace(/"/g, ""));
        for (const fontFamily of fontFamilies) {
          fontFamiliesUsed.add(fontFamily);
        }
      }
    }
  }

  for (const sheet of Object.values(document.styleSheets)) {
    for (const rule of Object.values(sheet.cssRules)) {
      for (const element of elements) {
        if (rule instanceof CSSStyleRule) {
          // Alla vanliga style-rules ska behandlas
          processRule(rule, rule, element);
        } else if (
          rule instanceof CSSMediaRule &&
          Array.from(rule.media).some((media) => media === "screen")
        ) {
          for (const subrule of rule.cssRules) {
            if (
              subrule instanceof CSSStyleRule &&
              subrule.selectorText != "body"
            ) {
              // Alla style-rules i media screen-regler ska behandlas, förutom
              // de som har "body" som selektor - för att det ska bli snyggt när
              // årsredovisningen visas i Bolagsverkets e-tjänst (ej PDF)
              processRule(rule, subrule, element);
            }
          }
        }
      }
    }
  }

  let rulesCss = "";
  for (const rule of rulesUsed) {
    rulesCss += rule.cssText + "\n";
  }

  const fontReferencesInDocument = await getFontReferencesInDocument();
  for (const fontReference of fontReferencesInDocument) {
    if (fontFamiliesUsed.has(fontReference.fontFamily)) {
      rulesCss += `
        @font-face {
            font-family: "${fontReference.fontFamily}";
            font-weight: ${fontReference.fontWeight};
            font-style: ${fontReference.fontStyle};
            src: ${fontReference.srcBase64};
            unicode-range: "${fontReference.unicodeRange}";
        }`;
    }
  }

  return rulesCss;
}

/**
 * Hämtar och returnerar referenser till alla typsnitt som används i
 * dokumentet. Parserar @font-face-regler från alla tillgängliga
 * CSS-stilmallar i dokumentet och extraherar detaljer som fontfamilj, vikt,
 * stil, källa (src) och unicode-område.
 *
 * @returns En array med objekt som innehåller typsnittsinformation:
 * - fontFamily: Namnet på typsnittet.
 * - fontWeight: Vikten för typsnittet, t.ex. 400 för normal vikt.
 * - fontStyle: Stilen för typsnittet, t.ex. "normal", "italic".
 * - src: Källa (URL) till typsnittet.
 * - srcBase64: Källa till typsnittet i base64-format.
 * - unicodeRange: Det unicode-intervall som typsnittet gäller för.
 */
async function getFontReferencesInDocument() {
  // Ursprunglig källa: https://stackoverflow.com/a/75857870

  const fontFiles: Array<{
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    src: string;
    srcBase64: string;
    unicodeRange: string;
  }> = [];

  // Gå igenom varje stilmall som är tillgänglig i dokumentet
  for (const styleSheet of document.styleSheets) {
    const cssRules = styleSheet.cssRules;

    // Gå igenom varje CSS-regel i stilmallen
    for (let i = 0; i < cssRules.length; i++) {
      const rule = cssRules[i];

      // Kontrollera om regeln är en CSSFontFaceRule (dvs en @font-face-regel)
      if (rule instanceof CSSFontFaceRule) {
        const style = rule.style;

        // Hämta och bearbeta egenskaper från font-face-regeln
        const fontFamily = style
          .getPropertyValue("font-family")
          .replace(/"/g, ""); // Ta bort eventuella citationstecken
        const fontWeight = style.getPropertyValue("font-weight");
        const fontStyle = style.getPropertyValue("font-style");
        const src = style.getPropertyValue("src");
        const unicodeRange = style.getPropertyValue("unicode-range");

        // Konvertera till base64
        const urlMatches = src.split(",")[0]?.match(/\(([^)]+)\)/);
        const url = urlMatches ? urlMatches[1].replace(/"/g, "") : "";
        const response = await fetch(url);
        const blob = await response.blob();
        const srcBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(`url(${reader.result as string})`);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Lägg till typsnittsinformationen i resultatlistan
        fontFiles.push({
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          src: src,
          srcBase64: srcBase64,
          unicodeRange: unicodeRange,
        });
      }
    }
  }

  return fontFiles;
}
