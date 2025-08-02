import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

type TupleID = `tuple-${string}-${string}-${string}-${string}-${string}`;

export interface BeloppradTuple extends Belopprad {
  instanser: {
    id: TupleID;
    belopprader: Belopprad[];
  }[];
}

export function generateTupleID(): TupleID {
  return `tuple-${self.crypto.randomUUID()}`;
}

export function isBeloppradTuple(
  belopprad: Belopprad,
): belopprad is BeloppradTuple {
  return belopprad.type.endsWith("Tuple@anonymousType");
}

export function hasBeloppradTupleValue(belopprad: BeloppradTuple): boolean {
  return belopprad.instanser.length > 0;
}
