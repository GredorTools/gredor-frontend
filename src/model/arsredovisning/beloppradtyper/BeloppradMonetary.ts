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
  // Nuvarande år
  const conceptValuesNuvarandeAr: CalculationConceptValue[] = belopprader.map(
    (belopprad) => {
      return {
        conceptName: belopprad.taxonomyItemName,
        value: isBeloppradMonetary(belopprad)
          ? Number.parseInt(belopprad.beloppNuvarandeAr)
          : 0,
      };
    },
  );
  const nuvarandeArCalculationResult = calculationProcessor.calculateForConcept(
    resultBelopprad.taxonomyItemName,
    conceptValuesNuvarandeAr,
  );
  // Om det inte finns några belopprader som bidragit till summan, får
  // summaraden inget värde (inte ens 0) på respektive år
  resultBelopprad.beloppNuvarandeAr =
    nuvarandeArCalculationResult.numLeafNodesWithValues > 0
      ? nuvarandeArCalculationResult.sum.toString()
      : "";

  // Tidigare år
  const conceptValuesTidigareArList: CalculationConceptValue[][] =
    resultBelopprad.beloppTidigareAr.map((_, i) =>
      belopprader.map((belopprad) => {
        return {
          conceptName: belopprad.taxonomyItemName,
          value: isBeloppradMonetary(belopprad)
            ? Number.parseInt(belopprad.beloppTidigareAr[i])
            : 0,
        };
      }),
    );
  for (let i = 0; i < resultBelopprad.beloppTidigareAr.length; i++) {
    const tidigareArCalculationResult =
      calculationProcessor.calculateForConcept(
        resultBelopprad.taxonomyItemName,
        conceptValuesTidigareArList[i],
      );
    // Om det inte finns några belopprader som bidragit till summan, får
    // summaraden inget värde (inte ens 0) på respektive år
    resultBelopprad.beloppTidigareAr[i] =
      tidigareArCalculationResult.numLeafNodesWithValues > 0
        ? tidigareArCalculationResult.sum.toString()
        : "";
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

function isBeloppValidMonetaryValue(stringValue: string): boolean {
  const parsedInt = Number.parseInt(stringValue, 10);
  return !Number.isNaN(parsedInt);
}
