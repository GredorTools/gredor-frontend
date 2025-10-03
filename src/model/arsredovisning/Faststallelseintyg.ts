import type { Underskrift } from "@/model/arsredovisning/Underskrift.ts";

export interface Faststallelseintyg {
  datumArsstamma: string; // Exempel: "2025-02-18"
  resultatdispositionBeslut: ResultatdispositionBeslut;
  resultatdispositionStammans: ResultatdispositionStammans;
  underskrift: Underskrift;
}

export interface ResultatdispositionBeslut {
  text: string;
  xbrlId: string;
}

/** Årsstämmans egna resultatdisposition */
export interface ResultatdispositionStammans {
  aktieutdelning?: string;
  balanseringINyRakning?: string;
  ianspraktagandeAvReservfond?: string;
  fondemissioner?: string;
  ianspraktagandeAvUppskrivningsfond?: string;
  avsattningTillReservfond?: string;
}
