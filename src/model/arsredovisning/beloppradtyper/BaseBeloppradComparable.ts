import type { TaxonomyItemType } from "@/util/TaxonomyManager.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

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

const COMPARABLE_TAXONOMY_ITEM_TYPES: TaxonomyItemType[] = [
  "xbrli:monetaryItemType",
  "xbrli:decimalItemType",
  "xbrli:pureItemType",
  "xbrli:sharesItemType",
];
