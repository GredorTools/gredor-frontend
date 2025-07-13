import { getTaxonomyManager, TaxonomyRootName } from "@/util/TaxonomyManager.ts";
import { getOrCreateBeloppradInList, getTaxonomyItemForBelopprad } from "@/model/arsredovisning/Belopprad.ts";
import { isBeloppradComparable } from "@/model/arsredovisning/beloppradtyper/BaseBeloppradComparable.ts";
import Decimal from "decimal.js";
import type { Arsredovisning, Verksamhetsar } from "@/model/arsredovisning/Arsredovisning.ts";

/**
 * Fyller automatiskt i soliditet i flerårsöversikten för de senaste två
 * räkenskapsåren.
 *
 * @param arsredovisning - Årsredovisningen som ska få soliditeten ifylld
 */
export async function autofillSoliditet(arsredovisning: Arsredovisning) {
  const egetKapitalBelopprad = arsredovisning.balansrakning.find(
    (belopprad) => belopprad.taxonomyItemName === "se-gen-base:EgetKapital",
  );
  const obeskattadeReserverBelopprad = arsredovisning.balansrakning.find(
    (belopprad) =>
      belopprad.taxonomyItemName === "se-gen-base:ObeskattadeReserver",
  );
  const balansomslutningBelopprad = arsredovisning.balansrakning.find(
    (belopprad) =>
      belopprad.taxonomyItemName === "se-gen-base:EgetKapitalSkulder",
  );
  if (egetKapitalBelopprad != null && balansomslutningBelopprad != null) {
    const taxonomyManager = await getTaxonomyManager(
      TaxonomyRootName.FORVALTNINGSBERATTELSE,
    );
    const soliditetBelopprad = getOrCreateBeloppradInList(
      taxonomyManager,
      arsredovisning.forvaltningsberattelse,
      taxonomyManager.getItemByCompleteInfo(
        "se-gen-base:Soliditet",
        undefined,
        "se-gen-base:Flerarsoversikt",
      ),
    );
    if (
      isBeloppradComparable(egetKapitalBelopprad) &&
      isBeloppradComparable(balansomslutningBelopprad) &&
      isBeloppradComparable(soliditetBelopprad)
    ) {
      function soliditet(
        egetKapital: string,
        obeskattadeReserver: string,
        balansomslutning: string,
        verksamhetsar: Verksamhetsar,
      ): string {
        const bolagsskatt =
          BOLAGSSKATT_PER_AR[verksamhetsar.startdatum.substring(0, 4)];
        if (bolagsskatt == null) {
          return "";
        }

        return Decimal(egetKapital)
          .plus(
            Decimal("1")
              .minus(Decimal(bolagsskatt))
              .mul(Decimal(obeskattadeReserver)),
          )
          .div(Decimal(balansomslutning))
          .mul(100)
          .round()
          .toString();
      }

      soliditetBelopprad.beloppNuvarandeAr = soliditet(
        egetKapitalBelopprad.beloppNuvarandeAr,
        obeskattadeReserverBelopprad != null &&
          isBeloppradComparable(obeskattadeReserverBelopprad)
          ? obeskattadeReserverBelopprad.beloppNuvarandeAr
          : "0",
        balansomslutningBelopprad.beloppNuvarandeAr,
        arsredovisning.verksamhetsarNuvarande,
      ).toString();

      soliditetBelopprad.beloppTidigareAr[0] = soliditet(
        egetKapitalBelopprad.beloppTidigareAr[0],
        obeskattadeReserverBelopprad != null &&
          isBeloppradComparable(obeskattadeReserverBelopprad)
          ? obeskattadeReserverBelopprad.beloppTidigareAr[0]
          : "0",
        balansomslutningBelopprad.beloppTidigareAr[0],
        arsredovisning.verksamhetsarTidigare[0],
      ).toString();
    }
  }
}

/**
 * Fyller automatiskt i notnummer för raden för personalkostnader i
 * resultaträkningen, om det finns en not för medelantalet anställda.
 *
 * @param arsredovisning - Årsredovisningen som ska få notnumret ifyllt
 */
export async function autofillPersonalkostnaderNot(
  arsredovisning: Arsredovisning,
) {
  const personalkostnaderBelopprad = arsredovisning.resultatrakning.find(
    (belopprad) =>
      belopprad.taxonomyItemName === "se-gen-base:Personalkostnader",
  );
  const notMedelandataletAnstalldaBelopprad = arsredovisning.noter.find(
    (belopprad) =>
      belopprad.taxonomyItemName === "se-gen-base:NotMedelantaletAnstallda",
  );

  if (
    personalkostnaderBelopprad != null &&
    notMedelandataletAnstalldaBelopprad != null
  ) {
    const taxonomyManagerNoter = await getTaxonomyManager(
      TaxonomyRootName.NOTER,
    );
    personalkostnaderBelopprad.not = (
      arsredovisning.noter
        .filter(
          (b) =>
            getTaxonomyItemForBelopprad(taxonomyManagerNoter, b).level === 2,
        )
        .indexOf(notMedelandataletAnstalldaBelopprad) + 1
    ).toString();
  }
}

// Bolagsskatt per år (räkenskapsår som inleds 2021, 2022, osv)
const BOLAGSSKATT_PER_AR: { [ar: string]: string } = {
  "2021": "20.6",
  "2022": "20.6",
  "2023": "20.6",
  "2024": "20.6",
  "2025": "20.6",
};
