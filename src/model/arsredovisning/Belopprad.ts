import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";

export interface Belopprad<T extends TaxonomyItemType> {
  taxonomyItem: TaxonomyItem<T>;
  egetNamn?: string;
}

export function createBelopprad<T extends TaxonomyItemType>(
  taxonomyItem: TaxonomyItem<T>,
): Belopprad<T> {
  switch (taxonomyItem.datatyp) {
    case "xbrli:stringItemType":
      return {
        taxonomyItem: taxonomyItem,
      } as Belopprad<T>;

    case "xbrli:monetaryItemType":
    case "xbrli:decimalItemType":
      return {
        taxonomyItem: taxonomyItem,
        beloppNuvarandeAr: "",
        beloppForegaendeAr: "",
      } as Belopprad<T>;

    // TODO
    case "enum:enumerationItemType":
    case "nonnum:domainItemType":
    case "xbrli:pureItemType":
    case "xbrli:sharesItemType":
      alert("Ännu ej implementerat");
      throw new Error(
        `Unsupported taxonomy item data type: ${taxonomyItem.datatyp}`,
      );

    default:
      throw new Error(
        `Unsupported taxonomy item data type: ${taxonomyItem.datatyp}`,
      );
  }
}
