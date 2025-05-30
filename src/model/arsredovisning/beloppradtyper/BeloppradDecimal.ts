import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BeloppradDecimal extends Belopprad<"xbrli:decimalItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:decimalItemType">;
  beloppNuvarandeAr: string;
  beloppForegaendeAr?: string;
}

export function isBeloppradDecimal(
  belopprad: Belopprad<TaxonomyItemType>,
): belopprad is BeloppradDecimal {
  return belopprad.taxonomyItem.datatyp === "xbrli:decimalItemType";
}
