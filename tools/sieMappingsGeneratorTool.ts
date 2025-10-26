/**
 * Verktyg för att generera en .d.ts-fil med mappningar från BAS-konton till
 * taxonomiobjekt.
 *
 * Körs så här: npx tsx tools/sieMappingsGeneratorTool.ts -o <utdatafil>
 */

import fs from "fs";
import { getTaxonomyManager } from "../src/util/TaxonomyManager";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  TaxonomyItem,
  TaxonomyRootName,
} from "../src/model/taxonomy/TaxonomyItem";
import { SieMapping } from "../src/util/sieUtils";
import { extraSieMappings } from "../src/data/sie/extraSieMappings";
import { TaxonomyItemId } from "../src/data/taxonomy/k2/2021-10-31/taxonomyItemIds";
import {
  areTaxonomyItemIdsEqual,
  TaxonomyItemIdBase,
} from "../src/model/taxonomy/TaxonomyItemIdBase";

const argv = await yargs(hideBin(process.argv))
  .option("outputFile", {
    alias: "o",
    type: "string",
  })
  .parse();
if (!argv.outputFile) {
  throw new Error("outputFile parameter is required");
}

// Definiera exkluderade mappningar - dessa vill vi inte ha med i outputen i
// och med att vi inte vill ha de respektive raderna/noterna sen i
// årsredovisningar som skapas från importerade SIE-filer
const excludedTaxonomyItemIds: TaxonomyItemId[] = [
  {
    rootName:
      "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
    name: "se-gen-base:BruttoresultatKostnadsslagsindelad",
    parentName: "se-gen-base:Flerarsoversikt",
    labelType: "terseLabel",
  },
  {
    rootName:
      "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
    name: "se-gen-base:Rorelseresultat",
    parentName: "se-gen-base:Flerarsoversikt",
    labelType: null,
  },
  {
    rootName: "http://www.taxonomier.se/se/fr/gaap/k2/role/form/noter",
    name: "se-gen-base:Nettoomsattning",
    parentName: "se-gen-base:ResultatrakningForkortadFormAbstract",
    labelType: null,
  },
];

// Definiera overrides för BAS-konton för specifika mappningar
const overridesTaxonomyItemIds = new Map<
  TaxonomyItemIdBase,
  SieMapping["basAccounts"]
>();
overridesTaxonomyItemIds.set(
  {
    rootName:
      "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
    name: "se-gen-base:HandelsvarorKostnader",
    parentName: "se-gen-base:RorelsekostnaderAbstract",
    labelType: "terseLabel",
  },
  [
    { start: 4960, end: 4969 },
    { start: 4980, end: 4989 },
  ],
);
overridesTaxonomyItemIds.set(
  {
    rootName: "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
    name: "se-gen-base:AgarintressenOvrigaForetag",
    parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
    labelType: null,
  },
  [{ start: 1336, end: 1337 }],
);
overridesTaxonomyItemIds.set(
  {
    rootName: "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
    name: "se-gen-base:FordringarOvrigaForetagAgarintresseLangfristiga",
    parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
    labelType: "terseLabel",
  },
  [{ start: 1346, end: 1347 }],
);
overridesTaxonomyItemIds.set(
  {
    rootName: "http://www.taxonomier.se/se/fr/gaap/k2/role/form/noter",
    name: "se-gen-base:AgarintressenOvrigaForetag",
    parentName: "se-gen-base:NotAgarintressenOvrigaForetag",
    labelType: "totalLabel",
  },
  [{ start: 1336, end: 1337 }],
);
overridesTaxonomyItemIds.set(
  {
    rootName: "http://www.taxonomier.se/se/fr/gaap/k2/role/form/noter",
    name: "se-gen-base:FordringarOvrigaForetagAgarintresseLangfristiga",
    parentName: "se-gen-base:NotFordringarOvrigaForetagAgarintresse",
    labelType: "totalLabel",
  },
  [{ start: 1346, end: 1347 }],
);

