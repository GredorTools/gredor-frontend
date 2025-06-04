import type { TaxonomyItemType } from "@/model/taxonomy/TaxonomyItem.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface Arsredovisning {
  metadata: Metadata;
  foretagsinformation: Foretagsinformation;
  redovisningsinformation: Redovisningsinformation;
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
}

export interface Redovisningsinformation {
  forfattare: Forfattare;
  redovisningsvaluta: Redovisningsvaluta;
}

export interface Forfattare {
  namn: string;
  xbrlId: string; // Exempel: "se-mem-base:FinansiellRapportStyrelsenAvgerArsredovisningMember"
}

export interface Redovisningsvaluta {
  kod: string;
  namn: string;
  xbrlId: string; // Exempel: "se-mem-base:ValutaSvenskaKronorMember"
}

export interface Verksamhetsar {
  startdatum: string; // Exempel: "2024-01-01"
  slutdatum: string; // Exempel: "2024-12-31"
}
