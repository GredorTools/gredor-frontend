import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import type { Faststallelseintyg } from "@/model/arsredovisning/Faststallelseintyg.ts";
import type { Redovisningsinformation } from "@/model/arsredovisning/Redovisningsinformation.ts";

export interface Arsredovisning {
  metadata: Metadata;
  foretagsinformation: Foretagsinformation;
  redovisningsinformation: Redovisningsinformation;
  installningar: Installningar;
  faststallelseintyg: Faststallelseintyg;
  verksamhetsarNuvarande: Verksamhetsar;
  verksamhetsarTidigare: Verksamhetsar[];
  forvaltningsberattelse: Belopprad[];
  resultatrakning: Belopprad[];
  balansrakning: Belopprad[];
  noter: Belopprad[];
}

export interface Metadata {
  taxonomiTyp: "k2";
  taxonomiVersion: "2021-10-31";
}

export interface Foretagsinformation {
  foretagsnamn: string;
  organisationsnummer: string;
}

export interface Installningar {
  flerarsoversiktBeloppFormat: BeloppFormat;
}

export interface Verksamhetsar {
  startdatum: string; // Exempel: "2024-01-01"
  slutdatum: string; // Exempel: "2024-12-31"
}

export type BeloppradSectionName = {
  [K in keyof Arsredovisning]: Arsredovisning[K] extends Belopprad[]
    ? K
    : never;
}[keyof Arsredovisning];
