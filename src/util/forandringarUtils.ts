import {
  type BeloppradMonetary,
  isBeloppradMonetary
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { type TaxonomyItem, TaxonomyManager } from "@/util/TaxonomyManager.ts";
import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
  isBeloppradCorrespondsToTaxonomyItem,
  isTaxonomyItemInBeloppradList
} from "@/model/arsredovisning/Belopprad.ts";

/**
 * Representerar en cell i tabellen för förändringar i eget kapital.
 * Varje cell kan antingen vara null eller innehålla en belopprad med
 * tillhörande taxonomiinformation.
 */
type TableCell = {
  belopprad: BeloppradMonetary;
  taxonomyItem: TaxonomyItem;
} | null;

/**
 * Konverterar förändringar i eget kapital till ett tabellformat för
 * presentation. Strukturerar om data från en taxonomibaserad hierarkisk
 * struktur till en tvådimensionell tabell där raderna representerar olika
 * förändringstyper och kolumnerna olika kapitalkomponenter.
 *
 * @param taxonomyManager - Hanterar taxonomin och ger åtkomst till
 * taxonomiobjekt
 * @param groupTaxonomyItem - Rot-taxonomiobjektet som definierar
 * gruppstrukturen för tabellen
 * @param belopprader - Lista med monetära belopprader som ska visas i tabellen
 * @returns Tabellrepresentation med radnamn, kolumnnamn och cell-data
 */
export function getForandringarAsTable(
  taxonomyManager: TaxonomyManager,
  groupTaxonomyItem: TaxonomyItem,
  belopprader: Belopprad[],
) {
  // Extraherar rader från taxonomiträdet och skapar en platt struktur för enklare hantering
  const rows = groupTaxonomyItem.children
    .map((c) => [c.children[0], ...c.children[1].children, c.children[2]])
    .flat();

  // Filtrerar ut endast de rader som har motsvarande belopprader i indata
  const cells = rows.filter((c) =>
    isTaxonomyItemInBeloppradList(belopprader, c),
  );

  // Skapar unika radnamn sorterade med ingående belopp överst och utgående längst ner
  const rowNames = [
    ...new Set(
      cells
        .sort((a, b) => {
          if (a.additionalData.labelType === "periodStartLabel") return -1;
          if (b.additionalData.labelType === "periodStartLabel") return 1;
          if (a.additionalData.labelType === "periodEndLabel") return 1;
          if (b.additionalData.labelType === "periodEndLabel") return -1;
          return 0;
        })
        .map((c) => c.additionalData.displayLabel),
    ),
  ];

  // Extraherar kolumnnamn från huvudgrupperna i taxonomin
  const columnNames = groupTaxonomyItem.children
    .filter((c) => isTaxonomyItemInBeloppradList(belopprader, c))
    .map((c) => c.additionalData.displayLabel);

  // Initierar resultatmatrisen med null-värden
  const result: TableCell[][] = Array.from({ length: rowNames.length }, () =>
    Array(columnNames.length).fill(null),
  );

  // Mappar belopprader till rätt celler i resultatmatrisen
  for (const belopprad of belopprader) {
    if (!isBeloppradMonetary(belopprad)) {
      continue;
    }

    const beloppradTaxonomyItem = getTaxonomyItemForBelopprad(
      taxonomyManager,
      belopprad,
    );

    const rowIndex = rowNames.findIndex(
      (label) =>
        label ===
        rows.find((c) => isBeloppradCorrespondsToTaxonomyItem(belopprad, c))
          ?.additionalData.displayLabel,
    );

    const columnIndex = columnNames.findIndex(
      (label) =>
        label ===
        groupTaxonomyItem.children.find(
          (c) =>
            c.xmlName === beloppradTaxonomyItem.parent?.xmlName || // Om cell är belopp vid årets ingång/utgång
            c.xmlName === beloppradTaxonomyItem.parent?.parent?.xmlName, // Annars
        )?.additionalData.displayLabel,
    );

    if (rowIndex !== -1 && columnIndex !== -1) {
      result[rowIndex][columnIndex] = {
        belopprad,
        taxonomyItem: beloppradTaxonomyItem,
      };
    }
  }

  return {
    rowNames,
    columnNames,
    table: result,
  };
}
