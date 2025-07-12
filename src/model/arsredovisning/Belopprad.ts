import {
  type LabelType,
  type TaxonomyItem,
  type TaxonomyItemType,
  TaxonomyManager,
} from "@/util/TaxonomyManager.ts";
import { reactive } from "vue";

export interface Belopprad<T extends TaxonomyItemType = TaxonomyItemType> {
  taxonomyItemName: string;
  labelType?: LabelType;
  parentTaxonomyItemName?: string;
  type: T;
}

export function createBelopprad<T extends TaxonomyItemType>(
  taxonomyItem: TaxonomyItem<T>,
): Belopprad<T> {
  const baseBeloppradData: Belopprad<T> = {
    taxonomyItemName: taxonomyItem.xmlName,
    labelType: taxonomyItem.additionalData.labelType,
    parentTaxonomyItemName: taxonomyItem.parent?.xmlName,
    type: taxonomyItem.properties.type,
  };

  switch (taxonomyItem.properties.type) {
    case "xbrli:stringItemType":
      return baseBeloppradData;

    case "xbrli:monetaryItemType":
    case "xbrli:decimalItemType":
    case "xbrli:pureItemType":
    case "xbrli:sharesItemType": {
      const defaultValue = taxonomyItem.additionalData.isCalculatedItem
        ? "0"
        : "";
      return {
        ...baseBeloppradData,
        beloppNuvarandeAr: defaultValue,
        beloppTidigareAr: [defaultValue, defaultValue, defaultValue],
      } as Belopprad<T>;
    }

    // TODO
    case "enum:enumerationItemType":
    case "nonnum:domainItemType":
      alert("Ännu ej implementerat");
      throw new Error(
        `Unsupported taxonomy item data type: ${taxonomyItem.properties.type}`,
      );

    default:
      if (taxonomyItem.properties.type.endsWith("@anonymousType")) {
        return baseBeloppradData;
      }

      throw new Error(
        `Unknown taxonomy item data type: ${taxonomyItem.properties.type}`,
      );
  }
}

export function createBeloppradInList<T extends TaxonomyItemType>(
  taxonomyManager: TaxonomyManager,
  list: Belopprad[],
  taxonomyItem: TaxonomyItem<T>,
  excludedSumRows: string[] = [],
  sort: boolean = true,
): Belopprad<T> | undefined {
  if (isTaxonomyItemInBeloppradList(list, taxonomyItem)) {
    // Finns redan
    return;
  }

  const belopprad = reactive(createBelopprad(taxonomyItem));
  list.push(belopprad);

  if (taxonomyItem.parent != null && taxonomyItem.parent.level > 0) {
    // Lägg till föräldrar rekursivt
    createBeloppradInList(
      taxonomyManager,
      list,
      taxonomyItem.parent,
      excludedSumRows,
      false,
    );

    if (taxonomyItem.parent.parent != null) {
      // Lägg till summarader
      for (const possibleSumTaxonomyItem of taxonomyItem.parent.parent
        .children) {
        if (
          possibleSumTaxonomyItem.additionalData.isCalculatedItem &&
          possibleSumTaxonomyItem.rowNumber > taxonomyItem.rowNumber &&
          possibleSumTaxonomyItem.level === taxonomyItem.level - 1 &&
          !excludedSumRows.includes(possibleSumTaxonomyItem.xmlName)
        ) {
          createBeloppradInList(
            taxonomyManager,
            list,
            possibleSumTaxonomyItem,
            excludedSumRows,
            false,
          );
          break;
        }
      }
    }
  }

  // Sortera
  if (sort) {
    list.sort(
      (a, b) =>
        getTaxonomyItemForBelopprad(taxonomyManager, a).rowNumber -
        getTaxonomyItemForBelopprad(taxonomyManager, b).rowNumber,
    );
  }

  return belopprad as Belopprad<T>;
}

export function getOrCreateBeloppradInList<T extends TaxonomyItemType>(
  taxonomyManager: TaxonomyManager,
  list: Belopprad[],
  taxonomyItem: TaxonomyItem<T>,
): Belopprad<T> {
  const existingBelopprad = list.find((belopprad) =>
    isBeloppradCorrespondsToTaxonomyItem(belopprad, taxonomyItem),
  );
  if (existingBelopprad) {
    return existingBelopprad as Belopprad<T>;
  } else {
    const createdBelopprad = createBeloppradInList(
      taxonomyManager,
      list,
      taxonomyItem,
    );
    if (createdBelopprad == null) {
      throw new Error("Belopprad was not created for unknown reason");
    }
    return createdBelopprad;
  }
}

