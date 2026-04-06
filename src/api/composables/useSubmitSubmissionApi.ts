import { base64encode } from "byte-base64";
import { ref, readonly } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { client } from "@/api/client.ts";

/**
 * En Vue-composable för att ladda upp en årsredovisning till Bolagsverket genom
 * anrop till backend.
 *
 * @param composableParams - Parametrar för composable-funktionen. Fält:
 *   - apiErrorHandler - Callback-funktion för att hantera fel från API:et.
 *   - exceptionHandler - Callback-funktion för att hantera oväntade fel.
 */
export function useSubmitSubmissionApi(composableParams: {
  apiErrorHandler: (message: string) => void;
  exceptionHandler: (error: Error) => void;
}) {
  const { apiErrorHandler, exceptionHandler } = composableParams;

  const loading = ref<boolean>(true);

  /**
   * Laddar upp årsredovisningen till Bolagsverket genom att anropa backend.
   *
   * @param params - Parametrar för anropet. Fält:
   *   - arsredovisning - Årsredovisningen som valideras.
   *   - ixbrl - Årsredovisningen i iXBRL-format.
   *   - notificationEmail - E-postadress som Bolagsverket kan skicka
   *     aviseringar till.
   */
  async function submitSubmission(params: {
    arsredovisning: Arsredovisning;
    ixbrl: string;
    notificationEmail: string;
  }) {
    const { arsredovisning, ixbrl, notificationEmail } = params;

    loading.value = true;
    try {
      const {
        data, // 2XX response
        error, // 4XX / 5XX response
      } = await client.POST("/v1/submission-flow/submit", {
        body: {
          foretagOrgnr:
            arsredovisning.foretagsinformation.organisationsnummer.replace(
              "-",
              "",
            ),
          ixbrl: base64encode(ixbrl),
          aviseringEpost: notificationEmail,
        },
        params: {
          cookie: {
            personalNumber: "dummy", // Skrivs över av webbläsaren
          },
        },
        credentials: "include", // Viktigt för att cookies ska funka
      });

      if (error) {
        apiErrorHandler(error);
      } else if (data) {
        return data;
      }
    } catch (e) {
      if (e instanceof Error) {
        exceptionHandler(e);
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    loading: readonly(loading),
    submitSubmission,
  };
}
