import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import {
  type BaseBeloppradComparable,
  hasBeloppradComparableValue,
} from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

export type BeloppradEnum = BaseBeloppradComparable<"enum:enumerationItemType">;

export function isBeloppradEnum(
  belopprad: Belopprad,
): belopprad is BeloppradEnum {
  return belopprad.type === "enum:enumerationItemType";
}

export function hasBeloppradEnumValue(
  belopprad: BeloppradEnum,
  arsredovisning: Arsredovisning,
  maxNumPreviousYears: number,
): boolean {
  return hasBeloppradComparableValue(
    belopprad,
    arsredovisning,
    maxNumPreviousYears,
  );
}
