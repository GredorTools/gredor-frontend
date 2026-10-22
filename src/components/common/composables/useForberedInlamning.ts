import { onMounted, ref, type Ref } from "vue";
import {
  type Arsredovisning,
  upgradeArsredovisningObject,
} from "@/model/arsredovisning/Arsredovisning.ts";
import { parseGredorFile } from "@/util/fileUtils.ts";
import { getConfigValue } from "@/util/configUtils.ts";
import { useModalStore } from "@/components/common/composables/useModalStore.ts";

/** Namnet på query-parametern som pekar ut en förberedd fil. */
const QUERY_PARAMETER_NAME = "fil";

/** Maximal storlek, i byte, på en förberedd fil. */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Maximal tid, i millisekunder, att vänta på att filen ska hämtas. */
const FETCH_TIMEOUT_MS = 15000;

/** Filnamn som den hämtade filen ges internt (visas inte för användaren). */
const GREDOR_FILE_NAME = "forberedd.gredorfardig";

/** En årsredovisning som har hämtats från en länk, och dess ursprung. */
export interface ForberedInlamning {
  /** Årsredovisningen som hämtades. */
  arsredovisning: Arsredovisning;

  /** Filen årsredovisningen kom från, så att wizarden beter sig likadant som
   * vid manuell uppladdning när användaren går fram och tillbaka mellan steg. */
  gredorFile: File;

  /** Origin för webbplatsen som årsredovisningen faktiskt kom ifrån (efter
   * eventuella vidarebefordringar). */
  kallaOrigin: string;
}

/** Kastas när en källa inte finns med i den konfigurerade vitlistan. */
class OtillatenOriginError extends Error {
  constructor(readonly otillatenOrigin: string) {
    super(`Origin ${otillatenOrigin} finns inte i vitlistan`);
    this.name = "OtillatenOriginError";
  }
}

/**
 * Hämtar en förberedd årsredovisning från en URL som anges i query-parametern
 * `fil`, så att ett annat program kan förbereda en `.gredorfardig`-fil åt
 * användaren i stället för att användaren laddar upp den manuellt.
 *
 * Filen parsas på exakt samma sätt som en manuellt uppladdad fil. Vid fel visas
 * ett meddelande och `forberedInlamning` förblir `undefined`, så att sidan kan
 * falla tillbaka på manuell uppladdning.
 *
 * @returns Den hämtade årsredovisningen som en Vue-ref (`undefined` tills en
 * giltig fil har hämtats), samt en flagga som är sann medan hämtning pågår
 */
export function useForberedInlamning(): {
  forberedInlamning: Ref<ForberedInlamning | undefined>;
  laddar: Ref<boolean>;
} {
  const { showMessageModal } = useModalStore();

  // Läses synkront redan här, så att den anropande sidan kan visa en
  // laddningsindikator från första renderingen i stället för att först blinka
  // till med det manuella uppladdningssteget
  const parameterValue = new URLSearchParams(window.location.search).get(
    QUERY_PARAMETER_NAME,
  );

  const forberedInlamning = ref<ForberedInlamning | undefined>();
  const laddar = ref<boolean>(parameterValue != null);

  onMounted(async () => {
    if (parameterValue == null) {
      return;
    }

    // Rensa parametern direkt, så att en omladdning av sidan inte hämtar filen
    // en gång till
    removeQueryParameter();

    const url = parseHttpsUrl(parameterValue);
    if (!url) {
      laddar.value = false; // parseHttpsUrl har redan loggat varför
      return;
    }

    try {
      forberedInlamning.value = await fetchArsredovisning(url);
    } catch (e) {
      console.warn(e);
      if (e instanceof OtillatenOriginError) {
        showMessageModal(
          `Årsredovisningen kommer från ${e.otillatenOrigin}, som inte är en ` +
            "godkänd källa. Du kan i stället ladda upp filen manuellt.",
          "Källan är inte godkänd",
        );
      } else {
        showMessageModal(
          `Årsredovisningen kunde inte hämtas från ${url.origin}. Filen kan ` +
            "vara ogiltig eller inte längre tillgänglig. Du kan i stället " +
            "ladda upp filen manuellt.",
          "Kunde inte hämta årsredovisningen",
        );
      }
    } finally {
      laddar.value = false;
    }
  });

  return { forberedInlamning, laddar };
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
 * @returns Den hämtade årsredovisningen, tillsammans med filen och den origin
 * den faktiskt kom ifrån
 * @throws Om källan inte är godkänd, filen inte kan hämtas, är för stor, eller
 * inte är en giltig `.gredorfardig`-fil
 */
async function fetchArsredovisning(url: URL): Promise<ForberedInlamning> {
  // Kontrollera redan innan hämtningen, så att Gredor inte ens gör ett anrop
  // till en källa utanför vitlistan
  assertOriginAllowed(url.origin);

  const response = await fetch(url, {
    credentials: "omit",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Unexpected status code ${response.status}`);
  }

  // Svaret kan komma från en annan adress än den vi bad om, om hämtningen har
  // vidarebefordrats. Det är den adressen filen faktiskt kom ifrån, och den vi
  // både måste kontrollera mot vitlistan och visa för användaren.
  const slutligUrl = new URL(response.url || url.href);
  if (slutligUrl.protocol !== "https:") {
    throw new Error("Response did not come from an https URL");
  }
  assertOriginAllowed(slutligUrl.origin);

  const json = await readBodyWithSizeLimit(response, MAX_FILE_SIZE_BYTES);

  // Exakt samma väg som vid manuell uppladdning, se SendRequestFiles
  const arsredovisning = parseGredorFile<Arsredovisning>(json, [
    "arsredovisning_fardig",
  ]).data;
  upgradeArsredovisningObject(arsredovisning);

  const gredorFile = new File([json], GREDOR_FILE_NAME, {
    type: "application/json",
  });

  return { arsredovisning, gredorFile, kallaOrigin: slutligUrl.origin };
}

/**
 * Kontrollerar att en origin finns i den konfigurerade vitlistan.
 *
 * @param origin - Origin som ska kontrolleras
 * @throws {OtillatenOriginError} Om en vitlista är konfigurerad och origin inte
 * finns med i den
 */
function assertOriginAllowed(origin: string) {
  const allowlist = getAllowlist();
  if (allowlist == null) {
    return; // Ingen vitlista konfigurerad — getAllowlist har redan varnat
  }
  if (!allowlist.has(origin)) {
    throw new OtillatenOriginError(origin);
  }
}

let harVarnatOmSaknadVitlista = false;

/**
 * Läser den konfigurerade vitlistan över godkända origins.
 *
 * @returns Ett set av godkända origins, eller `null` om ingen vitlista är
 * konfigurerad (då tillåts alla https-källor, men en varning loggas)
 */
function getAllowlist(): Set<string> | null {
  const raw = getConfigValue("VITE_PREPARED_SUBMISSION_ALLOWED_ORIGINS");
  if (!raw || !raw.trim()) {
    if (!harVarnatOmSaknadVitlista) {
      console.warn(
        "VITE_PREPARED_SUBMISSION_ALLOWED_ORIGINS är inte satt — förberedd " +
          "inlämning tillåter filer från vilken https-källa som helst.",
      );
      harVarnatOmSaknadVitlista = true;
    }
    return null;
  }

  return new Set(
    raw
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  );
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
