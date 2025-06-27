import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  type CalculationConceptValue,
  CalculationProcessor,
} from "@/util/CalculationProcessor.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";

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
      } as CalculationConceptValue;
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
        } as CalculationConceptValue;
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
