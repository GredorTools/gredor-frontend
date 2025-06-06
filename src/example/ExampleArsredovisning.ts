import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { RedovisningsvalutaSEK } from "@/data/redovisningsvalutor.ts";
import { ForfattareStyrelsenOchVD } from "@/data/forfattare.ts";
import { ResultatdispositionBeslutGodkannaVinst } from "@/data/faststallelseintyg.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";

export const exampleArsredovisning: Arsredovisning = {
  metadata: {
    taxonomiTyp: "k2",
    taxonomiVersion: "2021-10-31",
  },
  foretagsinformation: {
    foretagsnamn: "Exempelbolaget AB",
    organisationsnummer: "556999-9999",
  },
  redovisningsinformation: {
    forfattare: ForfattareStyrelsenOchVD,
    redovisningsvaluta: RedovisningsvalutaSEK,
    underskrifter: [
      {
        tilltalsnamn: "Karl",
        efternamn: "Karlsson",
        roll: "",
        datum: "2026-03-12",
      },
      {
        tilltalsnamn: "Karin",
        efternamn: "Olsson",
        roll: "Verkställande direktör",
        datum: "2026-03-12",
      },
    ],
    underskriftOrt: "Sundsvall",
  },
  faststallelseintyg: {
    resultatdispositionBeslut: ResultatdispositionBeslutGodkannaVinst,
    underskrift: {
      tilltalsnamn: "Karl",
      efternamn: "Karlsson",
      roll: "Styrelseledamot",
      datum: "2026-04-05",
    },
  },
  verksamhetsarNuvarande: {
    startdatum: "2025-01-01",
    slutdatum: "2025-12-31",
  },
  verksamhetsarTidigare: [
    { startdatum: "2024-01-01", slutdatum: "2024-12-31" },
  ],
  forvaltningsberattelse: [
    {
      taxonomyItemName: "se-gen-base:VerksamhetenAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:AllmantVerksamheten",
      text: "Verksamheten har varit att grilla körv.\n\nBolaget har sitt säte i Halmstads kommun.",
      type: "xbrli:stringItemType",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:VasentligaHandelserRakenskapsaret",
      text: "Mängden körv som grillas har ökat från 1st/månad till 2st/månad.",
      type: "xbrli:stringItemType",
    } as Belopprad<"xbrli:stringItemType">,
  ],
  resultatrakning: [
    {
      taxonomyItemName: "se-gen-base:RorelseresultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppForegaendeAr: "3000",
      beloppNuvarandeAr: "5000",
      taxonomyItemName: "se-gen-base:Nettoomsattning",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "3000",
      beloppNuvarandeAr: "5000",
      taxonomyItemName: "se-gen-base:RorelseintakterLagerforandringarMm",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:RorelsekostnaderAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppForegaendeAr: "2900",
      beloppNuvarandeAr: "150",
      taxonomyItemName: "se-gen-base:OvrigaExternaKostnader",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "1100",
      beloppNuvarandeAr: "1100",
      taxonomyItemName: "se-gen-base:Personalkostnader",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "4000",
      beloppNuvarandeAr: "1250",
      taxonomyItemName: "se-gen-base:Rorelsekostnader",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "-1000",
      beloppNuvarandeAr: "3750",
      taxonomyItemName: "se-gen-base:Rorelseresultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "-1000",
      beloppNuvarandeAr: "3750",
      taxonomyItemName: "se-gen-base:ResultatEfterFinansiellaPoster",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "-1000",
      beloppNuvarandeAr: "3750",
      taxonomyItemName: "se-gen-base:ResultatForeSkatt",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:SkatterAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppForegaendeAr: "0",
      beloppNuvarandeAr: "772",
      taxonomyItemName: "se-gen-base:SkattAretsResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "-1000",
      beloppNuvarandeAr: "2978",
      taxonomyItemName: "se-gen-base:AretsResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  balansrakning: [
    {
      taxonomyItemName: "se-gen-base:TillgangarAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:OmsattningstillgangarAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:KassaBankAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppForegaendeAr: "36500",
      beloppNuvarandeAr: "39278",
      taxonomyItemName: "se-gen-base:KassaBankExklRedovisningsmedel",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "36500",
      beloppNuvarandeAr: "39278",
      taxonomyItemName: "se-gen-base:KassaBank",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "36500",
      beloppNuvarandeAr: "39278",
      taxonomyItemName: "se-gen-base:Omsattningstillgangar",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "36500",
      beloppNuvarandeAr: "39278",
      taxonomyItemName: "se-gen-base:Tillgangar",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:EgetKapitalSkulderAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:EgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BundetEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppForegaendeAr: "25000",
      beloppNuvarandeAr: "25000",
      taxonomyItemName: "se-gen-base:Aktiekapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "25000",
      beloppNuvarandeAr: "25000",
      taxonomyItemName: "se-gen-base:BundetEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppForegaendeAr: "12000",
      beloppNuvarandeAr: "11000",
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "-1000",
      beloppNuvarandeAr: "2978",
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "11000",
      beloppNuvarandeAr: "13978",
      taxonomyItemName: "se-gen-base:FrittEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "36000",
      beloppNuvarandeAr: "38978",
      taxonomyItemName: "se-gen-base:EgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:KortfristigaSkulderAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppForegaendeAr: "500",
      beloppNuvarandeAr: "750",
      taxonomyItemName: "se-gen-base:OvrigaKortfristigaSkulder",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "500",
      beloppNuvarandeAr: "750",
      taxonomyItemName: "se-gen-base:KortfristigaSkulder",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppForegaendeAr: "36500",
      beloppNuvarandeAr: "39728",
      taxonomyItemName: "se-gen-base:EgetKapitalSkulder",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  noter: [],
};
