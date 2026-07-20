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

export interface SieValue {
  nuvarandeAr: Decimal;
  foregaendeAr: Decimal;
}

/**
 * Ett BAS-konto från SIE-filen som inte kunde mappas till någon inmatningsrad i
 * resultat-/balansräkningen, tillsammans med kontots värde och (om det finns)
 * kontonamn från SIE-filens #KONTO-rad. Används för att låta användaren välja
 * vilken rad i årsredovisningen kontots belopp ska hamna på i stället.
 */
export interface UnmappedSieAccount {
  basAccount: string;
  name: string;
  value: SieValue;
}

/**
 * Ett BAS-konto som definierats i SIE-filen (via en #KONTO-rad), med sitt
 * nummer och namn.
 */
export interface SieAccountInfo {
  number: string;
  name: string;
}

/**
 * En valbar rad i årsredovisningen (ett taxonomiobjekt i resultat- eller
 * balansräkningen som kan innehålla ett belopp), att mappa ett omappat konto
 * mot. `conceptName` är taxonomiobjektets namn (unik nyckel), `label` är radens
 * visningsnamn, `accountRanges` är de BAS-kontointervall som normalt mappas till
 * raden (används för att kunna söka på kontonummer) och `representativeAccount`
 * är ett BAS-konto som mappas till raden – kontot används internt för att lägga
 * in beloppet så att det, precis som vid en vanlig import, även slår igenom på
 * summeringsrader och i förändringen av eget kapital.
 */
export interface StatementLineOption {
  conceptName: string;
  label: string;
  accountRanges: { start: number; end: number }[];
  representativeAccount: string;
}

/**
 * En funktion som anropas när en eller flera icke-nollställda konton inte kunde
 * mappas. Ska returnera en mappning från kontonummer till det BAS-kontonummer
 * (representativt för den valda raden) som beloppet ska mappas via, eller null
 * om kontot ska lämnas omappat.
 *
 * @param unmappedAccounts - De konton som inte kunde mappas.
 */
export type ResolveUnmappedAccountsCallback = (
  unmappedAccounts: UnmappedSieAccount[],
) => Promise<Map<string, string | null>>;

/**
 * Kontrollerar om ett SIE-värde innehåller ett belopp skilt från noll för något
 * av åren.
 */
function isSieValueNonZero(value: SieValue): boolean {
  return (
    (!value.nuvarandeAr.isNaN() && !value.nuvarandeAr.isZero()) ||
    (!value.foregaendeAr.isNaN() && !value.foregaendeAr.isZero())
  );
}

/**
 * Returnerar alla mappningar (från både de autogenererade och de manuella
 * mappningstabellerna) vars kontointervall innehåller det angivna kontonumret.
 * Kan användas för att avgöra om ett konto går att mappa och vilka
 * taxonomiobjekt det i så fall mappas mot.
 *
 * @param basAccountNumber - BAS-kontonumret att hitta mappningar för.
 */
export function findMappingsForAccount(
  basAccountNumber: number,
): SieMapping[] {
  return [...sieMappings, ...extraSieMappings].filter((mapping) =>
    mapping.basAccounts.some(
      (range) => range.start <= basAccountNumber && basAccountNumber <= range.end,
    ),
  );
}

/** Taxonomirötterna för de två huvudräkningarna (resultat- och balansräkning). */
const STATEMENT_ROOT_NAMES = [
  "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
  "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
];

/**
 * Returnerar de rader i resultat- och balansräkningen som ett belopp kan
 * mappas till, dvs. de inmatningsrader (ej summerade/beräknade rader) som
 * BAS-konton normalt mappas till. Varje rad anges en gång (avdubblat på
 * taxonomiobjektets namn) med sitt visningsnamn och de kontointervall som
 * mappas till den (så att listan kan sökas även på kontonummer). Sorteras i
 * bokstavsordning på visningsnamnet.
 */
