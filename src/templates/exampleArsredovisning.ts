import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { RedovisningsvalutaSEK } from "@/data/redovisningsvalutor.ts";
import { AvgivandeStyrelsenOchVD } from "@/data/avgivande.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

export const exampleArsredovisning: Arsredovisning = {
  metadata: {
    taxonomiTyp: "k2",
    taxonomiVersion: "2021-10-31",
  },
  foretagsinformation: {
    foretagsnamn: "Exempelbolaget AB",
    organisationsnummer: "556002-1361",
    logotyp: {
      base64: null,
      placering: "höger",
    },
  },
  redovisningsinformation: {
    avgivande: AvgivandeStyrelsenOchVD,
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
    undertecknandeOrt: "Halmstad",
    datering: "2026-03-12",
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
    { startdatum: "2023-01-01", slutdatum: "2023-12-31" },
    { startdatum: "2022-01-01", slutdatum: "2022-12-31" },
  ],
  forvaltningsberattelse: [
    {
      taxonomyItemName: "se-gen-base:VerksamhetenAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForvaltningsberattelseAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:AllmantVerksamheten",
      parentTaxonomyItemName: "se-gen-base:VerksamhetenAbstract",
      type: "xbrli:stringItemType",
      text: "Verksamheten har varit att grilla körv.\n\nBolaget har sitt säte i Halmstads kommun.",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:VasentligaHandelserRakenskapsaret",
      parentTaxonomyItemName: "se-gen-base:VerksamhetenAbstract",
      type: "xbrli:stringItemType",
      text: "Mängden körv som grillas har ökat från 1st/månad till 2st/månad.",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:Flerarsoversikt",
      parentTaxonomyItemName: "se-gen-base:ForvaltningsberattelseAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Nettoomsattning",
      parentTaxonomyItemName: "se-gen-base:Flerarsoversikt",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "15000",
      beloppTidigareAr: ["3000", "1250", "2500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ResultatEfterFinansiellaPoster",
      parentTaxonomyItemName: "se-gen-base:Flerarsoversikt",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "10750",
      beloppTidigareAr: ["-1000", "500", "600"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Soliditet",
      parentTaxonomyItemName: "se-gen-base:Flerarsoversikt",
      type: "xbrli:pureItemType",
      beloppNuvarandeAr: "98",
      beloppTidigareAr: ["99", "95", "73"],
    } as Belopprad<"xbrli:pureItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapital",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForvaltningsberattelseAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapital",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalAktiekapitalAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Aktiekapital",
      labelType: "periodStartLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAktiekapitalAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Aktiekapital",
      labelType: "periodEndLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAktiekapitalAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      labelType: "periodStartLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "12000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeBalanseratResultatAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeBalanseratResultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "-1000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      labelType: "periodEndLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalBalanseratResultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "11000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "periodStartLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "-1000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeAretsResultatAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeAretsResultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "1000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeAretsResultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "8742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "periodEndLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalAretsResultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "8742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotalt",
      labelType: "periodStartLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "36000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeTotaltAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:ForandringEgetKapitalTotaltBalanserasNyRakning",
      labelType: "totalLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeTotaltAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "0",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAretsResultat",
      labelType: "totalLabel",
      parentTaxonomyItemName:
        "se-gen-base:ForandringEgetKapitalIngaendeTotaltAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "8742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForandringEgetKapitalTotalt",
      labelType: "periodEndLabel",
      parentTaxonomyItemName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "44742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Resultatdisposition",
      parentTaxonomyItemName: "se-gen-base:ForvaltningsberattelseAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelDisponeraAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:Resultatdisposition",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      parentTaxonomyItemName: "se-gen-base:MedelDisponeraAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "11000",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:MedelDisponeraAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "8742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapital",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:Resultatdisposition",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "19742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForslagDispositionAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:Resultatdisposition",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:ForslagDispositionBalanserasINyRakning",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:ForslagDispositionAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "19742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ForslagDisposition",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:Resultatdisposition",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "19742",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  resultatrakning: [
    {
      taxonomyItemName: "se-gen-base:RorelseresultatAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName:
        "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:RorelseresultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Nettoomsattning",
      parentTaxonomyItemName:
        "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "15000",
      beloppTidigareAr: ["3000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:RorelseintakterLagerforandringarMm",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:RorelseresultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "15000",
      beloppTidigareAr: ["3000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:RorelseresultatAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:OvrigaExternaKostnader",
      parentTaxonomyItemName: "se-gen-base:RorelsekostnaderAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "150",
      beloppTidigareAr: ["2900"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Personalkostnader",
      parentTaxonomyItemName: "se-gen-base:RorelsekostnaderAbstract",
      type: "xbrli:monetaryItemType",
      not: "2",
      beloppNuvarandeAr: "1100",
      beloppTidigareAr: ["1100"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Rorelsekostnader",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:RorelseresultatAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "1250",
      beloppTidigareAr: ["4000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Rorelseresultat",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "13750",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      taxonomyItemName: "se-gen-base:FinansiellaPosterAbstract",
      type: "xbrli:stringItemType",
    },
    {
      beloppNuvarandeAr: "3000",
      beloppTidigareAr: [""],
      parentTaxonomyItemName: "se-gen-base:FinansiellaPosterAbstract",
      taxonomyItemName: "se-gen-base:RantekostnaderLiknandeResultatposter",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      beloppNuvarandeAr: "-3000",
      beloppTidigareAr: ["0"],
      labelType: "totalLabel",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      taxonomyItemName: "se-gen-base:FinansiellaPoster",
      type: "xbrli:monetaryItemType",
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ResultatEfterFinansiellaPoster",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "10750",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ResultatForeSkatt",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "10750",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:SkatterAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:SkattAretsResultat",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:SkatterAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "2008",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultat",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "8742",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  balansrakning: [
    {
      taxonomyItemName: "se-gen-base:TillgangarAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:BalansrakningAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:OmsattningstillgangarAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:TillgangarAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:KassaBankAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:OmsattningstillgangarAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:KassaBankExklRedovisningsmedel",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:KassaBankAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "45492",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:KassaBank",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:OmsattningstillgangarAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "45492",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Omsattningstillgangar",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:TillgangarAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "45492",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Tillgangar",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:BalansrakningAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "45492",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:EgetKapitalSkulderAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:BalansrakningAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:EgetKapitalAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalSkulderAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BundetEgetKapitalAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:Aktiekapital",
      parentTaxonomyItemName: "se-gen-base:BundetEgetKapitalAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: ["25000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:BundetEgetKapital",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "25000",
      beloppTidigareAr: ["25000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapitalAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:BalanseratResultat",
      parentTaxonomyItemName: "se-gen-base:FrittEgetKapitalAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "11000",
      beloppTidigareAr: ["12000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:AretsResultatEgetKapital",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:FrittEgetKapitalAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "8742",
      beloppTidigareAr: ["-1000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:FrittEgetKapital",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "19742",
      beloppTidigareAr: ["11000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:EgetKapital",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalSkulderAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "44742",
      beloppTidigareAr: ["36000"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalSkulderAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:OvrigaKortfristigaSkulder",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:KortfristigaSkulderAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "750",
      beloppTidigareAr: ["500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:KortfristigaSkulder",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:EgetKapitalSkulderAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "750",
      beloppTidigareAr: ["500"],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:EgetKapitalSkulder",
      labelType: "totalLabel",
      parentTaxonomyItemName: "se-gen-base:BalansrakningAbstract",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "45492",
      beloppTidigareAr: ["36500"],
    } as Belopprad<"xbrli:monetaryItemType">,
  ],
  noter: [
    {
      taxonomyItemName: "se-gen-base:RedovisningsprinciperAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:NoterAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:RedovisningsVarderingsprinciper",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:RedovisningsprinciperAbstract",
      type: "xbrli:stringItemType",
      text: "Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.",
    } as Belopprad<"xbrli:stringItemType">,
    {
      taxonomyItemName: "se-gen-base:UpplysningarResultatrakningenAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:NoterAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:NotMedelantaletAnstallda",
      labelType: "terseLabel",
      parentTaxonomyItemName:
        "se-gen-base:UpplysningarResultatrakningenAbstract",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelantaletAnstalldaAbstract",
      labelType: "terseLabel",
      parentTaxonomyItemName: "se-gen-base:NotMedelantaletAnstallda",
      type: "xbrli:stringItemType",
    },
    {
      taxonomyItemName: "se-gen-base:MedelantaletAnstallda",
      parentTaxonomyItemName: "se-gen-base:MedelantaletAnstalldaAbstract",
      type: "xbrli:decimalItemType",
      beloppNuvarandeAr: "2",
      beloppTidigareAr: ["2"],
    } as Belopprad<"xbrli:decimalItemType">,
  ],
  gredorState: {
    todoList: {
      items: [],
    },
  },
};
