import { convertVueHTMLToiXBRL } from "@/util/documentUtils.ts";
import type { ComponentExposed } from "vue-component-type-helpers";
import RenderMain from "@/components/render/RenderMain.vue";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type { Ref } from "vue";

/**
 * Argument som krävs för att generera en iXBRL-årsredovisning.
 *
 * @property renderMain - Vue-referens till en instans av komponenten RenderMain
 * som ska konverteras till iXBRL.
 * @property arsredovisning - Årsredovisningsdata som ska renderas.
 * @property ixbrlOutput - Vue-referens där den genererade iXBRL-strängen kommer
 * att lagras.
 */
type Args = {
  renderMain: Ref<ComponentExposed<typeof RenderMain> | undefined>;
  arsredovisning: Arsredovisning;
  ixbrlOutput: Ref<string | undefined>;
};

/**
 * Provar att konvertera den renderade HTML:en från den anvigna RenderMain-roten
 * till iXBRL. Gör omförsök varje 250 millisekunder tills det lyckas, eller
 * tills JavaScript-intervallet som funktionen skapar blir avbrutet.
 *
 * @param args - Argument som krävs för att generera iXBRL-årsredovisningen.
 * @returns ID för det JavaScript-intervallet som startades för att försöka
 * generera rapporten - kan användas för att avbryta intervallet.
 */
function tryGenerateIXBRLInInterval(args: Args) {
  const intervalId = setInterval(async () => {
    const arsredovisningRoot = args.renderMain.value?.getArsredovisningRoot();
    if (arsredovisningRoot) {
      if (intervalId != null) {
        // Vi har fått tag på roten, behöver inte köra intervallet mer
        clearInterval(intervalId);
      }

      const { foretagsinformation } = args.arsredovisning;
      args.ixbrlOutput.value = await convertVueHTMLToiXBRL(
        arsredovisningRoot,
        `${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning`,
      );
    }
  }, 250);
  return intervalId;
}

export function useIXBRLGenerator(args: Args) {
  return {
    tryGenerateIXBRLInInterval: () => tryGenerateIXBRLInInterval(args),
  };
}
