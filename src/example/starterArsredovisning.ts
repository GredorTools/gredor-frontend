import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import { RedovisningsvalutaSEK } from "@/data/redovisningsvalutor.ts";
import { AvgivandeStyrelsen } from "@/data/avgivande.ts";
import type { Belopprad } from "@/model/arsredovisning/Belopprad.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

export const starterArsredovisning: Arsredovisning = {
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
      text: "Företaget bedriver [...].\n\nBolaget har sitt säte i [...] kommun.",
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
      beloppNuvarandeAr: "",
      beloppTidigareAr: ["", "", ""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:ResultatEfterFinansiellaPoster",
      parentTaxonomyItemName: "se-gen-base:Flerarsoversikt",
      type: "xbrli:monetaryItemType",
      beloppNuvarandeAr: "",
      beloppTidigareAr: ["", "", ""],
    } as Belopprad<"xbrli:monetaryItemType">,
    {
      taxonomyItemName: "se-gen-base:Soliditet",
      parentTaxonomyItemName: "se-gen-base:Flerarsoversikt",
      type: "xbrli:pureItemType",
      beloppNuvarandeAr: "",
      beloppTidigareAr: ["", "", ""],
    } as Belopprad<"xbrli:pureItemType">,
  ],
  resultatrakning: [],
  balansrakning: [],
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
      beloppNuvarandeAr: "",
      beloppTidigareAr: [""],
    } as Belopprad<"xbrli:decimalItemType">,
  ],
};
