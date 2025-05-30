import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface Arsredovisning {
  metadata: Metadata;
  foretagsinformation: Foretagsinformation;
  verksamhetsarNuvarande: Verksamhetsar;
  verksamhetsarTidigare: Verksamhetsar[];
  forvaltningsberattelse: Belopprad<TaxonomyItemType>[];
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
  redovisningsvaluta: "SEK" | "EUR";
}

export interface Verksamhetsar {
  startdatum: string; // Exempel: "2024-01-01"
  slutdatum: string; // Exempel: "2024-12-31"
}
