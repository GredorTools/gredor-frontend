import { readonly, ref } from "vue";
import { client } from "@/api/client.ts";

/**
 * En Vue-composable för att hämta företagsinformation.
 *
 * @param composableParams - Parametrar för composable-funktionen. Fält:
 *   - apiErrorHandler - Callback-funktion för att hantera fel från API:et.
 *   - exceptionHandler - Callback-funktion för att hantera oväntade fel.
 */
export function useCompanyRecordsApi(composableParams: {
  apiErrorHandler: (message: string) => void;
  exceptionHandler: (error: Error) => void;
}) {
  const { apiErrorHandler, exceptionHandler } = composableParams;

  const loading = ref<boolean>(true);

  /**
   * Hämtar företagsinformation från backend.
   *
   * @param params - Parametrar för anropet.
   *   - organisationsnummer - Företagets organisationsnummer.
   */
  async function fetchCompanyRecords(params: { organisationsnummer: string }) {
    const { organisationsnummer } = params;

    loading.value = true;
    try {
      const {
        data, // 2XX response
        error, // 4XX / 5XX response
      } = await client.GET("/v1/information/records/{orgnr}", {
        params: {
          path: {
            orgnr: organisationsnummer.replace("-", ""),
          },
        },
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
    fetchCompanyRecords,
  };
}
