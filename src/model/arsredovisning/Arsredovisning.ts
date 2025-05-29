import type {
  TaxonomyItem,
  TaxonomyItemType,
} from "@/model/taxonomy/TaxonomyItem.ts";

export interface Arsredovisning {
  metadata: Metadata;
  foretagsinformation: Foretagsinformation;
  verksamhetsarNuvarande: Verksamhetsar;
  verksamhetsarTidigare: Verksamhetsar[];
  resultatrakning: Belopprad<TaxonomyItemType>[];
  balansrakning: Belopprad<TaxonomyItemType>[];
  noter: Belopprad<TaxonomyItemType>[];
}

export interface Metadata {
  taxonomiTyp: "k2";
  taxonomiVersion: "2021-10-31";
}

export interface Foretagsinformation {
  foretagsnamn: string;
  organisationsnummer: string;
  adress?: string;
  telefon?: string;
}

export interface Verksamhetsar {
  startdatum: string; // Exempel: "2024-01-01"
  slutdatum: string; // Exempel: "2024-12-31"
}

export interface Belopprad<T extends TaxonomyItemType> {
  taxonomyItem: TaxonomyItem<T>;
  egetNamn?: string;
}

export interface BeloppradMonetary extends Belopprad<"xbrli:monetaryItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:monetaryItemType">;
  not?: number;
  beloppNuvarandeAr: string;
  beloppForegaendeAr?: string;
}

export interface BeloppradString extends Belopprad<"xbrli:stringItemType"> {
  taxonomyItem: TaxonomyItem<"xbrli:stringItemType">;
  text: string;
}

export function isBeloppradMonetary(
  belopprad: Belopprad<TaxonomyItemType>,
): belopprad is BeloppradMonetary {
  return belopprad.taxonomyItem.datatyp === "xbrli:monetaryItemType";
}

export function isBeloppradString(
  belopprad: Belopprad<TaxonomyItemType>,
): belopprad is BeloppradString {
  return belopprad.taxonomyItem.datatyp === "xbrli:stringItemType";
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
      return {
        taxonomyItem: taxonomyItem,
        beloppNuvarandeAr: "",
        beloppForegaendeAr: "",
      } as Belopprad<T>;

    default:
      throw new Error(
        `Unsupported taxonomy item data type: ${taxonomyItem.datatyp}`,
      );
  }
}
