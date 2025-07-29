// Typ som representerar olika slags taxonomiobjekt
export type TaxonomyItemType =
  | "enum:enumerationItemType"
  | "nonnum:domainItemType"
  | "xbrli:decimalItemType"
  | "xbrli:monetaryItemType"
  | "xbrli:pureItemType"
  | "xbrli:sharesItemType"
  | "xbrli:stringItemType"
  | `${string}Tuple@anonymousType`
  | "gredor:section" // Specialare för Gredor - används bara internt
  | "gredor:tuple"; // Specialare för Gredor - används bara internt

// Följande finns med i concepts.json, men inte i presentationen för K2-årsredovisningar
export type ExtendedTaxonomyItemType =
  | TaxonomyItemType
  | "string"
  | "num:areaItemType"
  | "nonnum:textBlockItemType"
  | "xbrli:booleanItemType"
  | "xbrli:dateItemType"
  | "xbrli:gYearMonthItemType"
  | "xsd:anyType";

// Typ som representerar taxonomins olika rötter
export enum TaxonomyRootName {
  ALLMAN_INFORMATION = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/allmaninformation",
  BALANSRAKNING = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
  FORVALTNINGSBERATTELSE = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
  KASSAFLODESANALYS = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/kassaflodesanalys",
  RESULTATRAKNING_KOSTNADSSLAGSINDELAD = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
  NOTER = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/noter",
  UNDERTECKNANDE_FORETRADARE_REVISIONSPATECKNING = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/undertecknande/foretradarerevisionspateckning",
}

// Typ som representerar olika slags etiketter
export type LabelType =
  | "periodEndLabel"
  | "periodStartLabel"
  | "terseLabel"
  | "totalLabel"
  | "verboseLabel"
  | undefined;

// Gränssnitt för konceptegenskaper
export interface ConceptProperties<
  T extends TaxonomyItemType = TaxonomyItemType,
> {
  abstract: "true" | "false";
  balance?: "debit" | "credit";
  documentation?: string;
  facets?: string;
  iD: string;
  label: string;
  name: string;
  namespace: string;
  nillable: "true" | "false";
  periodType?: "duration" | "instant";
  substitutionGroup?: string;
  type: T;
}

// Struktur för presentationsmetadata
export interface PresentationLinkRoleMetadata {
  definition: string;
  role: string;
}

export interface PresentationConceptMetadata {
  label: string;
  name: string;
}

export interface PresentationConceptDetails {
  "pref.Label": LabelType;
  references: string;
  type: string;
}

// Huvudstruktur för taxonomiposter
export interface TaxonomyItem<T extends TaxonomyItemType = TaxonomyItemType> {
  xmlName: string;
  properties: ConceptProperties<T>;
  metadata?: PresentationLinkRoleMetadata;
  additionalData: {
    isCalculatedItem?: boolean;
    displayLabel?: string;
    labelType?: LabelType;
  };
  rowNumber: number;
  level: number;
  children: TaxonomyItem[];
  childrenFlat: TaxonomyItem[];
  parent?: TaxonomyItem;
  root?: TaxonomyItem;
}

// Hjälpfunktioner
export function isTaxonomyItemTuple(taxonomyItem: TaxonomyItem) {
  return taxonomyItem.properties.type.endsWith("Tuple@anonymousType");
}

export function hasParentTaxonomyItemMatching(
  taxonomyItem: TaxonomyItem,
  matcherFunc: (taxonomyItem: TaxonomyItem) => boolean,
) {
  let parent = taxonomyItem.parent;
  while (parent != null) {
    if (matcherFunc(parent)) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}
