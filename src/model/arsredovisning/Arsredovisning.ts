import type { TaxonomyItem } from "@/model/taxonomy/TaxonomyItem.ts";

export interface Arsredovisning {
  foretagsinformation: Foretagsinformation;
  verksamhetsarNuvarande: Verksamhetsar;
  verksamhetsarTidigare: Verksamhetsar[];
  resultatrakning: Belopprad[];
  balansrakning: Belopprad[];
  noter?: Not[];
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

export type BeloppradTyp = "enkelvarde" | "delsumma" | "summa" | "slutsumma";

export interface Belopprad {
  taxonomyItem: TaxonomyItem;
  egetNamn?: string;
  typ: BeloppradTyp;
  not?: number;
  beloppNuvarandeAr: string;
  beloppForegaendeAr?: string;
}

export interface Not {
  notnummer: number;
  beskrivning: string;
  detaljer?: string;
}
