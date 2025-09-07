import {
  type Belopprad,
  createBelopprad,
  createBeloppradInList,
  deleteBelopprad,
  hasBeloppradValue,
  isBeloppradCorrespondsToTaxonomyItem,
  isBeloppradInTaxonomyItemList
} from "@/model/arsredovisning/Belopprad.ts";
import { computed, type Reactive, reactive, type Ref, ref, watch } from "vue";
import { TaxonomyManager } from "@/util/TaxonomyManager.ts";
import type { Arsredovisning, BeloppradSectionName } from "@/model/arsredovisning/Arsredovisning.ts";
import {
  hasParentTaxonomyItemMatching,
  isTaxonomyItemTuple,
  type TaxonomyItem
} from "@/model/taxonomy/TaxonomyItem.ts";

/**
 * Argument som krävs för att generera en iXBRL-årsredovisning.
 *
 * @property taxonomyManager - Hanterar taxonomin och ger åtkomst till
 * taxonomiobjekt
 * @property availableTaxonomyItems - Rotobjekt som innehåller de taxonomiobjekt
 * att förpopulera med
 * @property arsredovisning - Vue-referens till den aktuella årsredovisningen
 * @property sectionName - Namnet på avsnittet i årsredovisningen som ska
 * förpopuleras
 * @property maxNumPreviousYears - Maximalt antal tidigare räkenskapsår i
 * avsnittet.
 */
type Args = {
  taxonomyManager: TaxonomyManager;
  availableTaxonomyItems: TaxonomyItem;
  arsredovisning: Ref<Arsredovisning>;
  sectionName: BeloppradSectionName;
  maxNumPreviousYears: number;
};

/**
 * Funktion för att förpopulera ett specifikt avsnitt i årsredovisningen med
 * belopprader baserade på tillgängliga taxonomiobjekt.
 *
 * @param args - Argument som krävs för förpopuleringen.
 */

function prepopulateSection(args: Args) {
  const belopprader = ref<Belopprad[]>([]);
  innerPrepopulateSection(args, belopprader);
  return belopprader;
}

/**
 * Intern hjälpfunktion för att utföra den faktiska förpopuleringen.
 *
 * @param args - Argument som krävs för förpopuleringen.
 * @param belopprader - Vue-referens till resulterande listan med belopprader.
 */
function innerPrepopulateSection(args: Args, belopprader: Ref<Belopprad[]>) {
  const {
    taxonomyManager,
    availableTaxonomyItems,
    arsredovisning,
    sectionName,
    maxNumPreviousYears,
  } = args;

  const section: Belopprad[] = arsredovisning.value[sectionName];
  const sectionPool: Reactive<Belopprad>[] = [];

  for (const taxonomyItem of availableTaxonomyItems.childrenFlat) {
    if (
      !isTaxonomyItemTuple(availableTaxonomyItems) &&
      hasParentTaxonomyItemMatching(taxonomyItem, (parent) =>
        isTaxonomyItemTuple(parent),
      )
    ) {
      // Belopprader i tuples hanteras separat - de ska inte förpopuleras
      // eftersom det kan finnas flera likadana belopprader (med samma
      // taxonomyItemName osv) i olika tuple-instanser
      continue;
    }

    // Kontrollera om en belopprad redan finns för det aktuella taxonomiobjektet
    let belopprad = section.find((b) =>
      isBeloppradCorrespondsToTaxonomyItem(b, taxonomyItem),
    );

    // Om ingen belopprad finns, skapa en ny reaktiv belopprad
    if (!belopprad) {
      belopprad = reactive(createBelopprad(taxonomyItem));
      sectionPool.push(belopprad);
    }

    // Skapa en watcher som triggas när man ändrar beloppraden, för att
    // automatiskt lägga till eller ta bort den från årsredovisningen när man
    // fyller i ett värde respektive tar bort det
    watch(belopprad, (newBelopprad: Belopprad) => {
      if (
        hasBeloppradValue(
          taxonomyManager,
          newBelopprad,
          arsredovisning.value,
          section,
          maxNumPreviousYears,
        )
      ) {
        // Om beloppraden innehåller värden eller barn, lägg till den i den
        // faktiska årsredovisningen
        createBeloppradInList(
          taxonomyManager,
          section,
          taxonomyItem,
          newBelopprad,
          sectionPool,
          "all",
        );
      } else {
        // Om beloppraden inte innehåller värden, och den inte har några barn,
        // tar vi bort den från den faktiska årsredovisningen
        deleteBelopprad(
          taxonomyManager,
          newBelopprad,
          section,
          arsredovisning.value,
          maxNumPreviousYears,
        );
      }
    });

    belopprader.value.push(belopprad);
  }

  // Vi måste bevaka ifall en ny årsredovisning skapas - i så fall måste vi
  // förpopulera den på nytt
  const arsredovisningWatcher = watch(
    arsredovisning,
    () => {
      // Viktigt att stoppa den gamla watchern i och med att det kommer skapas
      // en ny när vi kör `innerPrepopulateSection`
      arsredovisningWatcher.stop();

      belopprader.value.length = 0;
      innerPrepopulateSection(args, belopprader);
    },
    { deep: false },
  );
}

/**
 * Funktion för att gruppera förpopulade belopprader i ett specifikt avsnitt i
 * årsredovisningen.
 *
 * @param prepoulatedBelopprader - De förpopulerade beloppraderna man har fått
 * från `prepopulateSection`.
 * @param groups - Listor med taxonomiobjekt som bildar grupperna. Varje post i
 * listan utgör en grupp. (Om `groups` är TaxonomyItem[][] är det varje post på
 * första nivån som används.)
 * @returns En reaktiv lista med grupperade belopprader.
 */
function groupPrepopulatedSection(
  prepoulatedBelopprader: Ref<Belopprad[]>,
  groups: TaxonomyItem[] | TaxonomyItem[][],
) {
  return computed(() => {
    const taxonomyItemsPerGroup = groups.map((group) => {
      if ("childrenFlat" in group) {
        // groups is TaxonomyItem[]
        return [group, ...group.childrenFlat];
      } else {
        // groups is TaxonomyItem[][]
        return group;
      }
    });

    return prepoulatedBelopprader.value.reduce(
      (result: Belopprad[][], belopprad: Belopprad) => {
        for (let i = 0; i < groups.length; i++) {
          if (
            isBeloppradInTaxonomyItemList(taxonomyItemsPerGroup[i], belopprad)
          ) {
            result[i].push(belopprad);
            break;
          }
        }

        return result;
      },
      Array.from(Array(groups.length), () => []),
    );
  });
}

export function usePrepopulateSection(args: Args) {
  return {
    prepopulateSection: () => prepopulateSection(args),
    groupPrepopulatedSection,
  };
}
