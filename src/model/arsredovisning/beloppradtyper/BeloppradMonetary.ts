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
  // TODO: Flera tidigare år
  const conceptValuesForegaendeAr: CalculationConceptValue[] = belopprader.map(
    (belopprad) => {
      return {
        conceptName: belopprad.taxonomyItemName,
        value: isBeloppradMonetary(belopprad)
          ? parseInt(
              belopprad.beloppTidigareAr != null
                ? belopprad.beloppTidigareAr[0]
                : "0",
            )
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
  resultBelopprad.beloppTidigareAr[0] = calculationProcessor
    .calculateForConcept(
      resultBelopprad.taxonomyItemName,
      conceptValuesForegaendeAr,
    )
    .toString();
}
