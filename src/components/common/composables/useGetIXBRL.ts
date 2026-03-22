import { convertVueHTMLToiXBRL } from "@/util/documentUtils.ts";
import { RENDER_FONT_FAMILY_WHITELIST } from "@/util/renderUtils.ts";
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import type { Ref, TemplateRef } from "vue";
import type RenderMain from "@/components/render/RenderMain.vue";
import type { ComponentExposed } from "vue-component-type-helpers";

/**
 * En Vue-composable för att hämta den iXBRL som visas i en
 * RenderMain-komponent.
 *
 * @param arsredovisning - Vue-referens till årsredovisningen som renderas
 * @param renderMain - Vue-referens till RenderMain som iXBRL:en kommer hämtas
 * ifrån
 */
export function useGetIXBRL(
  arsredovisning: Ref<Arsredovisning>,
  renderMain: TemplateRef<ComponentExposed<typeof RenderMain>>,
) {
  async function getIXBRL(): Promise<string | undefined> {
    const renderRoot = renderMain.value?.getArsredovisningRoot();

    if (renderRoot?.value) {
      const { foretagsinformation } = arsredovisning.value;
      return await convertVueHTMLToiXBRL(
        renderRoot.value,
        `${foretagsinformation.organisationsnummer} ${foretagsinformation.foretagsnamn} - Årsredovisning`,
        RENDER_FONT_FAMILY_WHITELIST,
      );
    }
  }

  return {
    getIXBRL,
  };
}
