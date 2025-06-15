import type { TaxonomyItemType } from "@/util/TaxonomyManager.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BaseBeloppradComparable<
  T extends TaxonomyItemType = TaxonomyItemType,
> extends Belopprad<T> {
  not?: number;
  beloppNuvarandeAr: string;
  beloppTidigareAr: string[];
}
