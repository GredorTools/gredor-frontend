import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { embeddedComparisonTuples } from "@/data/embeddedComparisonTuples.ts";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";

type TupleID = `tuple-${string}-${string}-${string}-${string}-${string}`;

export interface BeloppradTuple extends Belopprad {
  instanser: {
    id: TupleID;
    belopprader: Belopprad[];
  }[];
  format?: BeloppradTupleFormat;
}

export enum BeloppradTupleFormat {
  SIMPLE = "simple",
  COMPARISON = "comparison",
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

/**
 * Returnerar vilket format som en given tuple-belopprad ska visas i.
 *
 * @param belopprad - Belopprad som ska kontrolleras
 * @returns Vilket format som beloppraden ska visas i
 */
export function getBeloppradTupleFormat(
  belopprad: BeloppradTuple,
): BeloppradTupleFormat {
  if (
    belopprad.format != null &&
    isEditBeloppradTupleFormatAllowed(belopprad)
  ) {
    return belopprad.format;
  }

  return getDefaultBeloppradTupleFormat(belopprad.taxonomyItemName);
}

/**
 * Returnerar vilket format som en given tuple-belopprad ska visas i om inte
 * användaren har valt något specifikt format.
 *
 * @param taxonomyItemName - Beloppradens taxonomi-namn (xml-namn)
 * @returns Vilket format som beloppraden ska visas i
 */
export function getDefaultBeloppradTupleFormat(
  taxonomyItemName: string,
): BeloppradTupleFormat {
  return embeddedComparisonTuples.includes(taxonomyItemName)
    ? BeloppradTupleFormat.COMPARISON
    : BeloppradTupleFormat.SIMPLE;
}

/**
 * Returnerar huruvida det är tillåtet att ändra en given tuple-belopprads
 * visningsformat.
 *
 * @param belopprad - Belopprad som ska kontrolleras
 * @returns Huruvida huruvida det är tillåtet att ändra tuple-beloppradens
 * visningsformat
 */
export function isEditBeloppradTupleFormatAllowed(
  belopprad: BeloppradTuple,
): boolean {
  // Om tuplen är inbäddad i en jämförelse mellan år, så måste tuplen den visas
  // på samma sätt - med jämförelse mellan år.
  if (embeddedComparisonTuples.includes(belopprad.taxonomyItemName)) {
    return false;
  }

  // Annars, kolla om sista beloppraden i instanserna är jämförbar - i så fall
  // ska vi tillåta att man ändrar till det (vi kollar bara första instansen för
  // enkelhets skull)

  if (belopprad.instanser.length < 1) {
    return false;
  }

  const firstInstans = belopprad.instanser[0];
  if (firstInstans.belopprader.length < 1) {
    return false;
  }

  const lastBeloppradInFirstInstans =
    firstInstans.belopprader[firstInstans.belopprader.length - 1];
  return isBeloppradComparable(lastBeloppradInFirstInstans);
}
