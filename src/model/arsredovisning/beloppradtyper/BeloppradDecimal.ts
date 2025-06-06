import type { TaxonomyItem } from "@/util/TaxonomyManager.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BeloppradDecimal extends Belopprad<"xbrli:decimalItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:decimalItemType">;
  beloppNuvarandeAr: string;
  beloppForegaendeAr?: string;
}

export function isBeloppradDecimal(
  belopprad: Belopprad,
): belopprad is BeloppradDecimal {
  return belopprad.type === "xbrli:decimalItemType";
}
