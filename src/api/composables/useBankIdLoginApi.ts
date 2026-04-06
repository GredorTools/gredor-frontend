import { computed, readonly, ref } from "vue";
import type { components } from "@/api/schema/gredor-backend-v1";
import { client } from "@/api/client.ts";

/**
 * En Vue-composable för att hantera BankID-inloggning.
 *
 * @param composableParams - Parametrar för composable-funktionen. Fält:
 *   - personalNumber - Personnummer för användaren som ska vara inloggad.
 *   - apiErrorHandler - Callback-funktion för att hantera fel från API:et.
 *   - exceptionHandler - Callback-funktion för att hantera oväntade fel.
 */
export function useBankIdLoginApi(composableParams: {
  personalNumber: string;
  apiErrorHandler: (message: string) => void;
  exceptionHandler: (error: Error) => void;
}) {
  const { personalNumber, apiErrorHandler, exceptionHandler } =
    composableParams;

  const stage = ref<
    | "checkAuthStatus" // kollar om redan legitimerad
    | "showInfo" // visar info om legitimering
    | "loadingQrCode" // laddar QR-koden
    | "showQrCodeOrAuthResult" // visar QR-koden eller resultatet av legitimeringen
    | "callFailure" // anrop till BankID misslyckades
  >("checkAuthStatus");
  const authResult = ref<
    components["schemas"]["BankIdStatusResponse"] | undefined
  >();
  const orderRef = ref<string | null | undefined>();
  const autoStartToken = ref<string | null | undefined>();
  const aborted = ref<boolean>(false);

  /**
   * Kontrollerar om användaren redan är inloggad. Om ja sätts stage till
   * showQrCodeOrAuthResult, annars sätts stage till showInfo. Denna funktion
   * ska köras först i autentiseringsflödet.
   */
  async function checkAuthStatus() {
    try {
      const {
        data, // 2XX response
        error, // 4XX / 5XX response
      } = await client.POST("/v1/auth/status", {
        body: {
          personalNumber,
        },
        credentials: "include", // Viktigt för att cookies ska funka
      });

      if (error) {
        apiErrorHandler(error);
        stage.value = "callFailure";
      } else if (data?.loggedIn) {
        authResult.value = {
          status: "COMPLETE",
        };
        stage.value = "showQrCodeOrAuthResult";
      } else {
        stage.value = "showInfo";
      }
    } catch (e) {
      if (e instanceof Error) {
        exceptionHandler(e);
      }
      stage.value = "callFailure";
    }
  }

  /**
   * Initierar inloggning med BankID.
   */
  async function initLogin() {
    stage.value = "loadingQrCode";
    try {
      const {
        data, // 2XX response
        error, // 4XX / 5XX response
      } = await client.POST("/v1/bankid/init", {
        body: {
          personalNumber,
        },
        credentials: "include", // Viktigt för att cookies ska funka
      });

      if (error) {
        apiErrorHandler(error);
        stage.value = "callFailure";
      } else if (data) {
        authResult.value = data;
        orderRef.value = data.orderRef;
        autoStartToken.value = data.autoStartToken;
        stage.value = "showQrCodeOrAuthResult";
        setTimeout(() => {
          checkLoginOrderStatus();
        }, 1000);
      }
    } catch (e) {
      if (e instanceof Error) {
        exceptionHandler(e);
      }
      stage.value = "callFailure";
    }
  }

  /**
   * Avbryter eventuell pågående inloggningsprocess. Denna composable kommer
   * inte kunna återanvändas efter att denna funktion har körts.
   */
  function abortLogin() {
    aborted.value = true;
  }

  async function checkLoginOrderStatus() {
    if (aborted.value || !orderRef.value) {
      return;
    }

    try {
      const {
        data, // 2XX response
        error, // 4XX / 5XX response
      } = await client.POST("/v1/bankid/status", {
        body: {
          orderRef: orderRef.value,
        },
        credentials: "include", // Viktigt för att cookies ska funka
      });

      if (error) {
        setTimeout(() => {
          checkLoginOrderStatus();
        }, 1000);
      } else if (data) {
        authResult.value = data;
        if (data.status === "PENDING") {
          setTimeout(() => {
            checkLoginOrderStatus();
          }, 1000);
        }
      }
    } catch {
      // Försök igen ändå
      setTimeout(() => {
        checkLoginOrderStatus();
      }, 1000);
    }
  }

  return {
    stage: readonly(stage),
    authResult: readonly(authResult),
    autoStartLink: computed(
      () => `bankid:///?autostarttoken=${autoStartToken.value}`,
    ),
    checkAuthStatus,
    initLogin,
    abortLogin,
  };
}
