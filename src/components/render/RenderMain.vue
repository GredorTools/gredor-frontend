<script lang="ts" setup>
/**
 * Huvudkomponenten för att rendera årsredovisningen i förhandsgranskningsläge.
 * Sammanställer alla delar av årsredovisningen i ett dokument med korrekt formatering och sidbrytningar.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderResultatrakning from "@/components/render/sections/RenderResultatrakning.vue";
import RenderBalansrakning from "@/components/render/sections/RenderBalansrakning.vue";
import RenderIXBRLHeader from "@/components/render/sections/RenderIXBRLHeader.vue";
import RenderForvaltningsberattelse from "@/components/render/sections/RenderForvaltningsberattelse.vue";
import RenderNoter from "@/components/render/sections/RenderNoter.vue";
import RenderCover from "@/components/render/sections/RenderCover.vue";
import RenderSignatures from "@/components/render/sections/RenderSignatures.vue";
import { useTemplateRef } from "vue";

defineProps<{
  /** Årsredovisningen som ska renderas. */
  arsredovisning: Arsredovisning;

  /** Huruvida fastställelseintyget ska visas. **/
  showFaststallelseintyg: boolean;
}>();

const arsredovisningRoot = useTemplateRef("arsredovisning-root");
const arsredovisningContent = useTemplateRef("arsredovisning-content");

defineExpose({
  getArsredovisningRoot: () => {
    // Vi vill inte returnera roten förrän innehållet har laddats in
    if (arsredovisningContent.value != null) {
      return arsredovisningRoot.value;
    }
  },
});
</script>

<template>
  <div
    id="arsredovisning-for-export"
    ref="arsredovisning-root"
    class="arsredovisning-root"
  >
    <Suspense>
      <div>
        <RenderIXBRLHeader :arsredovisning="arsredovisning" />
        <div ref="arsredovisning-content" class="arsredovisning-content">
          <RenderCover
            :arsredovisning="arsredovisning"
            :show-faststallelseintyg="showFaststallelseintyg"
          />
          <div class="page-break"></div>
          <RenderForvaltningsberattelse :arsredovisning="arsredovisning" />
          <div class="page-break"></div>
          <RenderResultatrakning :arsredovisning="arsredovisning" />
          <div class="page-break"></div>
          <RenderBalansrakning :arsredovisning="arsredovisning" />
          <div class="page-break"></div>
          <RenderNoter :arsredovisning="arsredovisning" />
          <RenderSignatures :arsredovisning="arsredovisning" />
        </div>
      </div>
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/render.scss";
</style>
