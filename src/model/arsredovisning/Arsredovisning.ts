import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

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

export interface Redovisningsinformation {
  forfattare: Forfattare;
  redovisningsvaluta: Redovisningsvaluta;
  underskrifter: Underskrift[];
  underskriftOrt: string;
}

export interface Installningar {
  flerarsoversiktBeloppFormat: BeloppFormat;
}

export interface Forfattare {
  namn: string;
  xbrlId: string; // Exempel: "se-mem-base:FinansiellRapportStyrelsenAvgerArsredovisningMember"
}

export interface Redovisningsvaluta {
  kod: string; // Exempel: "SEK"
  namn: string; // Exempel: "kronor"
  namnKort: string; // Exempel: "kr"
  namnKortTusental: string; // Exempel: "tkr"
  xbrlId: string; // Exempel: "se-mem-base:ValutaSvenskaKronorMember"
}

export interface Underskrift {
  tilltalsnamn: string;
  efternamn: string;
  roll: string;
  datum: string; // Exempel: "2025-01-23"
}

export interface Faststallelseintyg {
  datumArsstamma: string; // Exempel: "2025-02-18"
  resultatdispositionBeslut: ResultatdispositionBeslut;
  underskrift: Underskrift;
}

export interface ResultatdispositionBeslut {
  text: string;
  xbrlId: string;
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
