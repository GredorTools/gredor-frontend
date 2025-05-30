export type TaxonomyItemType =
  | "enum:enumerationItemType"
  | "nonnum:domainItemType"
  | "xbrli:decimalItemType"
  | "xbrli:monetaryItemType"
  | "xbrli:pureItemType"
  | "xbrli:sharesItemType"
  | "xbrli:stringItemType";

export interface TaxonomyItem<T extends TaxonomyItemType> {
  // Egna fält
  __ParentId?: string;
  __Level: number;

  // Fält från Excelfil
  id: string;
  rowNumber: string;
  radrubrik: string;
  elementnamn: string;
  tillhor: string;
  standardrubrik: string;
  abstrakt: "true" | "false";
  datatyp: T;
  saldo?: "debit" | "credit";
  periodtyp: "duration" | "instant";
  typ: string;
  dokumentation?: string;
  utokadDokumentation?: string;
}
