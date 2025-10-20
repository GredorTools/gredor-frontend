import * as cheerio from "cheerio";
import { Element } from "domhandler";
import xmlFormat from "xml-formatter";
import Decimal from "decimal.js";

/**
 * Enkel konverterare som tar in ett iXBRL-dokument och transfomerar det till
 * ett XBRL-dokument.
 *
 * @param ixbrl - iXBRL-dokument som en sträng
 * @returns XBRL-dokument som en sträng
 */
export function convertIxbrlToXbrl(ixbrl: string): string {
  const xbrlDoc = cheerio.load('<?xml version="1.0" encoding="UTF-8"?>', {
    xml: true,
    decodeEntities: false,
  });

  const ixbrlDoc = cheerio.load(ixbrl, {
    xml: true,
    decodeEntities: false,
  });

  const xbrlRoot = xbrlDoc("<xbrli:xbrl></xbrli:xbrl>");
  Object.entries(ixbrlDoc("html").attr())
    .filter(([key]) => !["xmlns", "xmlns:ix", "xmlns:ixt"].includes(key))
    .forEach(([key, value]) => {
      xbrlRoot.attr(key, value);
    });

  function handleRegularElement(el: Element) {
    const xmlElementName = el.attribs["name"];

    const element = xbrlDoc(`<${xmlElementName}></${xmlElementName}>`);
    ["contextRef", "unitRef", "decimals"].forEach((key) => {
      if (el.attribs[key]) {
        element.attr(key, el.attribs[key]);
      }
    });

    let text = ixbrlDoc(el).text();
    if (el.attribs["continuedAt"]) {
      text += ixbrlDoc(`#${el.attribs["continuedAt"]}`).text();
    }
    if (el.attribs["format"] === "ixt:numspacecomma") {
      text = text.replace(/ /g, "");
    }
    if (el.attribs["sign"] === "-") {
      text = "-" + text;
    }
    if (el.attribs["scale"]) {
      text = Decimal(text).mul(Decimal(10).pow(el.attribs["scale"])).toString();
    }
    element.text(text);

    return element;
  }

  const dataElements = ixbrlDoc("ix\\:nonNumeric, ix\\:nonFraction, ix\\:tuple")
    .map((i, el) => {
      if (el.tagName === "ix:tuple") {
        const xmlElementName = el.attribs["name"];
        const tupleElement = xbrlDoc(`<${xmlElementName}></${xmlElementName}>`);
        const tupleChildren = Array.from(
          ixbrlDoc(`[tupleRef='${el.attribs["tupleID"]}']`),
        ).map(handleRegularElement);
        tupleElement.append(tupleChildren);
        return tupleElement;
      }

      if (el.attribs["tupleRef"]) {
        return;
      }

      return handleRegularElement(el);
    })
    .get();

  xbrlRoot.append(ixbrlDoc("ix\\:references").children());
  xbrlRoot.append(dataElements);
  xbrlRoot.append(ixbrlDoc("ix\\:resources").children());
  xbrlRoot.find("*").each((i, el) => {
    for (const key of Object.keys(el.attribs)) {
      if (key.startsWith("xmlns:")) {
        delete el.attribs[key];
      }
    }
  });
  xbrlDoc.root().append(xbrlRoot);

  return xmlFormat(xbrlDoc.xml(), {
    collapseContent: true,
  });
}
