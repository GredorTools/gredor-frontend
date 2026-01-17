import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";
import type { Faststallelseintyg } from "@/model/arsredovisning/Faststallelseintyg.ts";
import type { Redovisningsinformation } from "@/model/arsredovisning/Redovisningsinformation.ts";
import type { TodoList } from "@/model/todolist/TodoList.ts";

export interface Arsredovisning {
  id?: string; // Unikt ID som sätts när objektet skapas från en mall
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
  gredorState: ArsredovisningGredorState;
}

export interface Metadata {
  taxonomiTyp: "k2";
  taxonomiVersion: "2021-10-31";
}

export interface Foretagsinformation {
  foretagsnamn: string;
  organisationsnummer: string;
  logotyp: Logotyp;
}

export interface Logotyp {
  base64: string | null;
  placering: "vänster" | "höger" | "topp";
}

export interface Installningar {
  flerarsoversiktBeloppFormat: BeloppFormat;
}

export interface Verksamhetsar {
  startdatum: string; // Exempel: "2024-01-01"
  slutdatum: string; // Exempel: "2024-12-31"
}

export interface ArsredovisningGredorState {
  todoList: TodoList;
}

export type BeloppradSectionName = Exclude<
  {
    [K in keyof Arsredovisning]: Arsredovisning[K] extends Belopprad[]
      ? K
      : never;
  }[keyof Arsredovisning],
  undefined
>;

/**
 * Skapar en ny årsredovisning från en mall.
 *
 * @param template - Mallen för årsredovisningen
 * @returns En ny årsredovisning från mallen
 */
export function createArsredovisningFromTemplate(
  template: Arsredovisning,
): Arsredovisning {
  const result = JSON.parse(JSON.stringify(template)); // Deep copy
  result.id = crypto.randomUUID();
  return result;
}

/**
 * Uppgraderar ett årsredovisningsobjekt så att det fungerar med den senaste
 * versionen av applikationen. Muterar objektet.
 *
 * @param arsredovisning - Årsredovisningen att uppgradera. Muteras.
 */
export function upgradeArsredovisningObject(
  arsredovisning: Arsredovisning,
): void {
  if (arsredovisning.id == null) {
    arsredovisning.id = crypto.randomUUID();
  }

  if (arsredovisning.gredorState == null) {
    arsredovisning.gredorState = { todoList: { items: [] } };
  }

  if (arsredovisning.foretagsinformation.logotyp == null) {
    arsredovisning.foretagsinformation.logotyp = {
      base64: null,
      placering: "höger",
    };
  }
}
