import { base64encode } from "byte-base64";
import { readonly, ref } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { client } from "@/api/client.ts";

/**
 * En Vue-composable för att validera en årsredovisning genom anrop till
 * backend.
 *
 * @param composableParams - Parametrar för composable-funktionen. Fält:
 *   - apiErrorHandler - Callback-funktion för att hantera fel från API:et.
 *   - exceptionHandler - Callback-funktion för att hantera oväntade fel.
 */
export function useValidateSubmissionApi(composableParams: {
  apiErrorHandler: (message: string) => void;
  exceptionHandler: (error: Error) => void;
}) {
  const { apiErrorHandler, exceptionHandler } = composableParams;

  const loading = ref<boolean>(true);

  /**
   * Validerar årsredovisningen genom att anropa backend.
   *
   * @param params - Parametrar för anropet. Fält:
   *   - arsredovisning - Årsredovisningen som valideras.
   *   - ixbrl - Årsredovisningen i iXBRL-format.
   *   - discardFaststallelseintygValidations - Huruvida valideringar gällande
   *     fastställelseintyg ska ignoreras.
   */
  async function validateSubmission(params: {
    arsredovisning: Arsredovisning;
    ixbrl: string;
    discardFaststallelseintygValidations: boolean;
  }) {
    const { arsredovisning, ixbrl, discardFaststallelseintygValidations } =
      params;

    loading.value = true;
    try {
      const {
        data, // 2XX response
        error, // 4XX / 5XX response
      } = await client.POST("/v1/submission-flow/validate", {
        body: {
          foretagOrgnr:
            arsredovisning.foretagsinformation.organisationsnummer.replace(
              "-",
              "",
            ),
          ixbrl: base64encode(ixbrl),
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
        if (data.utfall) {
          if (discardFaststallelseintygValidations && data.utfall) {
            // Filtrera bort varningar kopplade till fastställelseintyget
            data.utfall = data.utfall.filter(
              (kontroll) =>
                kontroll.kod == null ||
                !["1103", "1164", "1169", "1179"].includes(kontroll.kod),
            );
          }

          if (arsredovisning.verksamhetsarTidigare.length === 0) {
            // Filtrera bort varningen "Jämförelsesiffror saknas i
            // resultaträkningen. De behövs om det inte är företagets första
            // räkenskapsår."
            data.utfall = data.utfall.filter(
              (kontroll) => kontroll.kod !== "3007",
            );
          }
        }
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
    validateSubmission,
  };
}
