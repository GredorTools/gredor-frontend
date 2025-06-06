import {
  type TaxonomyItem,
  type TaxonomyItemType,
  TaxonomyManager,
} from "@/util/TaxonomyManager.ts";

export interface Belopprad<T extends TaxonomyItemType = TaxonomyItemType> {
  taxonomyItemName: string;
  type: T;
  egetNamn?: string;
}

export function createBelopprad<T extends TaxonomyItemType>(
  taxonomyItem: TaxonomyItem<T>,
): Belopprad<T> {
  switch (taxonomyItem.properties.type) {
    case "xbrli:stringItemType":
      return {
        taxonomyItemName: taxonomyItem.xmlName,
        type: taxonomyItem.properties.type,
      } as Belopprad<T>;

    case "xbrli:monetaryItemType":
    case "xbrli:decimalItemType":
      return {
        taxonomyItemName: taxonomyItem.xmlName,
        type: taxonomyItem.properties.type,
        beloppNuvarandeAr: "",
        beloppForegaendeAr: "",
      } as Belopprad<T>;

    // TODO
    case "enum:enumerationItemType":
    case "nonnum:domainItemType":
    case "xbrli:pureItemType":
    case "xbrli:sharesItemType":
      alert("Ännu ej implementerat");
      throw new Error(
        `Unsupported taxonomy item data type: ${taxonomyItem.properties.type}`,
      );

    default:
      throw new Error(
        `Unknown taxonomy item data type: ${taxonomyItem.properties.type}`,
      );
  }
}

export function createBeloppradInList(
  taxonomyManager: TaxonomyManager,
  list: Belopprad[],
  taxonomyItem: TaxonomyItem,
  excludedSumRows: string[] = [],
  sort: boolean = true,
) {
  if (
    list.some(
      (belopprad) => belopprad.taxonomyItemName === taxonomyItem.xmlName,
    )
  ) {
    // Finns redan
    return;
  }

  list.push(createBelopprad(taxonomyItem));

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
          possibleSumTaxonomyItem.additionalData.isTotalItem &&
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
        taxonomyManager.getItem(a.taxonomyItemName).rowNumber -
        taxonomyManager.getItem(b.taxonomyItemName).rowNumber,
    );
  }
}

export async function deleteBelopprad(
  taxonomyManager: TaxonomyManager,
  beloppradToDelete: Belopprad,
  from: Belopprad[],
) {
  const taxonomyItemToDelete = taxonomyManager.getItem(
    beloppradToDelete.taxonomyItemName,
  );

  for (let i = 0; i < from.length; i++) {
    const belopprad = from[i];
    const taxonomyItem = taxonomyManager.getItem(belopprad.taxonomyItemName);
    if (taxonomyItem.xmlName === taxonomyItemToDelete.xmlName) {
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
  const taxonomyItem = taxonomyManager.getItem(belopprad.taxonomyItemName);
  if (taxonomyItem.parent) {
    // Hitta föräldern i listan baserat på förälderns ID
    const beloppradParent = from.find(
      (item) => item.taxonomyItemName === taxonomyItem.parent?.xmlName,
    );

    if (beloppradParent) {
      // Kontrollera om föräldern har några kvarvarande barn
      const parentHasChildren = from.some(
        (item) => item.taxonomyItemName === beloppradParent.taxonomyItemName,
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
  const children = from.filter(
    (item) =>
      taxonomyManager.getItem(item.taxonomyItemName).parent?.xmlName ===
      belopprad.taxonomyItemName,
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
