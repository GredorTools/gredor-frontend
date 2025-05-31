import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";

export interface Belopprad<T extends TaxonomyItemType> {
  taxonomyItem: TaxonomyItem<T>;
  egetNamn?: string;
}

export function createBelopprad<T extends TaxonomyItemType>(
  taxonomyItem: TaxonomyItem<T>,
): Belopprad<T> {
  switch (taxonomyItem.datatyp) {
    case "xbrli:stringItemType":
      return {
        taxonomyItem: taxonomyItem,
      } as Belopprad<T>;

    case "xbrli:monetaryItemType":
    case "xbrli:decimalItemType":
      return {
        taxonomyItem: taxonomyItem,
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
        `Unsupported taxonomy item data type: ${taxonomyItem.datatyp}`,
      );

    default:
      throw new Error(
        `Unknown taxonomy item data type: ${taxonomyItem.datatyp}`,
      );
  }
}

export function deleteBelopprad(
  beloppradToDelete: Belopprad<TaxonomyItemType>,
  from: Belopprad<TaxonomyItemType>[],
): void {
  for (let i = 0; i < from.length; i++) {
    const belopprad = from[i];
    if (belopprad.taxonomyItem.id === beloppradToDelete.taxonomyItem.id) {
      // Ta bort raden
      from.splice(i, 1);

      // Radera abstrakta föräldrar rekursivt om de inte har några kvarvarande barn
      deleteBeloppradAbstractParents(belopprad, from);

      // Ta bort barnen rekursivt
      deleteBeloppradChildren(belopprad, from);

      // Klar
      return;
    }
  }
}

function deleteBeloppradAbstractParents(
  belopprad: Belopprad<TaxonomyItemType>,
  from: Belopprad<TaxonomyItemType>[],
) {
  const parentId = belopprad.taxonomyItem.__ParentId;
  if (parentId) {
    // Hitta föräldern i listan baserat på förälderns ID
    const parent = from.find(
      (item) =>
        item.taxonomyItem.abstrakt === "true" &&
        item.taxonomyItem.id === parentId,
    );

    if (parent) {
      // Kontrollera om föräldern har några kvarvarande barn
      const parentHasChildren = from.some(
        (item) => item.taxonomyItem.__ParentId === parentId,
      );
      if (!parentHasChildren) {
        // Om föräldern inte har några barn kvar, ta bort föräldern
        const index = from.indexOf(parent);
        if (index !== -1) {
          from.splice(index, 1);
        }

        // Kontrollera nästa nivå av föräldrar rekursivt
        deleteBeloppradAbstractParents(parent, from);
      }
    }
  }
}

function deleteBeloppradChildren(
  belopprad: Belopprad<TaxonomyItemType>,
  from: Belopprad<TaxonomyItemType>[],
): void {
  // Hitta barn till den aktuella beloppraden
  const children = from.filter(
    (item) => item.taxonomyItem.__ParentId === belopprad.taxonomyItem.id,
  );

  for (const child of children) {
    // Ta bort barnet från listan
    const index = from.indexOf(child);
    if (index !== -1) {
      from.splice(index, 1);
    }

    // Ta bort barnets barn rekursivt
    deleteBeloppradChildren(child, from);
  }
}
