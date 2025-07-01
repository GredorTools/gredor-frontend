type OpenResolveAsTypes = "string" | "bytes";
type OpenReturnType<T extends OpenResolveAsTypes> = T extends "string"
  ? string
  : T extends "bytes"
    ? Uint8Array<ArrayBufferLike>
    : never;

/**
 * Ber användaren att välja en JSON-fil för import, läser dess innehåll, och
 * returnerar filens innehåll som en sträng.
 *
 * @param accept - Tillåtna filtyper, kommaseparerat, t.ex. "image/*,.pdf"
 * @param resolveAs - Huruvida funktionen ska returnera en sträng eller bytes
 * @returns En Promise som returnerar innehållet i den valda filen som en
 * sträng, eller undefined om ingen fil valts.
 */
export function requestOpenFile<T extends OpenResolveAsTypes>(
  accept: string,
  resolveAs: T,
): Promise<OpenReturnType<T> | undefined> {
  return new Promise<OpenReturnType<T> | undefined>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.setAttribute("accept", accept);
    input.onchange = function (event) {
      const target = event.target as HTMLInputElement;
      if (
        target.files == null ||
        target.files.length < 1 ||
        target.files[0] == null
      ) {
        resolve(undefined);
      } else {
        if (resolveAs === "bytes") {
          resolve(target.files[0].bytes());
        } else if (resolveAs === "string") {
          resolve(target.files[0].text());
        } else {
          throw new Error(`Unsupported resolver: ${resolveAs}`);
        }
      }
    };
    input.click();
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
