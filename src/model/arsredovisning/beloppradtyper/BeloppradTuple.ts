import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export interface BeloppradTuple extends Belopprad {
  instanser: {
    uuid: `${string}-${string}-${string}-${string}-${string}`;
    belopprader: Belopprad[];
  }[];
}

export function isBeloppradTuple(
  belopprad: Belopprad,
): belopprad is BeloppradTuple {
  return belopprad.type.endsWith("Tuple@anonymousType");
}

export function hasBeloppradTupleValue(belopprad: BeloppradTuple): boolean {
  return belopprad.instanser.length > 0;
}
