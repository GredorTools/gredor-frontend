/**
 * Mappningar från BAS-konton till taxonomiobjekt.
 *
 * Ej automatgenererad, får redigeras manuellt :)
 */

import type { SieMapping } from "@/util/sieUtils.ts";

export const SIE_MAPPINGS: SieMapping[] = [
  // Förvaltningsberättelse: Flerårsöversikt
  {
    basAccounts: [{ start: 3000, end: 3799 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:Nettoomsattning",
      parentName: "se-gen-base:Flerarsoversikt",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 3000, end: 8499 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:ResultatEfterFinansiellaPoster",
      parentName: "se-gen-base:Flerarsoversikt",
      labelType: null,
    },
  },
  // TODO: Förvaltningsberättelse: förändringar i eget kapital
  {
    basAccounts: [{ start: 3000, end: 8499 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:ResultatEfterFinansiellaPoster",
      parentName: "se-gen-base:Flerarsoversikt",
      labelType: null,
    },
  },
  // Förvaltningsberättelse: resultatdisposition
  {
    basAccounts: [{ start: 2097, end: 2097 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:Overkursfond",
      parentName: "se-gen-base:MedelDisponeraAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2091, end: 2091 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:BalanseratResultat",
      parentName: "se-gen-base:MedelDisponeraAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2099, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:AretsResultatEgetKapital",
      parentName: "se-gen-base:MedelDisponeraAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2090, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:FrittEgetKapital",
      parentName: "se-gen-base:Resultatdisposition",
      labelType: "terseLabel",
    },
  },
  // Resultaträkning
  {
    basAccounts: [{ start: 3000, end: 3799 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:Nettoomsattning",
      parentName: "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 4940, end: 4959 },
      { start: 4970, end: 4979 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ForandringLagerProdukterIArbeteFardigaVarorPagaendeArbetenAnnansRakning",
      parentName: "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 3800, end: 3899 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:AktiveratArbeteEgenRakning",
      parentName: "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 3900, end: 3999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:OvrigaRorelseintakter",
      parentName: "se-gen-base:RorelsensIntakterLagerforandringarMmAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 3000, end: 3999 },
      { start: 4940, end: 4959 },
      { start: 4970, end: 4979 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:RorelseintakterLagerforandringarMm",
      parentName: "se-gen-base:RorelseresultatAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [
      { start: 4000, end: 4799 },
      { start: 4910, end: 4939 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:RavarorFornodenheterKostnader",
      parentName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 4960, end: 4969 },
      { start: 4980, end: 4989 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:HandelsvarorKostnader",
      parentName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 5000, end: 6999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:OvrigaExternaKostnader",
      parentName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 7000, end: 7699 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:Personalkostnader",
      parentName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 7710, end: 7739 },
      { start: 7760, end: 7789 },
      { start: 7800, end: 7899 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:AvskrivningarNedskrivningarMateriellaImmateriellaAnlaggningstillgangar",
      parentName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 7740, end: 7749 },
      { start: 7790, end: 7799 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:NedskrivningarOmsattningstillgangarUtoverNormalaNedskrivningar",
      parentName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 7900, end: 7999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:OvrigaRorelsekostnader",
      parentName: "se-gen-base:RorelsekostnaderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 4000, end: 4939 },
      { start: 4960, end: 4969 },
      { start: 4980, end: 7999 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:Rorelsekostnader",
      parentName: "se-gen-base:RorelseresultatAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 3000, end: 7999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:Rorelseresultat",
      parentName: "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8010, end: 8069 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ResultatAndelarKoncernforetag",
      parentName: "se-gen-base:FinansiellaPosterAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 8111, end: 8112 },
      { start: 8116, end: 8117 },
      { start: 8121, end: 8122 },
      { start: 8131, end: 8132 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ResultatAndelarIntresseforetagGemensamtStyrda",
      parentName: "se-gen-base:FinansiellaPosterAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 8113, end: 8113 },
      { start: 8118, end: 8118 },
      { start: 8123, end: 8123 },
      { start: 8133, end: 8133 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ResultatOvrigaforetagAgarintresse",
      parentName: "se-gen-base:FinansiellaPosterAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 8210, end: 8269 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ResultatOvrigaFinansiellaAnlaggningstillgangar",
      parentName: "se-gen-base:FinansiellaPosterAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 8310, end: 8369 },
      { start: 8390, end: 8399 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:OvrigaRanteintakterLiknandeResultatposter",
      parentName: "se-gen-base:FinansiellaPosterAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 8070, end: 8089 },
      { start: 8170, end: 8189 },
      { start: 8270, end: 8289 },
      { start: 8370, end: 8389 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:NedskrivningarFinansiellaAnlaggningstillgangarKortfristigaPlaceringar",
      parentName: "se-gen-base:FinansiellaPosterAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8400, end: 8499 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:RantekostnaderLiknandeResultatposter",
      parentName: "se-gen-base:FinansiellaPosterAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8010, end: 8499 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:FinansiellaPoster",
      parentName: "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 3000, end: 8499 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ResultatEfterFinansiellaPoster",
      parentName: "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8820, end: 8829 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ErhallnaKoncernbidrag",
      parentName: "se-gen-base:BokslutsdispositionerAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8830, end: 8839 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:LamnadeKoncernbidrag",
      parentName: "se-gen-base:BokslutsdispositionerAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8810, end: 8819 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ForandringPeriodiseringsfond",
      parentName: "se-gen-base:BokslutsdispositionerAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8850, end: 8859 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ForandringOveravskrivningar",
      parentName: "se-gen-base:BokslutsdispositionerAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 8840, end: 8849 },
      { start: 8860, end: 8899 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:OvrigaBokslutsdispositioner",
      parentName: "se-gen-base:BokslutsdispositionerAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 8800, end: 8899 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:Bokslutsdispositioner",
      parentName: "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 3000, end: 8899 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ResultatForeSkatt",
      parentName: "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8910, end: 8939 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:SkattAretsResultat",
      parentName: "se-gen-base:SkatterAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 8980, end: 8989 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:OvrigaSkatter",
      parentName: "se-gen-base:SkatterAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 8999, end: 8999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:AretsResultat",
      parentName: "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      labelType: "terseLabel",
    },
  },
  // Balansräkning: tillgångar
  {
    basAccounts: [{ start: 1690, end: 1699 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:TecknatEjInbetaltKapital",
      parentName: "se-gen-base:TillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1020, end: 1059 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:KoncessionerPatentLicenserVarumarkenLiknandeRattigheter",
      parentName: "se-gen-base:ImmateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1060, end: 1069 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:HyresratterLiknandeRattigheter",
      parentName: "se-gen-base:ImmateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1070, end: 1079 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Goodwill",
      parentName: "se-gen-base:ImmateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1080, end: 1089 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ForskottImmateriellaAnlaggningstillgangar",
      parentName: "se-gen-base:ImmateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1000, end: 1099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ImmateriellaAnlaggningstillgangar",
      parentName: "se-gen-base:AnlaggningstillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [
      { start: 1100, end: 1119 },
      { start: 1130, end: 1179 },
      { start: 1190, end: 1199 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ByggnaderMark",
      parentName: "se-gen-base:MateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 1200, end: 1219 },
      { start: 1240, end: 1269 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:MaskinerAndraTekniskaAnlaggningar",
      parentName: "se-gen-base:MateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1220, end: 1239 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:InventarierVerktygInstallationer",
      parentName: "se-gen-base:MateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1120, end: 1129 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ForbattringsutgifterAnnansFastighet",
      parentName: "se-gen-base:MateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1290, end: 1299 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaMateriellaAnlaggningstillgangar",
      parentName: "se-gen-base:MateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 1180, end: 1189 },
      { start: 1280, end: 1289 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:PagaendeNyanlaggningarForskottMateriellaAnlaggningstillgangar",
      parentName: "se-gen-base:MateriellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1100, end: 1299 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:MateriellaAnlaggningstillgangar",
      parentName: "se-gen-base:AnlaggningstillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1310, end: 1319 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AndelarKoncernforetag",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1320, end: 1329 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FordringarKoncernforetagLangfristiga",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1331, end: 1334 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AndelarIntresseforetagGemensamtStyrdaForetag",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1341, end: 1344 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FordringarIntresseforetagGemensamtStyrdaForetagLangfristiga",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1336, end: 1337 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AgarintressenOvrigaForetag",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1346, end: 1347 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FordringarOvrigaForetagAgarintresseLangfristiga",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1350, end: 1359 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AndraLangfristigaVardepappersinnehav",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1360, end: 1369 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:LanDelagareNarstaende",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1380, end: 1389 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AndraLangfristigaFordringar",
      parentName: "se-gen-base:FinansiellaAnlaggningstillgangarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1300, end: 1399 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FinansiellaAnlaggningstillgangar",
      parentName: "se-gen-base:AnlaggningstillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1000, end: 1399 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Anlaggningstillgangar",
      parentName: "se-gen-base:TillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1410, end: 1439 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:LagerRavarorFornodenheter",
      parentName: "se-gen-base:VarulagerMmAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1440, end: 1449 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:LagerVarorUnderTillverkning",
      parentName: "se-gen-base:VarulagerMmAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1450, end: 1469 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:LagerFardigaVarorHandelsvaror",
      parentName: "se-gen-base:VarulagerMmAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1490, end: 1499 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaLagertillgangar",
      parentName: "se-gen-base:VarulagerMmAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1470, end: 1479 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:PagaendeArbetenAnnansRakningOmsattningstillgangar",
      parentName: "se-gen-base:VarulagerMmAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1480, end: 1489 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ForskottTillLeverantorer",
      parentName: "se-gen-base:VarulagerMmAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1400, end: 1499 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:VarulagerMm",
      parentName: "se-gen-base:OmsattningstillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1510, end: 1559 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Kundfordringar",
      parentName: "se-gen-base:KortfristigaFordringarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 1560, end: 1569 },
      { start: 1660, end: 1669 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FordringarKoncernforetagKortfristiga",
      parentName: "se-gen-base:KortfristigaFordringarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 1571, end: 1572 },
      { start: 1671, end: 1672 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FordringarIntresseforetagGemensamtStyrdaForetagKortfristiga",
      parentName: "se-gen-base:KortfristigaFordringarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 1573, end: 1573 },
      { start: 1663, end: 1673 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FordringarOvrigaforetagAgarintresseKortfristiga",
      parentName: "se-gen-base:KortfristigaFordringarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 1610, end: 1619 },
      { start: 1630, end: 1659 },
      { start: 1680, end: 1689 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaFordringarKortfristiga",
      parentName: "se-gen-base:KortfristigaFordringarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1620, end: 1629 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:UpparbetadEjFaktureradIntakt",
      parentName: "se-gen-base:KortfristigaFordringarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1700, end: 1799 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter",
      parentName: "se-gen-base:KortfristigaFordringarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1500, end: 1799 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:KortfristigaFordringar",
      parentName: "se-gen-base:OmsattningstillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1860, end: 1869 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AndelarKoncernforetagKortfristiga",
      parentName: "se-gen-base:KortfristigaPlaceringarAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 1800, end: 1859 },
      { start: 1870, end: 1899 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaKortfristigaPlaceringar",
      parentName: "se-gen-base:KortfristigaPlaceringarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1800, end: 1899 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:KortfristigaPlaceringar",
      parentName: "se-gen-base:OmsattningstillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1900, end: 1989 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:KassaBankExklRedovisningsmedel",
      parentName: "se-gen-base:KassaBankAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 1990, end: 1999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Redovisningsmedel",
      parentName: "se-gen-base:KassaBankAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 1900, end: 1999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:KassaBank",
      parentName: "se-gen-base:OmsattningstillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1400, end: 1999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Omsattningstillgangar",
      parentName: "se-gen-base:TillgangarAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 1000, end: 1999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Tillgangar",
      parentName: "se-gen-base:BalansrakningAbstract",
      labelType: "totalLabel",
    },
  },
  // Balansräkning: eget kapital och skulder
  {
    basAccounts: [{ start: 2081, end: 2081 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Aktiekapital",
      parentName: "se-gen-base:BundetEgetKapitalAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2082, end: 2082 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:EjRegistreratAktiekapital",
      parentName: "se-gen-base:BundetEgetKapitalAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2087, end: 2087 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OverkursfondBunden",
      parentName: "se-gen-base:BundetEgetKapitalAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2085, end: 2085 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Uppskrivningsfond",
      parentName: "se-gen-base:BundetEgetKapitalAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2086, end: 2086 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Reservfond",
      parentName: "se-gen-base:BundetEgetKapitalAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2080, end: 2089 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:BundetEgetKapital",
      parentName: "se-gen-base:EgetKapitalAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 2097, end: 2097 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Overkursfond",
      parentName: "se-gen-base:FrittEgetKapitalAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2091, end: 2091 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:BalanseratResultat",
      parentName: "se-gen-base:FrittEgetKapitalAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2099, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AretsResultatEgetKapital",
      parentName: "se-gen-base:FrittEgetKapitalAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2090, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FrittEgetKapital",
      parentName: "se-gen-base:EgetKapitalAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 2000, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:EgetKapital",
      parentName: "se-gen-base:EgetKapitalSkulderAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 2110, end: 2139 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Periodiseringsfonder",
      parentName: "se-gen-base:ObeskattadeReserverAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2150, end: 2159 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AckumuleradeOveravskrivningar",
      parentName: "se-gen-base:ObeskattadeReserverAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2160, end: 2199 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaObeskattadeReserver",
      parentName: "se-gen-base:ObeskattadeReserverAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2100, end: 2199 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ObeskattadeReserver",
      parentName: "se-gen-base:EgetKapitalSkulderAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 2210, end: 2219 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:AvsattningarPensionerLiknandeForpliktelserEnligtLag",
      parentName: "se-gen-base:AvsattningarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2230, end: 2239 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaAvsattningarPensionerLiknandeForpliktelser",
      parentName: "se-gen-base:AvsattningarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 2220, end: 2229 },
      { start: 2290, end: 2299 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaAvsattningar",
      parentName: "se-gen-base:AvsattningarAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2200, end: 2299 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Avsattningar",
      parentName: "se-gen-base:EgetKapitalSkulderAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 2310, end: 2319 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Obligationslan",
      parentName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2330, end: 2339 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:CheckrakningskreditLangfristig",
      parentName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2340, end: 2359 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaLangfristigaSkulderKreditinstitut",
      parentName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2360, end: 2369 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:SkulderKoncernforetagLangfristiga",
      parentName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2371, end: 2372 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:SkulderIntresseforetagGemensamtStyrdaForetagLangfristiga",
      parentName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2373, end: 2373 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:SkulderOvrigaForetagAgarintresseLangfristiga",
      parentName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2390, end: 2399 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaLangfristigaSkulder",
      parentName: "se-gen-base:LangfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2300, end: 2399 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:LangfristigaSkulder",
      parentName: "se-gen-base:EgetKapitalSkulderAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 2480, end: 2489 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:CheckrakningskreditKortfristig",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2410, end: 2419 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaKortfristigaSkulderKreditinstitut",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2420, end: 2429 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:ForskottFranKunder",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2430, end: 2439 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:PagaendeArbetenAnnansRakningKortfristigaSkulder",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2450, end: 2459 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:FaktureradEjUpparbetadIntakt",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2440, end: 2449 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Leverantorsskulder",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2492, end: 2492 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Vaxelskulder",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 2460, end: 2469 },
      { start: 2860, end: 2869 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:SkulderKoncernforetagKortfristiga",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 2471, end: 2472 },
      { start: 2871, end: 2872 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:SkulderIntresseforetagGemensamtStyrdaForetagKortfristiga",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [
      { start: 2473, end: 2473 },
      { start: 2873, end: 2873 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:SkulderOvrigaForetagAgarintresseKortfristiga",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2500, end: 2599 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:Skatteskulder",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [
      { start: 2600, end: 2869 },
      { start: 2880, end: 2899 },
    ],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:OvrigaKortfristigaSkulder",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: "terseLabel",
    },
  },
  {
    basAccounts: [{ start: 2900, end: 2999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:UpplupnaKostnaderForutbetaldaIntakter",
      parentName: "se-gen-base:KortfristigaSkulderAbstract",
      labelType: null,
    },
  },
  {
    basAccounts: [{ start: 2400, end: 2999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:KortfristigaSkulder",
      parentName: "se-gen-base:EgetKapitalSkulderAbstract",
      labelType: "totalLabel",
    },
  },
  {
    basAccounts: [{ start: 2000, end: 2999 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
      name: "se-gen-base:EgetKapitalSkulder",
      parentName: "se-gen-base:BalansrakningAbstract",
      labelType: "totalLabel",
    },
  },
];
