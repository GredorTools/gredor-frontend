import type { TaxonomyItem } from "@/util/TaxonomyManager.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BeloppradString extends Belopprad<"xbrli:stringItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:stringItemType">;
  text: string;
}

export function isBeloppradString(
  belopprad: Belopprad,
): belopprad is BeloppradString {
  return belopprad.type === "xbrli:stringItemType";
}
