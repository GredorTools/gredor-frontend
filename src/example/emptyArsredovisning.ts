import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { RedovisningsvalutaSEK } from "@/data/redovisningsvalutor.ts";
import { ForfattareStyrelsen } from "@/data/forfattare.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

export const emptyArsredovisning: Arsredovisning = {
  metadata: {
    taxonomiTyp: "k2",
    taxonomiVersion: "2021-10-31",
  },
  foretagsinformation: {
    foretagsnamn: "",
    organisationsnummer: "",
  },
  redovisningsinformation: {
    forfattare: ForfattareStyrelsen,
    redovisningsvaluta: RedovisningsvalutaSEK,
    underskrifter: [
      {
        tilltalsnamn: "",
        efternamn: "",
        roll: "",
        datum: new Date().toISOString().split("T")[0],
      },
    ],
    underskriftOrt: "",
  },
  installningar: {
    flerarsoversiktBeloppFormat: BeloppFormat.TUSENTAL,
  },
  faststallelseintyg: {
    datumArsstamma: "",
    resultatdispositionBeslut: {
      text: "",
      xbrlId: "",
    },
    underskrift: {
      tilltalsnamn: "",
      efternamn: "",
      roll: "",
      datum: "",
    },
  },
  verksamhetsarNuvarande: {
    startdatum: "2025-01-01",
    slutdatum: "2025-12-31",
  },
  verksamhetsarTidigare: [
    { startdatum: "2024-01-01", slutdatum: "2024-12-31" },
  ],
  forvaltningsberattelse: [],
  resultatrakning: [],
  balansrakning: [],
  noter: [],
};
