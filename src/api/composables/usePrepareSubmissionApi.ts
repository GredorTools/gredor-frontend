import { readonly, ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import createClient from "openapi-fetch";
import type { paths } from "@/api/schema/gredor-backend-v1";
import { getConfigValue } from "@/util/configUtils.ts";

/**
 * En Vue-composable för att förbereda inför validering/inskick av
 * årsredovisning. Används till att hämta avtalstext för eget utrymme hos
 * Bolagsverket.
 *
 * @param composableParams - Parametrar för composable-funktionen. Fält:
 *   - apiErrorHandler - Callback-funktion för att hantera fel från API:et.
 *   - exceptionHandler - Callback-funktion för att hantera oväntade fel.
 */
export function usePrepareSubmissionApi(composableParams: {
  apiErrorHandler: (message: string) => void;
  exceptionHandler: (error: Error) => void;
}) {
  const { apiErrorHandler, exceptionHandler } = composableParams;

  const loading = ref<boolean>(true);

  /**
   * Förbereder inför validering/inskick av en årsredovisning och hämtar
   * avtalstext för Bolagsverkets egna utrymme, genom att anropa backend.
   *
   * @param params - Parametrar för anropet.
   *   - arsredovisning - Årsredovisningen som ska valideras/skickas in senare.
   */
  async function prepareSubmission(params: { arsredovisning: Arsredovisning }) {
    const { arsredovisning } = params;

    loading.value = true;
    try {
      const client = createClient<paths>({
        baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
      });

      const {
        data, // 2XX response
        error, // 4XX / 5XX response
      } = await client.POST("/v1/submission-flow/prepare", {
        body: {
          foretagOrgnr:
            arsredovisning.foretagsinformation.organisationsnummer.replace(
              "-",
              "",
            ),
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
    prepareSubmission,
  };
}
