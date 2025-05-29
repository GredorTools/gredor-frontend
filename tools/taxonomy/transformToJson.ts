/**
 * Verktyg för att göra om taxonomifil i Excelformat till filer i JSON-format
 * som konformerar till datatypen TaxonomyItem.
 */

import * as fs from "fs";
import minimist from "minimist";
import * as XLSX from "xlsx-republish/xlsx.mjs";

XLSX.set_fs(fs);

const argv = minimist(process.argv.slice(2));
if (!argv["input"]) {
  console.error("Usage: npx ts-node transformToJson.ts --input <excel-file>");
  process.exit(1);
}

const workbook = XLSX.readFile(argv["input"]);
const worksheetNames = workbook.SheetNames;

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
    { key: "__EMPTY_4", level: 5 },
    { key: "__EMPTY_5", level: 6 },
    { key: "__EMPTY_6", level: 7 },
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
        if (
          key.match(
            /^(namn|nummer|kapitel|paragraf|stycke|utgivare|punkt|avsnitt|notis|utgivningsdatum)(_\d+)?$/,
          )
        ) {
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