export function isTaxonomyItemInBeloppradList(
  list: Belopprad[],
  taxonomyItem: TaxonomyItem,
): boolean {
  return list.some((belopprad) =>
    isBeloppradCorrespondsToTaxonomyItem(belopprad, taxonomyItem),
  );
}

export function isBeloppradInTaxonomyItemList(
  list: TaxonomyItem[],
  belopprad: Belopprad,
): boolean {
  return list.some((taxonomyItem) =>
    isBeloppradCorrespondsToTaxonomyItem(belopprad, taxonomyItem),
  );
}

export function isBeloppradCorrespondsToTaxonomyItem(
  belopprad: Belopprad,
  taxonomyItem: TaxonomyItem | undefined,
): boolean {
  return (
    taxonomyItem != null &&
    taxonomyItem.xmlName === belopprad.taxonomyItemName &&
    taxonomyItem.additionalData.labelType == belopprad.labelType &&
    taxonomyItem.parent?.xmlName == belopprad.parentTaxonomyItemName
  );
}

export function getTaxonomyItemForBelopprad(
  taxonomyManager: TaxonomyManager,
  belopprad: Belopprad,
): TaxonomyItem {
  return taxonomyManager.getItemByCompleteInfo(
    belopprad.taxonomyItemName,
    belopprad.labelType,
    belopprad.parentTaxonomyItemName,
  );
}

export async function deleteBelopprad(
  taxonomyManager: TaxonomyManager,
  beloppradToDelete: Belopprad,
  from: Belopprad[],
) {
  const taxonomyItemToDelete = getTaxonomyItemForBelopprad(
    taxonomyManager,
    beloppradToDelete,
  );

  for (let i = 0; i < from.length; i++) {
    const belopprad = from[i];
    const taxonomyItem = getTaxonomyItemForBelopprad(
      taxonomyManager,
      belopprad,
    );
    if (
      taxonomyItem.xmlName === taxonomyItemToDelete.xmlName &&
      taxonomyItem.additionalData.labelType ===
        taxonomyItemToDelete.additionalData.labelType
    ) {
      // Ta bort raden
      from.splice(i, 1);

      // Radera abstrakta föräldrar rekursivt om de inte har några kvarvarande barn
      deleteBeloppradAbstractParents(taxonomyManager, belopprad, from);

      // Ta bort barnen rekursivt
      deleteBeloppradChildren(taxonomyManager, belopprad, from);

      // Klar
      return;
    }
  }
}

function deleteBeloppradAbstractParents(
  taxonomyManager: TaxonomyManager,
  belopprad: Belopprad,
  from: Belopprad[],
) {
  const taxonomyItem = getTaxonomyItemForBelopprad(taxonomyManager, belopprad);
  if (taxonomyItem.parent) {
    // Hitta föräldern i listan baserat på förälderns ID
    const beloppradParent = from.find((item) =>
      isBeloppradCorrespondsToTaxonomyItem(item, taxonomyItem.parent),
    );

    if (beloppradParent) {
      // Kontrollera om föräldern har några kvarvarande barn
      const parentHasChildren = from.some((item) =>
        isBeloppradCorrespondsToTaxonomyItem(
          beloppradParent,
          getTaxonomyItemForBelopprad(taxonomyManager, item).parent,
        ),
      );
      if (!parentHasChildren) {
        // Om föräldern inte har några barn kvar, ta bort föräldern
        const index = from.indexOf(beloppradParent);
        if (index !== -1) {
          from.splice(index, 1);
        }

        // Kontrollera nästa nivå av föräldrar rekursivt
        deleteBeloppradAbstractParents(taxonomyManager, beloppradParent, from);
      }
    }
  }
}

function deleteBeloppradChildren(
  taxonomyManager: TaxonomyManager,
  belopprad: Belopprad,
  from: Belopprad[],
): void {
  // Hitta barn till den aktuella beloppraden
  const children = from.filter((item) =>
    isBeloppradCorrespondsToTaxonomyItem(
      belopprad,
      getTaxonomyItemForBelopprad(taxonomyManager, item).parent,
    ),
  );

  for (const child of children) {
    // Ta bort barnet från listan
    const index = from.indexOf(child);
    if (index !== -1) {
      from.splice(index, 1);
    }

    // Ta bort barnets barn rekursivt
    deleteBeloppradChildren(taxonomyManager, child, from);
  }
}
