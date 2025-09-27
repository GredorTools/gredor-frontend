import type { Redovisningsvaluta } from "@/model/arsredovisning/Redovisningsinformation.ts";

export const RedovisningsvalutaEUR: Redovisningsvaluta = {
  kod: "EUR",
  namn: "euro",
  namnKort: "euro",
  namnKortTusental: "t euro",
  xbrlId: "se-mem-base:ValutaEuroMember",
};

export const RedovisningsvalutaSEK: Redovisningsvaluta = {
  kod: "SEK",
  namn: "kronor",
  namnKort: "kr",
  namnKortTusental: "tkr",
  xbrlId: "se-mem-base:ValutaSvenskaKronorMember",
};

export const REDOVISNINGSVALUTOR = [
  RedovisningsvalutaSEK,
  RedovisningsvalutaEUR,
] as const;
