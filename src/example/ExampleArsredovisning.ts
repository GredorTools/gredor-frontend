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
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:AllmantVerksamheten",
      type: "xbrli:stringItemType",
      text: "Verksamheten har varit att grilla körv.\n\nBolaget har sitt säte i Halmstads kommun.",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:VasentligaHandelserRakenskapsaret",
      type: "xbrli:stringItemType",
      text: "Mängden körv som grillas har ökat från 1st/månad till 2st/månad.",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:Flerarsoversikt",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Nettoomsattning",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "5000",
      beloppTidigareAr: ["3000", "1250", "2500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ResultatEfterFinansiellaPoster",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "3750",
      beloppTidigareAr: ["-1000", "500", "600"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapital",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalAktiekapitalAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Aktiekapital",
      labelType: "periodStartLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Aktiekapital",
      labelType: "periodEndLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      labelType: "periodStartLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "12000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeBalanseratResultatAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "-1000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      labelType: "periodEndLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "11000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "periodStartLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "-1000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeAretsResultatAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "1000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "periodEndLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotalt",
      labelType: "periodStartLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "36000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeTotaltAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalTotaltBalanserasNyRakning",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "0",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAretsResultat",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotalt",
      labelType: "periodEndLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "38978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Resultatdisposition",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelDisponeraAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "11000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapital",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "13978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForslagDispositionAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForslagDispositionBalanserasINyRakning",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "13978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForslagDisposition",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "13978",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  resultatrakning: [
    {
      taxonomyItemName: "se-gen-base:RorelseresultatAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Nettoomsattning",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "5000",
      beloppTidigareAr: ["3000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:RorelseintakterLagerforandringarMm",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "5000",
      beloppTidigareAr: ["3000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:OvrigaExternaKostnader",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "150",
      beloppTidigareAr: ["2900"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Personalkostnader",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "1100",
      beloppTidigareAr: ["1100"],
      not: "2",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Rorelsekostnader",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "1250",
      beloppTidigareAr: ["4000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Rorelseresultat",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "3750",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ResultatForeSkatt",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "3750",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:SkatterAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:SkattAretsResultat",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "772",
      beloppTidigareAr: ["0"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultat",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  balansrakning: [
    {
      taxonomyItemName: "se-gen-base:TillgangarAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:OmsattningstillgangarAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:KassaBankAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:KassaBankExklRedovisningsmedel",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "39278",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:KassaBank",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "39278",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Omsattningstillgangar",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "39278",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Tillgangar",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "39278",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:EgetKapitalSkulderAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:EgetKapitalAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BundetEgetKapitalAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Aktiekapital",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: ["25000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:BundetEgetKapital",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: ["25000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapitalAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "11000",
      beloppTidigareAr: ["12000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "2978",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapital",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "13978",
      beloppTidigareAr: ["11000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:EgetKapital",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "38978",
      beloppTidigareAr: ["36000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:OvrigaLangfristigaSkulder",
      labelType: "terseLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "750",
      beloppTidigareAr: ["500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:LangfristigaSkulder",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "750",
      beloppTidigareAr: ["500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:EgetKapitalSkulder",
      labelType: "totalLabel",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "39728",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  noter: [
    {
      taxonomyItemName: "se-gen-base:RedovisningsprinciperAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:RedovisningsVarderingsprinciper",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
      text: "Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:UpplysningarResultatrakningenAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:NotMedelantaletAnstallda",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelantaletAnstalldaAbstract",
      labelType: "terseLabel",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelantaletAnstallda",
      type: "xbrli:decimalItemType",
      beloppNuvarandeAr: "2",
      beloppTidigareAr: ["2"],
    } as Belopprad<"xbrli:decimalItemType">,
  ],
};
