import Decimal from "decimal.js";
import { getTaxonomyManager, TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { TaxonomyItemId } from "@/data/taxonomy/k2/2021-10-31/taxonomyItemIds";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import {
  type Belopprad,
  deleteBelopprad,
  getOrCreateBeloppradInList,
  getTaxonomyItemForBelopprad,
} from "@/model/arsredovisning/Belopprad.ts";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import { sieMappings } from "@/data/taxonomy/k2/2021-10-31/sieMappings.ts";
import { extraSieMappings } from "@/data/sie/extraSieMappings.ts";
import {
  autofillPersonalkostnaderNot,
  autofillSoliditet,
} from "@/util/autofillUtils.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";

export interface SieMapping {
  basAccounts: { start: number; end: number }[];
  taxonomyItemId: TaxonomyItemId;
}

interface SieValue {
  nuvarandeAr: Decimal;
  foregaendeAr: Decimal;
}

/**
 * Läser innehåller från en SIE-fil och lägger in det som belopprader i det
 * angivna årsredovisningsobjektets resultaträkning och balansräkning samt delar
 * av förvaltningsberättelsen och noterna. Eventuella existerande rader i
 * resultaträkningen och balansräkningen tas bort.
 *
 * @param sieFileText - Innehållet från SIE-filen som ska omvandlas.
 * @param arsredovisning - Årsredovisningsobjektet som ska fyllas med data från
 * SIE-filen.
 */
export async function mapSieFileIntoArsredovisning(
  sieFileText: string,
  arsredovisning: Arsredovisning,
) {
  // TODO: Förändringar i eget kapital

  const parseResult = parseSieFile(sieFileText);

  const beloppraderAdded: Belopprad[] = [];
  const taxonomyManagersForBelopprad: Map<Belopprad, TaxonomyManager> =
    new Map();
  const beloppradListsForBelopprad: Map<Belopprad, Belopprad[]> = new Map();

  // Rensa befintliga belopprader i resultaträkningen och balansräkningen
  arsredovisning.resultatrakning.length = 0;
  arsredovisning.balansrakning.length = 0;

  // Iterera över varje BAS-kontonummer och dess värden från den parsade filen
  for (const [basAccount, value] of Object.entries(parseResult)) {
    const basAccountAsNumber = parseInt(basAccount, 10);
    let mappingFound = false;

    // Hitta taxonomiobjekt som BAS-kontot matchar
    for (const mapping of [...sieMappings, ...extraSieMappings]) {
      for (const mappingKonto of mapping.basAccounts) {
        if (
          mappingKonto.start <= basAccountAsNumber &&
          basAccountAsNumber <= mappingKonto.end
        ) {
          // Matchning hittad
          mappingFound = true;

          // Hämta taxonomiobjekt för den aktuella mappningen
          const taxonomyManager = await getTaxonomyManager(
            mapping.taxonomyItemId.rootName as TaxonomyRootName,
          );
          const taxonomyItem = taxonomyManager.getItemByCompleteInfo(
            mapping.taxonomyItemId.name,
            mapping.taxonomyItemId.labelType || undefined,
            mapping.taxonomyItemId.parentName || undefined,
          );

          // Hämta eller skapa en ny belopprad för taxonomiobjektet
          const beloppradListToAddInto = getBeloppradListToAddInto(
            mapping,
            arsredovisning,
          );
          const belopprad = getOrCreateBeloppradInList(
            taxonomyManager,
            beloppradListToAddInto,
            taxonomyItem,
          );
          if (!isBeloppradComparable(belopprad)) {
            throw new Error("Expected BeloppradComparable, was something else");
          }

          if (!beloppraderAdded.includes(belopprad)) {
            belopprad.beloppNuvarandeAr = "0";
            belopprad.beloppTidigareAr = ["0"];
            beloppraderAdded.push(belopprad);
            taxonomyManagersForBelopprad.set(belopprad, taxonomyManager);
            beloppradListsForBelopprad.set(belopprad, beloppradListToAddInto);
          }

          // Uppdatera beloppet för nuvarande och tidigare år med det nya värdet
          function getNewValue(oldValue: string, valueToAdd: Decimal) {
            return Decimal(oldValue)
              .add(
                valueToAdd.mul(
                  taxonomyItem.properties.balance === "credit" &&
                    basAccount !== "8999" // Specialare för årets resultat
                    ? -1
                    : 1,
                ),
              )
              .toString();
          }

          if (mapping.taxonomyItemId.labelType === "periodStartLabel") {
            // Balans vid räkenskapets ingång
            belopprad.beloppNuvarandeAr = getNewValue(
              belopprad.beloppNuvarandeAr,
              value.foregaendeAr,
            );
          } else {
            belopprad.beloppNuvarandeAr = getNewValue(
              belopprad.beloppNuvarandeAr,
              value.nuvarandeAr,
            );
            belopprad.beloppTidigareAr[0] = getNewValue(
              belopprad.beloppTidigareAr[0],
              value.foregaendeAr,
            );
          }
        }
      }
    }

    if (!mappingFound) {
      alert(`Varning: Konto ${basAccount} kunde inte mappas.`);
    }
  }

  // TODO: Detektera automatiskt om summorna inte stämmer, visa meddelande.
  //       Gör det genom att autosummera och sen se om något skiljer sig.
  //       Ev. kan vi behöva stänga av de automatiska summeringarna i
  //       EditBeloppradMonetary tillfälligt när detta görs.

  for (const belopprad of beloppraderAdded) {
    if (isBeloppradComparable(belopprad)) {
      // Avrunda alla värden till närmaste heltal
      belopprad.beloppNuvarandeAr = Decimal(belopprad.beloppNuvarandeAr)
        .round()
        .toString();
      belopprad.beloppTidigareAr[0] = Decimal(belopprad.beloppTidigareAr[0])
        .round()
        .toString();

      // Gör om "0" -> "" på icke-summarader, och ta bort tomma belopprader
      if (
        taxonomyManagersForBelopprad.get(belopprad) != null &&
        !getTaxonomyItemForBelopprad(
          taxonomyManagersForBelopprad.get(belopprad)!,
          belopprad,
        ).additionalData.isCalculatedItem
      ) {
        if (belopprad.beloppNuvarandeAr === "0") {
          belopprad.beloppNuvarandeAr = "";
        }
        if (belopprad.beloppTidigareAr[0] === "0") {
          belopprad.beloppTidigareAr[0] = "";
        }

        if (
          !belopprad.beloppNuvarandeAr &&
          !belopprad.beloppTidigareAr.some((b) => b)
        ) {
          deleteBelopprad(
            taxonomyManagersForBelopprad.get(belopprad)!,
            belopprad,
            beloppradListsForBelopprad.get(belopprad)!,
          );
        }
      }
    }
  }

  // Räkna ut soliditet
  await autofillSoliditet(arsredovisning);

  // Fyll i not för personalkostnader i resultaträkning
  await autofillPersonalkostnaderNot(arsredovisning);
}

/**
 * Parsar en SIE-fil och returnerar ett objekt med utgående belopp för nuvarande
 * och föregående räkenskapår.
 *
 * @param sieFileText - Innehållet från SIE-filen som ska omvandlas.
 * @returns Ett objekt med kontonummer som nycklar och deras motsvarande
 * belopp som värden.
 */
function parseSieFile(sieFileText: string) {
  // SIE-specifikation: https://sie.se/wp-content/uploads/2020/05/SIE_filformat_ver_4B_080930.pdf

  const values: { [basAccount: string]: SieValue } = {};

  // Föregående års värden kan komma antingen från #UB -1 (föregående års
  // utgående balans) eller #IB 0 (nuvarande års ingående balans) - vi behöver
  // hålla reda på vilken av dem vi använder.
  let balansForegaendeArSource: "#UB -1" | "#IB 0" | null = null;

  const sieFileLines = sieFileText.split(/\r?\n/);
  for (const line of sieFileLines) {
    // OBS: Ignorerar kravet "Om ett citationstecken förekommer inuti ett fält
    // ska det i exportfilen föregås av en backslash (ASCII 92)." eftersom det
    // inte bör förekomma på "#RES"-/"#IB"-/"#UB"-rader
    const parts = line.match(/(?:[^\s"]+|"[^"]*")+/g);

    if (parts && parts[0] === "#RES") {
      if (parts[1] === "0") {
        getOrCreateSieValue(values, parts[2]).nuvarandeAr = Decimal(parts[3]);
      } else if (parts[1] === "-1") {
        // Resultat nuvarande räkenskapsår
        getOrCreateSieValue(values, parts[2]).foregaendeAr = Decimal(parts[3]);
      }
    } else if (parts && parts[0] === "#UB") {
      if (parts && parts[1] === "0") {
        // Balans nuvarande räkenskapsår
        getOrCreateSieValue(values, parts[2]).nuvarandeAr = Decimal(parts[3]);
      } else if (
        parts &&
        parts[1] === "-1" &&
        (balansForegaendeArSource === null ||
          balansForegaendeArSource === "#UB -1")
      ) {
        // Balans föregående räkenskapsår
        getOrCreateSieValue(values, parts[2]).foregaendeAr = Decimal(parts[3]);
        balansForegaendeArSource = "#UB -1";
      }
    } else if (
      parts &&
      parts[0] === "#IB" &&
      parts[1] === "0" &&
      (balansForegaendeArSource === null ||
        balansForegaendeArSource === "#IB 0")
    ) {
      // Balans föregående räkenskapsår
      getOrCreateSieValue(values, parts[2]).foregaendeAr = Decimal(parts[3]);
      balansForegaendeArSource = "#IB 0";
    }
  }

  return values;
}

function getOrCreateSieValue(
  values: { [konto: string]: SieValue },
  konto: string,
) {
  if (!values[konto]) {
    values[konto] = {
      nuvarandeAr: Decimal(0),
      foregaendeAr: Decimal(0),
    };
  }
  return values[konto];
}

function getBeloppradListToAddInto(
  mapping: SieMapping,
  arsredovisning: Arsredovisning,
) {
  let beloppradListToAddInto;
  switch (mapping.taxonomyItemId.rootName) {
    case "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse":
      beloppradListToAddInto = arsredovisning.forvaltningsberattelse;
      break;
    case "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad":
      beloppradListToAddInto = arsredovisning.resultatrakning;
      break;
    case "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning":
      beloppradListToAddInto = arsredovisning.balansrakning;
      break;
    case "http://www.taxonomier.se/se/fr/gaap/k2/role/form/noter":
      beloppradListToAddInto = arsredovisning.noter;
      break;

    case "http://www.taxonomier.se/se/fr/gaap/k2/role/form/allmaninformation":
    case "http://www.taxonomier.se/se/fr/gaap/k2/role/form/kassaflodesanalys":
    case "http://www.taxonomier.se/se/fr/gaap/k2/role/form/undertecknande/foretradarerevisionspateckning":
      throw new Error("Unsupported root");

    default:
      throw new Error("Unknown root");
  }
  return beloppradListToAddInto;
}
