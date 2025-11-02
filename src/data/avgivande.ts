import type { Avgivande } from "@/model/arsredovisning/Redovisningsinformation.ts";

export const AvgivandeStyrelsen: Avgivande = {
  namn: "Styrelsen",
  xbrlId: "se-mem-base:FinansiellRapportStyrelsenAvgerArsredovisningMember",
};

export const AvgivandeStyrelsenOchVD: Avgivande = {
  namn: "Styrelsen och verkställande direktören",
  xbrlId:
    "se-mem-base:FinansiellRapportStyrelsenVerkstallandeDirektorenAvgerArsredovisningMember",
};

export const AvgivandeLikvidator: Avgivande = {
  namn: "Likvidatorn",
  xbrlId: "se-mem-base:FinansiellRapportLikvidatornAvgerArsredovisningMember",
};

export const AVGIVANDE_TYPER = [
  AvgivandeStyrelsen,
  AvgivandeStyrelsenOchVD,
  AvgivandeLikvidator,
] as const;
