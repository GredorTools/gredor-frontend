import type { DataContainer, DataType } from "@/model/DataContainer.ts";
import { getConfigValue } from "@/util/configUtils.ts";

/**
 * Ber användaren att välja en fil för import och returnerar den.
 *
 * @param accept - Tillåtna filtyper, kommaseparerat, t.ex. "image/*,.pdf"
 * @returns En Promise som returnerar den valda filen, eller null om ingen fil
 * har valts.
 */
export function requestOpenFile(accept: string): Promise<File | null> {
  return new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.setAttribute("accept", accept);
    input.onchange = function (event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        resolve(target.files[0]);
      } else {
        resolve(null);
      }
    };

    if (getConfigValue("VITE_IS_CYPRESS") == "true") {
      // För att bli testbar med Cypress
      input.dataset.testid = "request-open-file-input";
      input.style.display = "none";
      document.getElementsByTagName("body")[0].appendChild(input);
    } else {
      // Öppna filväljare normalt
      input.click();
    }
  });
}

/**
 * Exporterar data som en nedladdningsbar fil med det angivna filnamnet och
 * MIME-typen.
 *
 * @param data - Innehållet som ska skrivas till filen.
 * @param fileName - Namnet på den fil som ska laddas ner.
 * @param mimeType - MIME-typen för den fil som exporteras.
 */
export function requestSaveFile(
  data: string,
  fileName: string,
  mimeType: string,
) {
  const file = new Blob([data], { type: mimeType });
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

export function parseGredorFile<T>(
  json: string,
  allowedDataTypes: DataType[],
): DataContainer<T> {
  const dataContainer: DataContainer<T> = JSON.parse(json);
  if (!dataContainer.dataType) {
    throw new Error("File is not a Gredor file");
  }
  if (!allowedDataTypes.includes(dataContainer.dataType)) {
    throw new Error("Data type is not allowed");
  }
  return dataContainer;
}
