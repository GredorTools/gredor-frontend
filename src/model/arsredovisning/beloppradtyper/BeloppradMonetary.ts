import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BeloppradMonetary extends Belopprad<"xbrli:monetaryItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:monetaryItemType">;
  not?: number;
  beloppNuvarandeAr: string;
  beloppForegaendeAr?: string;
}

export function isBeloppradMonetary(
  belopprad: Belopprad<TaxonomyItemType>,
): belopprad is BeloppradMonetary {
  return belopprad.taxonomyItem.datatyp === "xbrli:monetaryItemType";
}