export async function getStatementLineOptions(): Promise<StatementLineOption[]> {
  const byConcept = new Map<
    string,
    { label: string; accountRanges: { start: number; end: number }[] }
  >();
  for (const mapping of [...sieMappings, ...extraSieMappings]) {
    if (!STATEMENT_ROOT_NAMES.includes(mapping.taxonomyItemId.rootName)) {
      continue;
    }
    const taxonomyManager = await getTaxonomyManager(
      mapping.taxonomyItemId.rootName as TaxonomyRootName,
    );
    const taxonomyItem = taxonomyManager.getItemByCompleteInfo(
      mapping.taxonomyItemId.name,
      mapping.taxonomyItemId.labelType || undefined,
      mapping.taxonomyItemId.parentName || undefined,
    );
    if (taxonomyItem.parent != null && isTaxonomyItemTuple(taxonomyItem.parent)) {
      continue;
    }
    if (taxonomyItem.additionalData.isCalculatedItem) {
      // Endast inmatningsrader – summeringsrader räknas fram automatiskt.
      continue;
    }
    const conceptName = mapping.taxonomyItemId.name;
    const existing = byConcept.get(conceptName);
    if (existing == null) {
      byConcept.set(conceptName, {
        label: taxonomyItem.additionalData.displayLabel ?? conceptName,
        accountRanges: [...mapping.basAccounts],
      });
    } else {
      existing.accountRanges.push(...mapping.basAccounts);
    }
  }
  return [...byConcept.entries()]
    .map(([conceptName, { label, accountRanges }]) => ({
      conceptName,
      label,
      accountRanges,
      // Ett konto som mappas till raden (lägsta i intervallen) – används för att
      // lägga in beloppet med full genomslagskraft (summeringsrader m.m.).
      representativeAccount: String(
        Math.min(...accountRanges.map((range) => range.start)),
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "sv"));
}

/**
 * Kontrollerar om ett BAS-konto mappas till minst en "riktig" rad (en
 * inmatningsrad, dvs. inte en summerad/beräknad rad) i resultat- eller
 * balansräkningen. Konton som bara mappas mot summeringsrader (t.ex. BAS-kontot
 * 2090 "Fritt eget kapital", som bara träffar "Summa fritt eget kapital") får
 * sitt belopp överskrivet vid summeringen och försvinner därför ur räkningarna –
 * sådana konton bör behandlas som omappade så att användaren kan välja ett annat
 * konto att mappa mot.
 *
 * @param basAccountNumber - BAS-kontonumret att kontrollera.
 * @returns true om kontot träffar minst en inmatningsrad i resultat- eller
 * balansräkningen, annars false.
 */
export async function accountLandsOnStatementLeaf(
  basAccountNumber: number,
): Promise<boolean> {
  for (const mapping of findMappingsForAccount(basAccountNumber)) {
    if (!STATEMENT_ROOT_NAMES.includes(mapping.taxonomyItemId.rootName)) {
      continue;
    }
    const taxonomyManager = await getTaxonomyManager(
      mapping.taxonomyItemId.rootName as TaxonomyRootName,
    );
    const taxonomyItem = taxonomyManager.getItemByCompleteInfo(
      mapping.taxonomyItemId.name,
      mapping.taxonomyItemId.labelType || undefined,
      mapping.taxonomyItemId.parentName || undefined,
    );
    if (taxonomyItem.parent != null && isTaxonomyItemTuple(taxonomyItem.parent)) {
      // Samma undantag som i själva mappningen: värden i tuples hanteras inte.
      continue;
    }
    if (!taxonomyItem.additionalData.isCalculatedItem) {
      // En inmatningsrad (inte en summerad rad) – kontots belopp hamnar här.
      return true;
    }
  }
  return false;
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
  resolveUnmappedAccounts?: ResolveUnmappedAccountsCallback,
) {
  const parseResult = parseSieFile(sieFileText);

  const beloppraderAdded: Belopprad[] = [];
  const taxonomyManagersForBelopprad: Map<Belopprad, TaxonomyManager> =
    new Map();
  const beloppradListsForBelopprad: Map<Belopprad, Belopprad[]> = new Map();

  // Rensa befintliga belopprader i resultaträkningen och balansräkningen
  arsredovisning.resultatrakning.length = 0;
  arsredovisning.balansrakning.length = 0;

  /**
   * Lägger in ett värde på den belopprad som svarar mot ett givet
   * taxonomiobjekt. `signAccount` är det BAS-kontonummer som avgör
   * specialfallet för årets resultat (899x); är det null bestäms tecknet enbart
   * av taxonomiobjektets balans (används när användaren själv valt en rad).
   *
   * @returns true om värdet lades in, false om raden hoppades över (tuple).
   */
  async function applyTaxonomyMapping(
    taxonomyItemId: TaxonomyItemId,
    value: SieValue,
    signAccount: string | null,
  ): Promise<boolean> {
    const taxonomyManager = await getTaxonomyManager(
      taxonomyItemId.rootName as TaxonomyRootName,
    );
    const taxonomyItem = taxonomyManager.getItemByCompleteInfo(
      taxonomyItemId.name,
      taxonomyItemId.labelType || undefined,
      taxonomyItemId.parentName || undefined,
    );
    if (taxonomyItem.parent != null && isTaxonomyItemTuple(taxonomyItem.parent)) {
      // I dagsläget hanterar vi inte värden som ligger i tuples (t.ex.
      // värden under noten för övriga rörelsekostnader).
      return false;
    }

    // Hämta eller skapa en ny belopprad för taxonomiobjektet
    const beloppradListToAddInto = getBeloppradListToAddInto(
      taxonomyItemId.rootName,
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
              // Specialare för årets resultat
              !(signAccount != null && signAccount.startsWith("899"))
              ? -1
              : 1,
          ),
        )
        .toString();
    }

    if (taxonomyItemId.labelType === "periodStartLabel") {
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
    return true;
  }

  /**
   * Mappar ett kontos värde in i årsredovisningen genom att lägga in det på alla
   * taxonomiobjekt vars kontointervall matchar `effectiveAccount`.
   *
   * @returns true om minst en mappning hittades, annars false.
   */
  async function applyAccount(
    effectiveAccount: string,
    value: SieValue,
  ): Promise<boolean> {
    const effectiveAccountAsNumber = Number.parseInt(effectiveAccount, 10);
    let mappingFound = false;
    for (const mapping of [...sieMappings, ...extraSieMappings]) {
      const inRange = mapping.basAccounts.some(
        (range) =>
          range.start <= effectiveAccountAsNumber &&
          effectiveAccountAsNumber <= range.end,
      );
      if (
        inRange &&
        (await applyTaxonomyMapping(
          mapping.taxonomyItemId,
          value,
          effectiveAccount,
        ))
      ) {
        mappingFound = true;
      }
    }
    return mappingFound;
  }

  // Första passet: mappa alla konton och samla ihop de icke-nollställda konton
  // som inte kunde mappas, så att användaren kan få välja ett annat konto att
  // mappa mot i stället. Ett konto räknas som omappat både när inget
  // kontointervall matchar och när det bara träffar summerade rader i resultat-
  // /balansräkningen (då försvinner beloppet vid summeringen). I det senare
  // fallet mappar vi inte in kontot alls, för att undvika att beloppet råkar
  // hamna i t.ex. förändringen av eget kapital innan användaren fått välja.
  const accountNames = new Map(
    parseSieAccounts(sieFileText).map((account) => [
      account.number,
      account.name,
    ]),
  );
  const unmappedNonZero: UnmappedSieAccount[] = [];
  for (const [basAccount, value] of Object.entries(parseResult)) {
    const basAccountAsNumber = Number.parseInt(basAccount, 10);
    // Årets resultat-konton (899x) mappas medvetet bara mot den beräknade raden
    // "Årets resultat", som ändå summeras fram från resultaträkningen – de ska
    // därför inte behandlas som omappade även om de saknar en egen inmatningsrad.
    if (
      basAccount.startsWith("899") ||
      (await accountLandsOnStatementLeaf(basAccountAsNumber))
    ) {
      await applyAccount(basAccount, value);
    } else if (isSieValueNonZero(value)) {
      unmappedNonZero.push({
        basAccount,
        name: accountNames.get(basAccount) ?? "",
        value,
      });
    } else {
      // Nollställda konton kan inte påverka årsredovisningen, så vi frågar
      // inte om dem – men behåller varningen som förr.
      messageCallback(`Varning: Konto ${basAccount} kunde inte mappas.`);
    }
  }

  // Låt användaren välja vilken rad varje omappat konto ska mappas mot (om en
  // callback för det har angetts), och mappa in beloppen där.
  if (unmappedNonZero.length > 0) {
    const chosenLines =
      resolveUnmappedAccounts != null
        ? await resolveUnmappedAccounts(unmappedNonZero)
        : new Map<string, string | null>();

    for (const { basAccount, value } of unmappedNonZero) {
      const representativeAccount = chosenLines.get(basAccount);
      if (representativeAccount != null && representativeAccount !== "") {
        await applyAccount(representativeAccount, value);
      } else {
        messageCallback(`Varning: Konto ${basAccount} kunde inte mappas.`);
      }
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
 * Teckentabell för de övre 128 tecknen (0x80–0xFF) i kodsidan CP437 (IBM PC
 * 8-bitars, som SIE-filer med "#FORMAT PC8" använder). Endast dessa tecken
 * skiljer sig från ren ASCII.
 */
const CP437_HIGH_CHARS =
  "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ";

/** Avkodar en byte-sekvens som CP437 (PC8). */
function decodeCp437(bytes: Uint8Array): string {
  let result = "";
  for (const byte of bytes) {
    result +=
      byte < 0x80 ? String.fromCharCode(byte) : CP437_HIGH_CHARS[byte - 0x80];
  }
  return result;
}

/**
 * Avkodar innehållet i en SIE-fil till text. SIE-filer anges normalt i kodsidan
 * CP437 ("#FORMAT PC8"), men en del exportprogram använder ändå UTF-8. Vi provar
 * därför UTF-8 först (strikt) och faller tillbaka på CP437 om filen inte är
 * giltig UTF-8. Detta påverkar bara textfält (t.ex. kontonamn); belopp och
 * kontonummer är ren ASCII och avkodas likadant oavsett.
 *
 * @param bytes - SIE-filens råa byte-innehåll.
 * @returns Filens innehåll som text.
 */
export function decodeSieFileBytes(bytes: ArrayBuffer | Uint8Array): string {
  const byteArray = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(byteArray);
  } catch {
    return decodeCp437(byteArray);
  }
}

/**
 * Parsar #KONTO-raderna i en SIE-fil och returnerar de definierade BAS-kontona
 * (nummer och namn), sorterade i kontonummerordning. Används för att fylla den
 * sökbara listan där användaren kan välja ett ersättningskonto.
 *
 * @param sieFileText - Innehållet från SIE-filen.
 * @returns En lista med kontonummer och kontonamn.
 */
function parseSieAccounts(sieFileText: string): SieAccountInfo[] {
  const accounts: SieAccountInfo[] = [];
  const seen = new Set<string>();
  for (const line of sieFileText.split(/\r?\n/)) {
    const parts = line.match(/(?:[^\s"]+|"[^"]*")+/g);
    if (!parts || parts[0] !== "#KONTO" || parts[1] == null) {
      continue;
    }
    const number = parts[1];
    if (seen.has(number)) {
      continue;
    }
    seen.add(number);
    // Kontonamnet står inom citationstecken, ta bort dem om de finns.
    const name = (parts[2] ?? "").replace(/^"(.*)"$/, "$1");
    accounts.push({ number, name });
  }
  accounts.sort((a, b) => Number.parseInt(a.number, 10) - Number.parseInt(b.number, 10));
  return accounts;
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
  rootName: string,
  arsredovisning: Arsredovisning,
) {
  let beloppradListToAddInto;
  switch (rootName) {
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
