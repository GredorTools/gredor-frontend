/**
 * Extra mappningar från BAS-konton till taxonomiobjekt som inte finns i
 * taxonomin.
 *
 * Ej automatgenererad, får redigeras manuellt :)
 */

import type { SieMapping } from "@/util/sieUtils.ts";

export const extraSieMappings: SieMapping[] = [
  // Förvaltningsberättelse
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
  {
    basAccounts: [{ start: 2000, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:ForandringEgetKapitalTotalt",
      parentName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      labelType: "periodStartLabel",
    },
  },
  {
    basAccounts: [{ start: 2000, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:ForandringEgetKapitalTotalt",
      parentName: "se-gen-base:ForandringEgetKapitalTotaltAbstract",
      labelType: "periodEndLabel",
    },
  },

  {
    basAccounts: [{ start: 2090, end: 2099 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
      name: "se-gen-base:ForslagDisposition",
      parentName: "se-gen-base:Resultatdisposition",
      labelType: "totalLabel",
    },
  },
  // Resultaträkning
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
    basAccounts: [{ start: 3000, end: 8899 }],
    taxonomyItemId: {
      rootName:
        "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
      name: "se-gen-base:ResultatForeSkatt",
      parentName: "se-gen-base:ResultatrakningKostnadsslagsindeladAbstract",
      labelType: null,
    },
  },
  // Balansräkning
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
