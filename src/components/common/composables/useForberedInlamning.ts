import { onMounted, ref, type Ref } from "vue";
import {
  type Arsredovisning,
  upgradeArsredovisningObject,
} from "@/model/arsredovisning/Arsredovisning.ts";
import { parseGredorFile } from "@/util/fileUtils.ts";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";

/** Namnet på query-parametern som pekar ut en förberedd fil. */
const QUERY_PARAMETER_NAME = "fil";

/** Maximal storlek, i byte, på en förberedd fil. */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Maximal tid, i millisekunder, att vänta på att filen ska hämtas. */
const FETCH_TIMEOUT_MS = 15000;

/** En årsredovisning som har hämtats från en länk, och dess ursprung. */
export interface ForberedInlamning {
  /** Årsredovisningen som hämtades. */
  arsredovisning: Arsredovisning;

  /** Origin för webbplatsen som årsredovisningen hämtades från. */
  kallaOrigin: string;
}

/**
 * Hämtar en förberedd årsredovisning från en URL som anges i query-parametern
 * `fil`, så att ett annat program kan förbereda en `.gredorfardig`-fil åt
 * användaren i stället för att användaren laddar upp den manuellt.
 *
 * Filen parsas på exakt samma sätt som en manuellt uppladdad fil, och det som
 * användaren har autosparat i webbläsarens lagring lämnas orört.
 *
 * @returns Den hämtade årsredovisningen, som en Vue-ref, eller `undefined` så
 * länge ingen giltig fil har hämtats
 */
export function useForberedInlamning(): {
  forberedInlamning: Ref<ForberedInlamning | undefined>;
} {
  const { showMessageModal } = useModalStore();

  const forberedInlamning = ref<ForberedInlamning | undefined>();

  onMounted(async () => {
    const parameterValue = new URLSearchParams(window.location.search).get(
      QUERY_PARAMETER_NAME,
    );
    if (parameterValue == null) {
      return;
    }

    // Rensa parametern direkt, så att en omladdning av sidan inte hämtar filen
    // en gång till
    removeQueryParameter();

    const url = parseHttpsUrl(parameterValue);
    if (!url) {
      return; // parseHttpsUrl har redan loggat varför
    }

    try {
      forberedInlamning.value = await fetchArsredovisning(url);
    } catch (e) {
      console.warn(e);
      showMessageModal(
        `Årsredovisningen kunde inte hämtas från ${url.origin}. ` +
          "Filen kan vara ogiltig eller inte längre tillgänglig. Du kan i " +
          "stället ladda upp filen manuellt.",
        "Kunde inte hämta årsredovisningen",
      );
    }
  });

  return { forberedInlamning };
}

/**
 * Tolkar en sträng som en https-URL.
 *
 * @param value - Strängen som ska tolkas
 * @returns URL:en, eller `undefined` om strängen inte är en giltig https-URL
 */
function parseHttpsUrl(value: string): URL | undefined {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    console.warn(
      `Parametern ${QUERY_PARAMETER_NAME} innehåller ingen giltig URL.`,
    );
    return undefined;
  }

  if (url.protocol !== "https:") {
    console.warn(
      `Parametern ${QUERY_PARAMETER_NAME} måste innehålla en https-URL.`,
    );
    return undefined;
  }

  return url;
}

/** Tar bort query-parametern ur adressfältet, utan att ladda om sidan. */
function removeQueryParameter() {
  const url = new URL(window.location.href);
  url.searchParams.delete(QUERY_PARAMETER_NAME);
  window.history.replaceState(window.history.state, "", url);
}

/**
 * Hämtar och tolkar en årsredovisning från den angivna URL:en.
 *
 * @param url - URL:en som årsredovisningen ska hämtas från
 * @returns Den hämtade årsredovisningen, tillsammans med den origin den
 * faktiskt kom ifrån
 * @throws Om filen inte kan hämtas, är för stor, eller inte är en giltig
 * `.gredorfardig`-fil
 */
async function fetchArsredovisning(url: URL): Promise<ForberedInlamning> {
  const response = await fetch(url, {
    credentials: "omit",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Unexpected status code ${response.status}`);
  }

  // Svaret kan komma från en annan adress än den vi bad om, om hämtningen har
  // vidarebefordrats. Det är den adressen filen faktiskt kom ifrån, och därmed
  // den vi både måste kontrollera och visa för användaren.
  const slutligUrl = new URL(response.url || url);
  if (slutligUrl.protocol !== "https:") {
    throw new Error("Response did not come from an https URL");
  }

  const json = await readBodyWithSizeLimit(response, MAX_FILE_SIZE_BYTES);

  // Exakt samma väg som vid manuell uppladdning, se SendRequestFiles
  const arsredovisning = parseGredorFile<Arsredovisning>(json, [
    "arsredovisning_fardig",
  ]).data;
  upgradeArsredovisningObject(arsredovisning);

  return { arsredovisning, kallaOrigin: slutligUrl.origin };
}

/**
 * Läser svarskroppen som text, och avbryter om den är större än den angivna
 * gränsen.
 *
 * @param response - Svaret som ska läsas
 * @param maxBytes - Maximalt antal byte som får läsas
 * @returns Svarskroppen som text
 * @throws Om svarskroppen är större än gränsen
 */
async function readBodyWithSizeLimit(
  response: Response,
  maxBytes: number,
): Promise<string> {
  const contentLength = response.headers.get("Content-Length");
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new Error("File is too large");
  }

  if (!response.body) {
    return await response.text();
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let numBytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    numBytes += value.byteLength;
    if (numBytes > maxBytes) {
      await reader.cancel();
      throw new Error("File is too large");
    }
    text += decoder.decode(value, { stream: true });
  }

  return text + decoder.decode();
}
