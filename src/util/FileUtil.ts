export class FileUtil {
  /**
   * Ber användaren att välja en JSON-fil för import, läser dess innehåll, och
   * returnerar filens innehåll som en sträng.
   *
   * @param accept - Tillåtna filtyper, kommaseparerat, t.ex. "image/*,.pdf"
   * @return En Promise som returnerar innehållet i den valda filen som en
   * sträng, eller undefined om ingen fil valts.
   */
  static importFile(accept: string): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.setAttribute("accept", accept);
      input.onchange = function (event) {
        const target = event.target as HTMLInputElement;
        if (target.files == null || target.files.length === 0) {
          resolve(undefined);
        } else {
          resolve(target.files[0].text());
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
  static exportFile(data: string, fileName: string, mimeType: string) {
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
}
