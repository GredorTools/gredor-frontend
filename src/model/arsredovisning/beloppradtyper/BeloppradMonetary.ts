import {
  type Belopprad,
  getTaxonomyItemForBelopprad,
  isSumBeloppradEmpty,
} from "@/model/arsredovisning/Belopprad.ts";
import {
  type CalculationConceptValue,
  CalculationProcessor,
} from "@/util/CalculationProcessor.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type { TaxonomyManager } from "@/util/TaxonomyManager.ts";

export type BeloppradMonetary =
  BaseBeloppradComparable<"xbrli:monetaryItemType">;

export function isBeloppradMonetary(
  belopprad: Belopprad,
): belopprad is BeloppradMonetary {
  return belopprad.type === "xbrli:monetaryItemType";
}

export function calculateValuesIntoBelopprad(
  calculationProcessor: CalculationProcessor,
  belopprader: Belopprad[],
  resultBelopprad: BeloppradMonetary,
): void {
  const conceptValuesNuvarandeAr: CalculationConceptValue[] = belopprader.map(
    (belopprad) => {
      return {
        conceptName: belopprad.taxonomyItemName,
        value: isBeloppradMonetary(belopprad)
          ? parseInt(belopprad.beloppNuvarandeAr)
          : 0,
      };
    },
  );

  const conceptValuesTidigareArList: CalculationConceptValue[][] =
    resultBelopprad.beloppTidigareAr.map((_, i) =>
      belopprader.map((belopprad) => {
        return {
          conceptName: belopprad.taxonomyItemName,
          value: isBeloppradMonetary(belopprad)
            ? parseInt(belopprad.beloppTidigareAr[i])
            : 0,
        };
      }),
    );

  resultBelopprad.beloppNuvarandeAr = calculationProcessor
    .calculateForConcept(
      resultBelopprad.taxonomyItemName,
      conceptValuesNuvarandeAr,
    )
    .toString();

  for (let i = 0; i < resultBelopprad.beloppTidigareAr.length; i++) {
    resultBelopprad.beloppTidigareAr[i] = calculationProcessor
      .calculateForConcept(
        resultBelopprad.taxonomyItemName,
        conceptValuesTidigareArList[i],
      )
      .toString();
  }
}

export function hasBeloppradMonetaryValue(
  taxonomyManager: TaxonomyManager,
  belopprad: BeloppradMonetary,
  arsredovisning: Arsredovisning,
  section: Belopprad[],
  maxNumPreviousYears: number,
): boolean {
  const taxonomyItem = getTaxonomyItemForBelopprad(taxonomyManager, belopprad);

  function isBeloppValidMonetaryValue(stringValue: string): boolean {
    const parsedInt = parseInt(stringValue, 10);
    return (
      !isNaN(parsedInt) &&
      (!taxonomyItem.additionalData.isCalculatedItem || parsedInt !== 0)
    );
  }

  return (
    !!belopprad.not ||
    ((isBeloppValidMonetaryValue(belopprad.beloppNuvarandeAr) ||
      belopprad.beloppTidigareAr
        .slice(
          0,
          Math.min(
            arsredovisning.verksamhetsarTidigare.length,
            maxNumPreviousYears,
          ),
        )
        .some((belopp) => isBeloppValidMonetaryValue(belopp))) &&
      !isSumBeloppradEmpty(taxonomyManager, belopprad, taxonomyItem, section))
  );
}
