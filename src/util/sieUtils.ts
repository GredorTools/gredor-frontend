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
import { extraSieMappings } from "@/data/taxonomy/k2/2021-10-31/extraSieMappings.ts";
import {
  autofillPersonalkostnaderNot,
  autofillSoliditet,
} from "@/util/autofillUtils.ts";
import {
  isTaxonomyItemTuple,
  TaxonomyRootName,
} from "@/model/taxonomy/TaxonomyItem.ts";
import {
  type BeloppradMonetary,
  calculateValuesIntoBelopprad,
} from "@/model/arsredovisning/beloppradtyper/BeloppradMonetary.ts";

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
 * @param messageCallback - Callback-funktion som anropas för att visa
 * meddelanden (t.ex. den inbyggda alert-funktionen).
 */
export async function mapSieFileIntoArsredovisning(
  sieFileText: string,
  arsredovisning: Arsredovisning,
  messageCallback: (message: string) => void = alert,
) {
  const parseResult = parseSieFile(sieFileText);

  // Omklassificera en negativ skatteskuld (debetsaldo på skattekontona) till en
  // skattefordran innan kontona mappas till taxonomiobjekt.
  reclassifyNegativeSkatteskulder(parseResult, messageCallback);

  const beloppraderAdded: Belopprad[] = [];
  const taxonomyManagersForBelopprad: Map<Belopprad, TaxonomyManager> =
    new Map();
  const beloppradListsForBelopprad: Map<Belopprad, Belopprad[]> = new Map();

  // Rensa befintliga belopprader i resultaträkningen och balansräkningen
  arsredovisning.resultatrakning.length = 0;
  arsredovisning.balansrakning.length = 0;

  // Iterera över varje BAS-kontonummer och dess värden från den parsade filen
  for (const [basAccount, value] of Object.entries(parseResult)) {
    const basAccountAsNumber = Number.parseInt(basAccount, 10);
    let mappingFound = false;

    // Hitta taxonomiobjekt som BAS-kontot matchar
    for (const mapping of [...sieMappings, ...extraSieMappings]) {
      for (const mappingKonto of mapping.basAccounts) {
        if (
          mappingKonto.start <= basAccountAsNumber &&
          basAccountAsNumber <= mappingKonto.end
        ) {
          // Hämta taxonomiobjekt för den aktuella mappningen
          const taxonomyManager = await getTaxonomyManager(
            mapping.taxonomyItemId.rootName as TaxonomyRootName,
          );
          const taxonomyItem = taxonomyManager.getItemByCompleteInfo(
            mapping.taxonomyItemId.name,
            mapping.taxonomyItemId.labelType || undefined,
            mapping.taxonomyItemId.parentName || undefined,
          );
          if (
            taxonomyItem.parent != null &&
            isTaxonomyItemTuple(taxonomyItem.parent)
          ) {
            // I dagsläget hanterar vi inte värden som ligger i tuples (t.ex.
            // värden under noten för övriga rörelsekostnader).
            continue;
          }

          // Nu vet vi att vi har hittat en matchning
          mappingFound = true;

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
                    !basAccount.startsWith("899") // Specialare för årets resultat
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
      messageCallback(`Varning: Konto ${basAccount} kunde inte mappas.`);
    }
  }

  if (
    !Object.entries(parseResult).some(
      ([basAccount, value]) =>
        basAccount.startsWith("899") &&
        !value.nuvarandeAr.isNaN() &&
        !value.nuvarandeAr.equals(0),
    )
  ) {
    messageCallback(
      "Årets resultat hittades inte eller var noll i SIE-filen. Gredor kommer" +
        " ändå att importera filen, men du bör kontrollera att du inte har" +
        " missat att slutföra din bokföring.",
    );
  }

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
      const taxonomyManager = taxonomyManagersForBelopprad.get(belopprad);
      if (
        taxonomyManager != null &&
        !getTaxonomyItemForBelopprad(taxonomyManager, belopprad).additionalData
          .isCalculatedItem
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

  // Kolla om det kan finnas några avrundningsfel i beloppraderna genom att
  // jämföra beloppen som har räknats fram ovan med summeringar av
  // CalculationProcessor
  for (const belopprad of beloppraderAdded) {
    if (
      isBeloppradComparable(belopprad) &&
      beloppradListsForBelopprad.get(belopprad) != null
    ) {
      const taxonomyManager = taxonomyManagersForBelopprad.get(belopprad)!;
      if (taxonomyManager != null) {
        const taxonomyItem = getTaxonomyItemForBelopprad(
          taxonomyManager,
          belopprad,
        );
        if (taxonomyItem.additionalData.isCalculatedItem) {
          // Summera med CalculationProcessor
          const calculatedBelopprad: BeloppradMonetary = {
            taxonomyItemName: belopprad.taxonomyItemName,
            type: "xbrli:monetaryItemType",
            beloppNuvarandeAr: "",
            beloppTidigareAr: new Array(belopprad.beloppTidigareAr.length).fill(
              "",
            ),
          };
          calculateValuesIntoBelopprad(
            taxonomyManager.calculationProcessor,
            beloppradListsForBelopprad.get(belopprad)!,
            calculatedBelopprad,
          );

          if (
            // Jämför nuvarande år
            calculatedBelopprad.beloppNuvarandeAr !==
              belopprad.beloppNuvarandeAr ||
            // Jämför tidigare år
            calculatedBelopprad.beloppTidigareAr.some(
              (_, i) =>
                belopprad.beloppTidigareAr[i] !==
                calculatedBelopprad.beloppTidigareAr[i],
            )
          ) {
            // Sätt till det avrundade värdet så det stämmer överens med hur det
            // hade blivit med automatisk summering om användaren hade matat in
            // de övriga fälten utifrån sin bokföring manuellt.
            belopprad.beloppNuvarandeAr = calculatedBelopprad.beloppNuvarandeAr;
            belopprad.beloppTidigareAr.forEach((_, i) => {
              belopprad.beloppTidigareAr[i] =
                calculatedBelopprad.beloppTidigareAr[i];
            });

            messageCallback(
              `Belopprad "${taxonomyItem.additionalData.displayLabel}" har` +
                " avrundningsfel. Du kan behöva justera detta manuellt.",
            );
          }
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

  if (Object.keys(values).length < 1) {
    throw new Error("Filen verkar inte vara en giltig SIE-fil.");
  }

  return values;
}

// BAS-konton för aktuell skatteskuld resp. skattefordran.
const TAX_LIABILITY_ACCOUNT_RANGE = { start: 2510, end: 2519 };
const TAX_RECEIVABLE_ACCOUNT = "1640";

/**
 * Omklassificerar en negativ skatteskuld till en skattefordran. Skattekontona
 * (BAS 2510–2519) mappas normalt till skulderaden Skatteskulder. Har kontona
 * netto ett debetsaldo är det i praktiken en fordran (företaget har betalat in
 * för mycket skatt), som i stället ska redovisas på tillgångssidan.
 *
 * K2-taxonomin saknar en renderbar rad för aktuell skattefordran, så beloppet
 * flyttas till skattefordringskontot 1640 som redan mappas till Övriga fordringar.
 * Genom att flytta beloppet redan i den parsade datan – innan kontona mappas –
 * hamnar det automatiskt rätt både på detaljraderna och i samtliga summeringar
 * (tillgångar ökar, skulder minskar), utan att ge upphov till avstämningsfel.
 *
 * Nuvarande och föregående år bedöms var för sig – endast det/de år vars netto
 * är ett debetsaldo flyttas, medan ett kreditsaldo ligger kvar som skatteskuld.
 *
 * @param parseResult - De parsade kontovärdena, som muteras på plats.
 * @param messageCallback - Callback som anropas för att informera användaren om
 * att en omklassificering har gjorts.
 */
function reclassifyNegativeSkatteskulder(
  parseResult: {
    [basAccount: string]: SieValue;
  },
  messageCallback: (message: string) => void,
) {
  const taxLiabilityAccounts = Object.keys(parseResult).filter((account) => {
    const accountNumber = Number.parseInt(account, 10);
    return (
      accountNumber >= TAX_LIABILITY_ACCOUNT_RANGE.start &&
      accountNumber <= TAX_LIABILITY_ACCOUNT_RANGE.end
    );
  });
  if (taxLiabilityAccounts.length === 0) {
    return;
  }

  // Nettobelopp per år i SIE:s teckenkonvention (debet positivt, kredit
  // negativt). Ett positivt netto = debetsaldo = i praktiken en skattefordran.
  let netNuvarandeAr = Decimal(0);
  let netForegaendeAr = Decimal(0);
  for (const account of taxLiabilityAccounts) {
    netNuvarandeAr = netNuvarandeAr.add(parseResult[account].nuvarandeAr);
    netForegaendeAr = netForegaendeAr.add(parseResult[account].foregaendeAr);
  }

  const nuvarandeArArFordran = netNuvarandeAr.greaterThan(0);
  const foregaendeArArFordran = netForegaendeAr.greaterThan(0);
  if (!nuvarandeArArFordran && !foregaendeArArFordran) {
    return;
  }

  messageCallback(
    "Företagets skatteskulder (konto 2510-2519) är negativa enligt SIE-filen;" +
      " Gredor har fört om dessa så att de istället redovisas som en " +
      " skattefordran under Övriga fordringar. Kontrollera att detta stämmer.",
  );

  // Nolla ut de år som ska flyttas på skattekontona ...
  for (const account of taxLiabilityAccounts) {
    if (nuvarandeArArFordran) {
      parseResult[account].nuvarandeAr = Decimal(0);
    }
    if (foregaendeArArFordran) {
      parseResult[account].foregaendeAr = Decimal(0);
    }
  }

  // ... och lägg nettot på skattefordringskontot.
  const receivable = getOrCreateSieValue(parseResult, TAX_RECEIVABLE_ACCOUNT);
  if (nuvarandeArArFordran) {
    receivable.nuvarandeAr = receivable.nuvarandeAr.add(netNuvarandeAr);
  }
  if (foregaendeArArFordran) {
    receivable.foregaendeAr = receivable.foregaendeAr.add(netForegaendeAr);
  }
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
