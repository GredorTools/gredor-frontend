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
    { startdatum: "2023-01-01", slutdatum: "2023-12-31" },
    { startdatum: "2022-01-01", slutdatum: "2022-12-31" },
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
    {
      taxonomyItemName: "se-gen-base:Flerarsoversikt",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "5000",
      beloppTidigareAr: ["3000", "1250", "2500"],
      taxonomyItemName: "se-gen-base:Nettoomsattning",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppNuvarandeAr: "3750",
      beloppTidigareAr: ["-1000", "500", "600"],
      taxonomyItemName: "se-gen-base:ResultatEfterFinansiellaPoster",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapital",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalAktiekapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: [""],
      taxonomyItemName: "se-gen-base:Aktiekapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeBalanseratResultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "12000",
      beloppTidigareAr: [""],
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeAretsResultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "-12000",
      beloppTidigareAr: [""],
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: [""],
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeTotaltAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "0",
      beloppTidigareAr: [""],
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalTotaltBalanserasNyRakning",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: [""],
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAretsResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Resultatdisposition",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelDisponeraAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "11000",
      beloppTidigareAr: [""],
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: [""],
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppNuvarandeAr: "13978",
      beloppTidigareAr: ["0"],
      taxonomyItemName: "se-gen-base:FrittEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForslagDispositionAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "13978",
      beloppTidigareAr: [""],
      taxonomyItemName: "se-gen-base:ForslagDispositionBalanserasINyRakning",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppNuvarandeAr: "13978",
      beloppTidigareAr: [""],
      taxonomyItemName: "se-gen-base:ForslagDisposition",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
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
      beloppTidigareAr: ["3000"],
      beloppNuvarandeAr: "5000",
      taxonomyItemName: "se-gen-base:Nettoomsattning",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["3000"],
      beloppNuvarandeAr: "5000",
      taxonomyItemName: "se-gen-base:RorelseintakterLagerforandringarMm",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:RorelsekostnaderAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppTidigareAr: ["2900"],
      beloppNuvarandeAr: "150",
      taxonomyItemName: "se-gen-base:OvrigaExternaKostnader",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["1100"],
      beloppNuvarandeAr: "1100",
      not: "2",
      taxonomyItemName: "se-gen-base:Personalkostnader",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["4000"],
      beloppNuvarandeAr: "1250",
      taxonomyItemName: "se-gen-base:Rorelsekostnader",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["-1000"],
      beloppNuvarandeAr: "3750",
      taxonomyItemName: "se-gen-base:Rorelseresultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["-1000"],
      beloppNuvarandeAr: "3750",
      taxonomyItemName: "se-gen-base:ResultatEfterFinansiellaPoster",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["-1000"],
      beloppNuvarandeAr: "3750",
      taxonomyItemName: "se-gen-base:ResultatForeSkatt",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:SkatterAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppTidigareAr: ["0"],
      beloppNuvarandeAr: "772",
      taxonomyItemName: "se-gen-base:SkattAretsResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["-1000"],
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
      beloppTidigareAr: ["36500"],
      beloppNuvarandeAr: "39278",
      taxonomyItemName: "se-gen-base:KassaBankExklRedovisningsmedel",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["36500"],
      beloppNuvarandeAr: "39278",
      taxonomyItemName: "se-gen-base:KassaBank",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["36500"],
      beloppNuvarandeAr: "39278",
      taxonomyItemName: "se-gen-base:Omsattningstillgangar",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["36500"],
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
      beloppTidigareAr: ["25000"],
      beloppNuvarandeAr: "25000",
      taxonomyItemName: "se-gen-base:Aktiekapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["25000"],
      beloppNuvarandeAr: "25000",
      taxonomyItemName: "se-gen-base:BundetEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppTidigareAr: ["12000"],
      beloppNuvarandeAr: "11000",
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["-1000"],
      beloppNuvarandeAr: "2978",
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["11000"],
      beloppNuvarandeAr: "13978",
      taxonomyItemName: "se-gen-base:FrittEgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["36000"],
      beloppNuvarandeAr: "38978",
      taxonomyItemName: "se-gen-base:EgetKapital",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:KortfristigaSkulderAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppTidigareAr: ["500"],
      beloppNuvarandeAr: "750",
      taxonomyItemName: "se-gen-base:OvrigaKortfristigaSkulder",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["500"],
      beloppNuvarandeAr: "750",
      taxonomyItemName: "se-gen-base:KortfristigaSkulder",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppTidigareAr: ["36500"],
      beloppNuvarandeAr: "39728",
      taxonomyItemName: "se-gen-base:EgetKapitalSkulder",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  noter: [
    {
      taxonomyItemName: "se-gen-base:RedovisningsprinciperAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:RedovisningsVarderingsprinciper",
      text: "Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.",
      type: "xbrli:stringItemType",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:UpplysningarResultatrakningenAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:NotMedelantaletAnstallda",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelantaletAnstalldaAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppTidigareAr: ["2"],
      beloppNuvarandeAr: "2",
      taxonomyItemName: "se-gen-base:MedelantaletAnstallda",
      type: "xbrli:decimalItemType",
    } as Belopprad<"xbrli:decimalItemType">,
  ],
};
