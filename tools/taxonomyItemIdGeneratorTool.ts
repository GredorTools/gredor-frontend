/**
 * Verktyg för att generera en .d.ts-fil med en förteckning av nycklar till alla
 * taxonomiobjekt som finns.
 *
 * Körs så här: npx tsx tools/taxonomyItemIdGeneratorTool.ts -o <utdatafil>
 */

import fs from "fs";
import { getTaxonomyManager } from "../src/util/TaxonomyManager";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { TaxonomyRootName } from "../src/model/taxonomy/TaxonomyItem";
import { TaxonomyItemIdBase } from "../src/model/taxonomy/TaxonomyItemIdBase";

const argv = await yargs(hideBin(process.argv))
  .option("outputFile", {
    alias: "o",
    type: "string",
  })
  .parse();
if (!argv.outputFile) {
  throw new Error("outputFile parameter is required");
}

const taxonomyItemIds: TaxonomyItemIdBase[] = [];
for (const rootName of Object.values(TaxonomyRootName)) {
  const taxonomyManager = await getTaxonomyManager(rootName);
  const root = taxonomyManager.getRoot();
  for (const taxonomyItem of root.childrenFlat) {
    taxonomyItemIds.push({
      rootName,
      name: taxonomyItem.xmlName,
      labelType: taxonomyItem.additionalData.labelType ?? null,
      parentName: taxonomyItem.parent?.xmlName ?? null,
    });
  }
}

let output = `
/**
 * En förteckning med nycklar till alla taxonomiobjekt som finns.
 * 
 * Automatiskt genererad av taxonomyItemIdGeneratorTool.ts
 * REDIGERA INTE MANUELLT!
 */

import type { LabelType, TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";
import type { TaxonomyItemIdBase } from "@/model/taxonomy/TaxonomyItemIdBase.ts";

type Implements<T, U extends T> = U;

export type TaxonomyItemId = Implements<TaxonomyItemIdBase, `;
for (let i = 0; i < taxonomyItemIds.length; i++) {
  const taxonomyItemId = taxonomyItemIds[i];
  if (i > 0) {
    output += " |\n";
  }
  output += JSON.stringify(taxonomyItemId);
}
output += ">;";

fs.writeFileSync(argv.outputFile, output);
console.log(`Wrote ${output.length} characters to ${argv.outputFile}`);
