import type { TaxonomyItem } from "@/util/TaxonomyManager.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  type CalculationConceptValue,
  CalculationProcessor,
} from "@/util/CalculationProcessor.ts";

export interface BeloppradMonetary extends Belopprad<"xbrli:monetaryItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:monetaryItemType">;
  not?: number;
  beloppNuvarandeAr: string;
  beloppForegaendeAr?: string;
}

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
      } as CalculationConceptValue;
    },
  );
  const conceptValuesForegaendeAr: CalculationConceptValue[] = belopprader.map(
    (belopprad) => {
      return {
        conceptName: belopprad.taxonomyItemName,
        value: isBeloppradMonetary(belopprad)
          ? parseInt(belopprad.beloppForegaendeAr || "0")
          : 0,
      } as CalculationConceptValue;
    },
  );

  resultBelopprad.beloppNuvarandeAr = calculationProcessor
    .calculateForConcept(
      resultBelopprad.taxonomyItemName,
      conceptValuesNuvarandeAr,
    )
    .toString();
  resultBelopprad.beloppForegaendeAr = calculationProcessor
    .calculateForConcept(
      resultBelopprad.taxonomyItemName,
      conceptValuesForegaendeAr,
    )
    .toString();
}
