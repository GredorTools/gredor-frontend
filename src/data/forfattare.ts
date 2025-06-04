import type { Forfattare } from "@/model/arsredovisning/Arsredovisning.ts";

export const ForfattareStyrelsen: Forfattare = {
  namn: "Styrelsen",
  xbrlId: "se-mem-base:FinansiellRapportStyrelsenAvgerArsredovisningMember",
};

export const ForfattareStyrelsenOchVD: Forfattare = {
  namn: "Styrelsen och verkställande direktören",
  xbrlId:
    "se-mem-base:FinansiellRapportStyrelsenVerkstallandeDirektorenAvgerArsredovisningMember",
};

export const ForfattareLikvidator: Forfattare = {
  namn: "Likvidatorn",
  xbrlId: "se-mem-base:FinansiellRapportLikvidatornAvgerArsredovisningMember",
};

export const FORFATTARE_TYPER = [
  ForfattareStyrelsen,
  ForfattareStyrelsenOchVD,
  ForfattareLikvidator,
] as const;
