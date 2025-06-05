import type { ResultatdispositionBeslut } from "@/model/arsredovisning/Arsredovisning.ts";

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
