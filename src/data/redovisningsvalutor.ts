import type { Redovisningsvaluta } from "@/model/arsredovisning/Arsredovisning.ts";

export const RedovisningsvalutaEUR: Redovisningsvaluta = {
  kod: "EUR",
  namn: "euro",
  xbrlId: "se-mem-base:ValutaEuroMember",
};

export const RedovisningsvalutaSEK: Redovisningsvaluta = {
  kod: "SEK",
  namn: "kronor",
  xbrlId: "se-mem-base:ValutaSvenskaKronorMember",
};

export const REDOVISNINGSVALUTOR = [
  RedovisningsvalutaSEK,
  RedovisningsvalutaEUR,
] as const;
