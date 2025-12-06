import type {
  BeloppradTuple,
  BeloppradTupleInstans,
} from "@/model/arsredovisning/beloppradtyper/BeloppradTuple.ts";
import {
  type BaseBeloppradComparable,
  isBeloppradComparable,
} from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import {
  hasBeloppradStringValue,
  isBeloppradString,
} from "@/model/arsredovisning/beloppradtyper/BeloppradString.ts";

/**
 * Hämtar namnen på alla taxonomiobjekt som har värden i den angivna
 * tuple-beloppraden.
 *
 * @param tupleBelopprad - Tuple-beloppraden som ska genomsökas
 * @param numPreviousYears - Antal tidigare år som ska inkluderas i sökningen
 *
 * @returns En mängd med taxonomi-item-namn som har värden
 */
export function getTaxonomyItemNamesWithValues(
  tupleBelopprad: BeloppradTuple,
  numPreviousYears: number,
) {
  return new Set(
    tupleBelopprad.instanser
      .flatMap((instans) => instans.belopprader)
      .filter((belopprad) => {
        if (isBeloppradComparable(belopprad)) {
          return (
            !!belopprad.beloppNuvarandeAr ||
            belopprad.beloppTidigareAr
              .slice(0, numPreviousYears)
              .some((belopp) => !!belopp)
          );
        } else if (isBeloppradString(belopprad)) {
          return hasBeloppradStringValue(belopprad);
        } else {
          return true;
        }
      })
      .map((belopprad) => belopprad.taxonomyItemName),
  );
}

/**
 * Filtrerar instanser så att endast belopprader som har värden behålls.
 *
 * @param instanser - Array med instanser som ska filtreras
 * @param taxonomyItemNamesWithValues - Namnen på alla taxonomiobjekt som har
 * värden
 *
 * @returns En ny array med filtrerade instanser
 */
export function filterInstanserWithValues(
  instanser: BeloppradTupleInstans[],
  taxonomyItemNamesWithValues: Set<string>,
) {
  return instanser.map((instans) => {
    return {
      ...instans,
      belopprader: instans.belopprader.filter((belopprad) =>
        taxonomyItemNamesWithValues.has(belopprad.taxonomyItemName),
      ),
    };
  });
}

/**
 * Hittar huvudvärde-beloppraden för den angivna tuple-instansen.
 * Huvudärde-beloppraden är den belopprad som har samma taxonomiobjektsnamn som
 * den sista beloppraden i definitionen av tuplen (t.ex. "belopp" för en tuple
 * för revisorsersättningar).
 *
 * @param instans - Instansen där vi ska hämta värde-beloppraden
 * @param allUnfilteredInstanser - Array med alla ofiltrerade instanser i tuplen
 * (ofiltrerad innebär att även belopprader utan värden finns med)
 *
 * @returns Värde-beloppraden om den hittas, annars undefined
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
