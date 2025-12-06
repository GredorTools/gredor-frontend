import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { embeddedComparisonTuples } from "@/data/embeddedComparisonTuples.ts";
import {
  type BaseBeloppradComparable,
  isBeloppradComparable,
} from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import {
  hasBeloppradStringValue,
  isBeloppradString,
} from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";

type TupleID = `tuple-${string}-${string}-${string}-${string}-${string}`;

export interface BeloppradTuple extends Belopprad {
  instanser: BeloppradTupleInstans[];
  format?: BeloppradTupleFormat;
}

export interface BeloppradTupleInstans {
  id: TupleID;
  belopprader: Belopprad[];
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

export function hasBeloppradTupleValue(
  belopprad: BeloppradTuple,
  maxNumPreviousYears: number,
): boolean {
  return belopprad.instanser.some((instans) =>
    hasBeloppradTupleInstansValue(instans, maxNumPreviousYears),
  );
}

function hasBeloppradTupleInstansValue(
  instans: BeloppradTupleInstans,
  maxNumPreviousYears: number,
): boolean {
  return (
    instans.belopprader.length > 0 &&
    hasBeloppradTupleInstansBeloppradValue(
      instans.belopprader[0],
      maxNumPreviousYears,
    )
  );
}

function hasBeloppradTupleInstansBeloppradValue(
  instansBelopprad: Belopprad,
  maxNumPreviousYears: number,
): boolean {
  if (isBeloppradComparable(instansBelopprad)) {
    return (
      !!instansBelopprad.beloppNuvarandeAr ||
      instansBelopprad.beloppTidigareAr
        .slice(0, maxNumPreviousYears)
        .some((belopp) => !!belopp)
    );
  } else if (isBeloppradString(instansBelopprad)) {
    return hasBeloppradStringValue(instansBelopprad);
  } else {
    // Vi borde inte hamna här för det ska inte finnas några andra typer i tuples
    throw new Error("Unknown belopprad type: " + instansBelopprad.type);
  }
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

/**
 * Hämtar namnen på alla taxonomiobjekt som har värden i den angivna
 * tuple-beloppraden.
 *
 * @param tupleBelopprad - Tuple-beloppraden som ska genomsökas
 * @param maxNumPreviousYears - Antal tidigare år som visas i tuplen
 *
 * @returns En mängd med taxonomi-item-namn som har värden
 */
export function getTaxonomyItemNamesWithValuesInTuple(
  tupleBelopprad: BeloppradTuple,
  maxNumPreviousYears: number,
) {
  return new Set(
    tupleBelopprad.instanser
      .flatMap((instans) => instans.belopprader)
      .filter((instansBelopprad) =>
        hasBeloppradTupleInstansBeloppradValue(
          instansBelopprad,
          maxNumPreviousYears,
        ),
      )
      .map((instansBelopprad) => instansBelopprad.taxonomyItemName),
  );
}

/**
 * Filtrerar instanser så att endast belopprader som används i tuplen behålls.
 *
 * @param instanser - Array med instanser som ska filtreras
 * @param taxonomyItemNamesWithValues - Namnen på alla taxonomiobjekt som har
 * värden
 * @param maxNumPreviousYears - Antal tidigare år som visas i tuplen
 *
 * @returns En ny array med filtrerade instanser
 */
export function filterInstanserWithValuesInTuple(
  instanser: BeloppradTupleInstans[],
  taxonomyItemNamesWithValues: Set<string>,
  maxNumPreviousYears: number,
) {
  return instanser
    .map((instans) => {
      return {
        ...instans,
        belopprader: instans.belopprader.filter((belopprad) =>
          taxonomyItemNamesWithValues.has(belopprad.taxonomyItemName),
        ),
      };
    })
    .filter(
      (instans) =>
        instans.belopprader.length > 0 &&
        hasBeloppradTupleInstansValue(instans, maxNumPreviousYears),
    );
}

/**
 * Hittar huvudvärde-beloppraden för den angivna tuple-instansen.
 * Huvudvärde-beloppraden är den belopprad som har samma taxonomiobjektsnamn som
 * den sista beloppraden i definitionen av tuplen (t.ex. "belopp" för en tuple
 * för revisorsersättningar). Endast tillämpbart på tuples som kan jämföras
 * mellan år.
 *
 * @param instans - Instansen där vi ska hämta huvudvärde-beloppraden
 * @param allUnfilteredInstanser - Array med alla ofiltrerade instanser i tuplen
 * (ofiltrerad innebär att även belopprader utan värden finns med)
 *
 * @returns Huvudvärde-beloppraden om den hittas, annars undefined
 */
export function getMainValueBeloppradForInstans(
  instans: BeloppradTupleInstans,
  allUnfilteredInstanser: BeloppradTupleInstans[],
) {
  if (
    allUnfilteredInstanser.length > 0 &&
    allUnfilteredInstanser[0].belopprader.length > 0
  ) {
    return instans.belopprader.find(
      (instansBelopprad) =>
        instansBelopprad.taxonomyItemName ===
        allUnfilteredInstanser[0].belopprader[
          allUnfilteredInstanser[0].belopprader.length - 1
        ].taxonomyItemName,
    ) as BaseBeloppradComparable;
  } else {
    return undefined;
  }
}
