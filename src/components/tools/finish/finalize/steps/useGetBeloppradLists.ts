import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";
import { computed } from "vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

export async function useGetBeloppradLists(arsredovisning: Arsredovisning) {
  const forvaltningsberattelseTaxonomyManager = await getTaxonomyManager(
    TaxonomyRootName.FORVALTNINGSBERATTELSE,
  );
  const resultatrakningTaxonomyManager = await getTaxonomyManager(
    TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
  );
  const balansrakningTaxonomyManager = await getTaxonomyManager(
    TaxonomyRootName.BALANSRAKNING,
  );
  const noterTaxonomyManager = await getTaxonomyManager(TaxonomyRootName.NOTER);

  const beloppradLists = computed(() => [
    {
      beloppradList: arsredovisning.forvaltningsberattelse,
      beloppradListTaxonomyManager: forvaltningsberattelseTaxonomyManager,
    },
    {
      beloppradList: arsredovisning.resultatrakning,
      beloppradListTaxonomyManager: resultatrakningTaxonomyManager,
    },
    {
      beloppradList: arsredovisning.balansrakning,
      beloppradListTaxonomyManager: balansrakningTaxonomyManager,
    },
    {
      beloppradList: arsredovisning.noter,
      beloppradListTaxonomyManager: noterTaxonomyManager,
    },
  ]);

  return {
    forvaltningsberattelseTaxonomyManager,
    resultatrakningTaxonomyManager,
    balansrakningTaxonomyManager,
    noterTaxonomyManager,
    beloppradLists,
  };
}
