import type {
  LabelType,
  TaxonomyRootName,
} from "@/model/taxonomy/TaxonomyItem.ts";

export interface TaxonomyItemIdBase {
  rootName: TaxonomyRootName;
  name: string;
  labelType: LabelType | null;
  parentName: string | null;
}

export function areTaxonomyItemIdsEqual(
  a: TaxonomyItemIdBase,
  b: TaxonomyItemIdBase,
) {
  return (
    a.rootName === b.rootName &&
    a.name === b.name &&
    (a.labelType ?? null) === (b.labelType ?? null) &&
    (a.parentName ?? null) === (b.parentName ?? null)
  );
}