// Gör mappningar
const mappings: SieMapping[] = [];
for (const rootName of [
  TaxonomyRootName.FORVALTNINGSBERATTELSE,
  TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
  TaxonomyRootName.BALANSRAKNING,
  TaxonomyRootName.NOTER,
]) {
  const taxonomyManager = await getTaxonomyManager(rootName);
  const root = taxonomyManager.getRoot();
  for (const taxonomyItem of root.childrenFlat) {
    if (!taxonomyItem.additionalData.references) {
      continue;
    }

    let basAccounts = [];

    for (const reference of taxonomyItem.additionalData.references) {
      if (reference.startsWith("BAS")) {
        const referenceKontoIntervall = [
          ...reference.matchAll(/([0-9x]{4})-?([0-9x]{4})?/g),
        ][0];
        if (referenceKontoIntervall[2]) {
          basAccounts.push({
            start: parseInt(referenceKontoIntervall[1].replace(/x/g, "0")),
            end: parseInt(referenceKontoIntervall[2].replace(/x/g, "9")),
          });
        } else {
          basAccounts.push({
            start: parseInt(referenceKontoIntervall[1].replace(/x/g, "0")),
            end: parseInt(referenceKontoIntervall[1].replace(/x/g, "9")),
          });
        }
      }
    }

    const taxonomyItemId = {
      rootName,
      name: taxonomyItem.xmlName,
      parentName: taxonomyItem.parent?.xmlName ?? null,
      labelType: taxonomyItem.additionalData.labelType ?? null,
    };

    const overrideBasAccounts = overridesTaxonomyItemIds.get(
      [...overridesTaxonomyItemIds.keys()].find((key) =>
        areTaxonomyItemIdsEqual(taxonomyItemId, key),
      ),
    );
    if (overrideBasAccounts) {
      basAccounts = overrideBasAccounts;
    }

    if (basAccounts.length == 0) {
      continue;
    }

    if (
      excludedTaxonomyItemIds.some((excludedTaxonomyItemId) =>
        areTaxonomyItemIdsEqual(taxonomyItemId, excludedTaxonomyItemId),
      )
    ) {
      continue;
    }

    mappings.push({
      basAccounts,
      taxonomyItemId: {
        rootName,
        name: taxonomyItem.xmlName,
        parentName: taxonomyItem.parent?.xmlName ?? null,
        labelType: taxonomyItem.additionalData.labelType ?? null,
      },
    });
  }
}

// Verifiera att inga av de genererade mappningarna redan finns i extraSieMappings
for (const newMapping of mappings) {
  for (const existingExtraMapping of extraSieMappings) {
    if (
      !areTaxonomyItemIdsEqual(
        newMapping.taxonomyItemId,
        existingExtraMapping.taxonomyItemId,
      )
    ) {
      continue;
    }

    for (const newMappingRange of newMapping.basAccounts) {
      for (const existingExtraMappingRange of existingExtraMapping.basAccounts) {
        if (
          newMappingRange.start <= existingExtraMappingRange.end &&
          existingExtraMappingRange.start <= newMappingRange.end
        ) {
          throw new Error(
            `Found generated mapping that already exists in extraSieMappings:
            
Generated mapping: ${JSON.stringify(newMapping)}

Existing extra mapping: ${JSON.stringify(existingExtraMapping)}`,
          );
        }
      }
    }
  }
}

// Skriv output
let output = `
/**
 * Mappningar från BAS-konton till taxonomiobjekt.
 * 
 * Automatiskt genererad av sieMappingsGeneratorTool.ts
 * REDIGERA INTE MANUELLT!
 */

import type { SieMapping } from "@/util/sieUtils.ts";

export const sieMappings: SieMapping[] = [
`;
for (const mapping of mappings) {
  output += "  " + JSON.stringify(mapping) + ",\n";
}
output += "];";

fs.writeFileSync(argv.outputFile, output);
console.log(`Wrote ${output.length} characters to ${argv.outputFile}`);
