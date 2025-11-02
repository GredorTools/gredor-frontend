import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { RedovisningsvalutaSEK } from "@/data/redovisningsvalutor.ts";
import { AvgivandeStyrelsen } from "@/data/avgivande.ts";
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
    avgivande: AvgivandeStyrelsen,
    redovisningsvaluta: RedovisningsvalutaSEK,
    underskrifter: [
      {
        tilltalsnamn: "",
        efternamn: "",
        roll: "",
        datum: new Date().toISOString().split("T")[0],
      },
    ],
    undertecknandeOrt: "",
    datering: new Date().toISOString().split("T")[0],
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
    resultatdispositionStammans: {},
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
