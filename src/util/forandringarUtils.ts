import {
  type BeloppradMonetary,
  isBeloppradMonetary,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import { type TaxonomyItem, TaxonomyManager } from "@/util/TaxonomyManager.ts";

type TableCell = {
  belopprad: BeloppradMonetary;
  taxonomyItem: TaxonomyItem;
} | null;

export function getForandringarAsTable(
  taxonomyManager: TaxonomyManager,
  groupTaxonomyItem: TaxonomyItem,
  belopprader: BeloppradMonetary[],
) {
  const rows = groupTaxonomyItem.children
    .map((c) => [c.children[0], ...c.children[1].children, c.children[2]])
    .flat();

  const cells = rows.filter((c) =>
    belopprader.some((belopprad) => belopprad.taxonomyItemName === c.xmlName),
  );

  const rowNames = [
    ...new Set(cells.map((c) => c.additionalData.displayLabel)),
  ];

  const columnNames = groupTaxonomyItem.children
    .filter((c) =>
      belopprader.some((belopprad) => belopprad.taxonomyItemName === c.xmlName),
    )
    .map((c) => c.additionalData.displayLabel);

  const result: TableCell[][] = Array.from({ length: rowNames.length }, () =>
    Array(columnNames.length).fill(null),
  );

  for (const belopprad of belopprader) {
    if (!isBeloppradMonetary(belopprad)) {
      continue;
    }

    const beloppradTaxonomyItem = taxonomyManager.getItem(
      belopprad.taxonomyItemName,
    );

    const rowIndex = rowNames.findIndex(
      (label) =>
        label ===
        rows.find((c) => c.xmlName === belopprad.taxonomyItemName)
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
