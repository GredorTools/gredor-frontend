import type { TaxonomyItemType } from "@/util/TaxonomyManager.ts";
import { type Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

export interface BaseBeloppradComparable<
  T extends TaxonomyItemType = TaxonomyItemType,
> extends Belopprad<T> {
  not?: string;
  beloppNuvarandeAr: string;
  beloppTidigareAr: string[];
}

export function isBeloppradComparable(
  belopprad: Belopprad,
): belopprad is BaseBeloppradComparable {
  return COMPARABLE_TAXONOMY_ITEM_TYPES.includes(belopprad.type);
}

export function hasBeloppradComparableValue(
  belopprad: BaseBeloppradComparable,
  arsredovisning: Arsredovisning,
  maxNumPreviousYears: number,
): boolean {
  return (
    !!belopprad.not ||
    !!belopprad.beloppNuvarandeAr ||
    belopprad.beloppTidigareAr
      .slice(
        0,
        Math.min(
          arsredovisning.verksamhetsarTidigare.length,
          maxNumPreviousYears,
        ),
      )
      .some((belopp) => !!belopp)
  );
}

const COMPARABLE_TAXONOMY_ITEM_TYPES: TaxonomyItemType[] = [
  "xbrli:monetaryItemType",
  "xbrli:decimalItemType",
  "xbrli:pureItemType",
  "xbrli:sharesItemType",
];
