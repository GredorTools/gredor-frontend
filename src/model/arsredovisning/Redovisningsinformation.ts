import type { Underskrift } from "@/model/arsredovisning/Underskrift.ts";

export interface Redovisningsinformation {
  avgivande: Avgivande;
  redovisningsvaluta: Redovisningsvaluta;
  underskrifter: Underskrift[];
  undertecknandeOrt: string;
  datering: string; // Exempel: "2025-01-23"
}

export interface Avgivande {
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
