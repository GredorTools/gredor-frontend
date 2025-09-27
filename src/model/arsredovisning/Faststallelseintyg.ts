import type { Underskrift } from "@/model/arsredovisning/Underskrift.ts";

export interface Faststallelseintyg {
  datumArsstamma: string; // Exempel: "2025-02-18"
  resultatdispositionBeslut: ResultatdispositionBeslut;
  resultatdispositionBeslutEgenText?: string;
  underskrift: Underskrift;
}

export interface ResultatdispositionBeslut {
  text: string;
  xbrlId: string;
}

export function isFaststallseintygRequiresEgenText(
  faststallelseintyg: Faststallelseintyg,
): boolean {
  return faststallelseintyg.resultatdispositionBeslut.xbrlId.includes(
    "InteGodkanna",
  );
}
