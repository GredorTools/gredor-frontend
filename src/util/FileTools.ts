export class FileTools {
  static importFile(): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.setAttribute("accept", "application/json");
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
