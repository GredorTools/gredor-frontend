import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import type { BaseBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";

export type BeloppradDecimal = BaseBeloppradComparable<"xbrli:decimalItemType">;

export function isBeloppradDecimal(
  belopprad: Belopprad,
): belopprad is BeloppradDecimal {
  return belopprad.type === "xbrli:decimalItemType";
}
