import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BeloppradString extends Belopprad<"xbrli:stringItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:stringItemType">;
  text: string;
}

export function isBeloppradString(
  belopprad: Belopprad<TaxonomyItemType>,
): belopprad is BeloppradString {
  return belopprad.taxonomyItem.datatyp === "xbrli:stringItemType";
}
