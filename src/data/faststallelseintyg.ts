import type {
  Faststallelseintyg,
  ResultatdispositionBeslut,
  ResultatdispositionStammans,
} from "@/model/arsredovisning/Faststallelseintyg.ts";

export const ResultatdispositionBeslutGodkannaVinst: ResultatdispositionBeslut =
  {
    text: "Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.",
    xbrlId: "se-bol-base:ArsstammaResultatDispositionGodkannaStyrelsensForslag",
  };

export const ResultatdispositionBeslutGodkannaForlust: ResultatdispositionBeslut =
  {
    text: "Årsstämman beslöt att godkänna styrelsens förslag till behandling av ansamlad förlust.",
    xbrlId: "se-bol-base:ArsstammaResultatDispositionGodkannaStyrelsensForslag",
  };

export const ResultatdispositionBeslutInteGodkannaVinst: ResultatdispositionBeslut =
  {
    text: "Årsstämman beslöt att inte godkänna styrelsens förslag till vinstdisposition.",
    xbrlId:
      "se-bol-base:ArsstammaResultatDispositionInteGodkannaStyrelsensForslag",
  };

export const ResultatdispositionBeslutInteGodkannaForlust: ResultatdispositionBeslut =
  {
    text: "Årsstämman beslöt att inte godkänna styrelsens förslag till behandling av ansamlad förlust.",
    xbrlId:
      "se-bol-base:ArsstammaResultatDispositionInteGodkannaStyrelsensForslag",
  };

export const RESULTATDISPOSITION_BESLUT = [
  ResultatdispositionBeslutGodkannaVinst,
  ResultatdispositionBeslutGodkannaForlust,
  ResultatdispositionBeslutInteGodkannaVinst,
  ResultatdispositionBeslutInteGodkannaForlust,
] as const;

export const FASTSTALLELSEINTYG_UNDERSKRIFT_ROLLER = [
  "Styrelseledamot",
  "Styrelsesuppleant",
  "Verkställande direktör",
  "Likvidator",
  "Likvidatorssuppleant",
] as const;
/**
 * Kontrollerar huruvida stämmans egna resultatdisposition behöver inkluderas i
 * fastställelseintyget.
 *
 * @param faststallelseintyg - Fastställseintyget som ska kontrolleras
 * @returns Huruvida stämmans egna resultatdisposition behöver inkluderas i
 * fastställelseintyget.
 */
export function isFaststallseintygRequiresStammansResultatdisposition(
  faststallelseintyg: Faststallelseintyg,
): boolean {
  return faststallelseintyg.resultatdispositionBeslut.xbrlId.includes(
    "InteGodkanna",
  );
}

export const RESULTATDISPOSITION_STAMMANS_DEFINITIONS: {
  key: keyof ResultatdispositionStammans;
  textBefore: string;
  textAfter: string;
  xbrlId: string;
}[] = [
  {
    key: "aktieutdelning",
    textBefore: "om",
    textAfter: "i aktieutdelning",
    xbrlId: "se-bol-base:ArsstammaResultatDispositionAktieutdelning",
  },
  {
    key: "fondemissioner",
    textBefore: "om",
    textAfter: "i fondemission",
    xbrlId: "se-bol-base:ArsstammaResultatDispositionFondemission",
  },
  {
    key: "ianspraktagandeAvReservfond",
    textBefore: "att ta i anspråk",
    textAfter: "från reservfond",
    xbrlId: "se-bol-base:ArsstammaResultatDispositionIanspraktagandeReservfond",
  },
  {
    key: "ianspraktagandeAvUppskrivningsfond",
    textBefore: "att ta i anspråk",
    textAfter: "från uppskrivningsfond",
    xbrlId:
      "se-bol-base:ArsstammaResultatDispositionIanspraktagandeUppskrivningsfond",
  },
  {
    key: "avsattningTillReservfond",
    textBefore: "att sätta av",
    textAfter: "till reservfond",
    xbrlId: "se-bol-base:ArsstammaResultatDispositionAvsattningReservfond",
  },
  {
    key: "balanseringINyRakning",
    textBefore: "att",
    textAfter: "balanseras i ny räkning",
    xbrlId: "se-bol-base:ArsstammaResultatDispositionBalanserasINyRakning",
  },
] as const;
