export interface TaxonomyItem {
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
  belopp: number;
  datatyp: string;
  saldo?: "debit" | "credit";
  periodtyp: string;
  typ: string;
  dokumentation?: string;
  utokadDokumentation?: string;
}
