import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import { type Reactive, reactive } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import {
  hasBeloppradMonetaryValue,
  isBeloppradMonetary,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";
import {
  hasBeloppradComparableValue,
  isBeloppradComparable,
} from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import {
  hasBeloppradStringValue,
  isBeloppradString,
} from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";
import {
  hasBeloppradTupleValue,
  isBeloppradTuple,
} from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import {
  isTaxonomyItemTuple,
  type LabelType,
  type TaxonomyItem,
  type TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";

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
    case "xbrli:sharesItemType":
    case "enum:enumerationItemType":
      const defaultValue = taxonomyItem.additionalData.isCalculatedItem
        ? "0"
        : "";
      return {
        ...baseBeloppradData,
        beloppNuvarandeAr: defaultValue,
        beloppTidigareAr: [defaultValue, defaultValue, defaultValue],
      } as Belopprad<T>;

    default:
      if (isTaxonomyItemTuple(taxonomyItem)) {
        return {
          ...baseBeloppradData,
          instanser: [],
        } as Belopprad<T>;
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
  belopprad: Reactive<Belopprad<T>> | null = null,
  excludedSumRows: string[] | "all" = [],
  sort: boolean = true,
): Belopprad<T> | undefined {
  if (isTaxonomyItemInBeloppradList(list, taxonomyItem)) {
    // Finns redan
    return;
  }

  if (belopprad == null) {
    belopprad = reactive(createBelopprad(taxonomyItem));
  }
  list.push(belopprad);

  if (taxonomyItem.parent != null && taxonomyItem.parent.level > 0) {
    // Lägg till föräldrar rekursivt
    createBeloppradInList(
      taxonomyManager,
      list,
      taxonomyItem.parent,
      null,
      excludedSumRows,
      false,
    );

    if (excludedSumRows !== "all") {
      // Lägg till summarader
      for (const possibleSumTaxonomyItem of taxonomyItem.root?.childrenFlat ??
        []) {
        if (
          possibleSumTaxonomyItem.additionalData.isCalculatedItem &&
          !excludedSumRows.includes(possibleSumTaxonomyItem.xmlName) &&
          taxonomyManager.calculationProcessor.isConceptIncludedInSum(
            taxonomyItem.xmlName,
            possibleSumTaxonomyItem.xmlName,
          )
        ) {
          createBeloppradInList(
            taxonomyManager,
            list,
            possibleSumTaxonomyItem,
            null,
            excludedSumRows,
            false,
          );
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

export function deleteBelopprad(
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

      // Ta bort abstrakta föräldrar rekursivt om de inte har några kvarvarande barn
      deleteBeloppradAbstractParents(taxonomyManager, belopprad, from);

      // Ta bort summarader som inte har några värden som bygger upp summan
      deleteBeloppradEmptySums(taxonomyManager, belopprad, from);

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

function deleteBeloppradEmptySums(
  taxonomyManager: TaxonomyManager,
  belopprad: Belopprad,
  from: Belopprad[],
): void {
  for (const possibleSumBelopprad of from) {
    if (
      !getTaxonomyItemForBelopprad(taxonomyManager, possibleSumBelopprad)
        .additionalData.isCalculatedItem
    ) {
      continue;
    }

    if (
      !taxonomyManager.calculationProcessor.isConceptIncludedInSum(
        belopprad.taxonomyItemName,
        possibleSumBelopprad.taxonomyItemName,
      )
    ) {
      continue;
    }

    if (
      !taxonomyManager.calculationProcessor.isConceptIncludedInSum(
        from.map((b) => b.taxonomyItemName),
        possibleSumBelopprad.taxonomyItemName,
      )
    ) {
      deleteBelopprad(taxonomyManager, possibleSumBelopprad, from);
    }
  }
}

export function hasBeloppradValue(
  taxonomyManager: TaxonomyManager,
  belopprad: Belopprad,
  arsredovisning: Arsredovisning,
  section: Belopprad[],
  maxNumPreviousYears: number,
): boolean {
  if (isBeloppradMonetary(belopprad)) {
    return hasBeloppradMonetaryValue(
      taxonomyManager,
      belopprad,
      arsredovisning,
      section,
      maxNumPreviousYears,
    );
  } else if (isBeloppradComparable(belopprad)) {
    return hasBeloppradComparableValue(
      belopprad,
      arsredovisning,
      maxNumPreviousYears,
    );
  } else if (isBeloppradString(belopprad)) {
    return hasBeloppradStringValue(belopprad);
  } else if (isBeloppradTuple(belopprad)) {
    return hasBeloppradTupleValue(belopprad);
  } else {
    throw new Error("Unknown belopprad type");
  }
}

export function isSumBeloppradEmpty(
  taxonomyManager: TaxonomyManager,
  sumBelopprad: Belopprad,
  section: Belopprad[],
): boolean {
  if (
    !getTaxonomyItemForBelopprad(taxonomyManager, sumBelopprad).additionalData
      .isCalculatedItem
  ) {
    return false;
  }

  return !taxonomyManager.calculationProcessor.isConceptIncludedInSum(
    section.map((b) => b.taxonomyItemName),
    sumBelopprad.taxonomyItemName,
  );
}
