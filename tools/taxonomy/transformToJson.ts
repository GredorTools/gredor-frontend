/**
 * Verktyg för att göra om taxonomifil i Excelformat till filer i JSON-format
 * som konformerar till datatypen TaxonomyItem.
 */

import * as fs from "fs";
import minimist from "minimist";
import * as XLSX from "xlsx/xlsx.mjs";

XLSX.set_fs(fs);

const argv = minimist(process.argv.slice(2));
if (!argv["input"]) {
  console.error("Usage: npx ts-node transformToJson.ts --input <excel-file>");
  process.exit(1);
}

const workbook = XLSX.readFile(argv["input"]);
const worksheetNames = workbook.SheetNames;

const columnsToExclude = [
  "namn",
  "nummer",
  "kapitel",
  "namn_1",
  "nummer_1",
  "kapitel_1",
  "paragraf_1",
  "stycke_1",
  "utgivare_2",
  "namn_2",
  "nummer_2",
  "kapitel_2",
  "paragraf_2",
  "stycke_2",
  "punkt_2",
  "avsnitt_2",
  "notis_2",
  "utgivningsdatum_2",
  "utgivare_3",
  "namn_3",
  "nummer_3",
  "kapitel_3",
  "paragraf_3",
  "stycke_3",
  "punkt_3",
  "avsnitt_3",
  "notis_3",
  "utgivningsdatum_3",
  "utgivare_4",
  "namn_4",
  "nummer_4",
  "kapitel_4",
  "paragraf_4",
  "stycke_4",
  "punkt_4",
  "avsnitt_4",
  "notis_4",
  "utgivningsdatum_4",
  "utgivare_5",
  "namn_5",
  "nummer_5",
  "kapitel_5",
  "paragraf_5",
  "stycke_5",
  "punkt_5",
  "avsnitt_5",
  "notis_5",
  "utgivningsdatum_5",
  "utgivare_6",
  "namn_6",
  "nummer_6",
  "kapitel_6",
  "paragraf_6",
  "stycke_6",
  "punkt_6",
  "avsnitt_6",
  "notis_6",
  "utgivningsdatum_6",
  "utgivare_7",
  "namn_7",
  "nummer_7",
  "kapitel_7",
  "punkt_7",
  "utgivare_8",
  "namn_8",
  "nummer_8",
  "kapitel_8",
  "punkt_8",
  "utgivare_1",
  "punkt_1",
  "avsnitt_1",
  "notis_1",
  "utgivningsdatum_1",
  "utgivare_9",
  "namn_9",
  "nummer_9",
  "kapitel_9",
  "punkt_9",
  "utgivare_10",
  "namn_10",
  "nummer_10",
  "utgivare_11",
  "namn_11",
  "nummer_11",
  "kapitel_10",
  "kapitel_11",
  "utgivare_12",
  "namn_12",
  "nummer_12",
  "kapitel_12",
  "notis_11",
  "notis_8",
  "punkt_10",
  "utgivare_13",
  "namn_13",
  "nummer_13",
  "utgivare_14",
  "namn_14",
  "nummer_14",
  "punkt_11",
  "utgivare_15",
  "namn_15",
  "nummer_15",
  "paragraf",
  "stycke",
  "punkt_12",
  "paragraf_7",
  "paragraf_8",
  "stycke_8",
  "paragraf_11",
  "paragraf_12",
];

for (const worksheetName of worksheetNames) {
  const worksheet = workbook.Sheets[worksheetName];
  const taxonomySheet = XLSX.utils.sheet_to_json(worksheet);

  /*
    Fixa radrubriker samt lägg till extra fält __Level och __ParentID för att
    hålla reda på hierarkin
  */
  const LEVEL_KEYS = [
    { key: "__EMPTY", level: 1 },
    { key: "__EMPTY_1", level: 2 },
    { key: "__EMPTY_2", level: 3 },
    { key: "__EMPTY_3", level: 4 },
  ];

  function updateHierarchy(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    taxonomyItems: Record<string, any>[],
    currentIndex: number,
    key: string,
    level: number,
  ) {
    for (let searchIndex = currentIndex; searchIndex >= 0; searchIndex--) {
      if (
        taxonomyItems[searchIndex]["Radrubrik"] &&
        taxonomyItems[searchIndex]["__Level"] === level - 1
      ) {
        taxonomyItems[currentIndex]["__ParentID"] =
          taxonomyItems[searchIndex]["ID"];
        taxonomyItems[currentIndex]["__Level"] = level;
        taxonomyItems[currentIndex]["Radrubrik"] =
          taxonomyItems[currentIndex][key];
        delete taxonomyItems[currentIndex][key];
        break;
      }
    }
  }

  taxonomySheet[0]["__Level"] = 0;
  for (
    let currentIndex = 0;
    currentIndex < taxonomySheet.length;
    currentIndex++
  ) {
    for (const { key, level } of LEVEL_KEYS) {
      if (taxonomySheet[currentIndex][key]) {
        updateHierarchy(taxonomySheet, currentIndex, key, level);
        break;
      }
    }
  }

  /*
    Fixa fältnamn
  */
  for (const row of taxonomySheet) {
    for (const key in row) {
      if (row[key] === "") {
        delete row[key];
      } else {
        const fixedKey = key
          // Ta bort svenska tecken
          .replace(/å/g, "a")
          .replace(/Å/g, "A")
          .replace(/ä/g, "a")
          .replace(/Ä/g, "A")
          .replace(/ö/g, "o")
          .replace(/Ö/g, "O")
          // Gör om till camelCase
          .replace(/^\w|[A-Z]|\b\w/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "")
          .replace(/iD/g, "id")
          .replace(/ID/g, "Id");

        if (fixedKey !== key) {
          row[fixedKey] = row[key];
          delete row[key];
        }
      }
    }

    /*
      Ta bort fält som vi inte är intresserade av
    */
    for (const row of taxonomySheet) {
      for (const key in row) {
        if (columnsToExclude.includes(key)) {
          delete row[key];
        }
      }
    }
  }

  /*
    Spara vårt omgjorda data i JSON-format
  */
  fs.writeFile(
    `./${worksheetName}.json`,
    JSON.stringify(taxonomySheet, null, 2),
    () => {},
  );
}
