<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderResultatrakning from "@/components/render/RenderResultatrakning.vue";
import RenderBalansrakning from "@/components/render/RenderBalansrakning.vue";
import RenderIXBRLHeader from "@/components/render/RenderIXBRLHeader.vue";
import RenderForvaltningsberattelse from "@/components/render/RenderForvaltningsberattelse.vue";
import RenderNoter from "@/components/render/RenderNoter.vue";
import RenderCover from "@/components/render/RenderCover.vue";
import RenderSignatures from "@/components/render/RenderSignatures.vue";

defineProps<{
  arsredovisning: Arsredovisning;
}>();
</script>

<template>
  <div class="ar-page">
    <Suspense>
      <div id="arsredovisning-for-export">
        <RenderIXBRLHeader :arsredovisning="arsredovisning" />
        <div class="sections-container">
          <RenderCover :arsredovisning="arsredovisning" />
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
.ar-page {
  width: 210mm;
  height: 100%;
  max-height: 297mm;
  overflow-y: scroll;

  background-color: white;

  padding: 1em 2em 2em;
  border: 1px solid rgb(240, 240, 240);
  border-image: none;
  line-height: 1.2;
  box-shadow: 0.25em 0.25em 0.3em #999;

  /* Sidavskiljare */
  /*background-size: 210mm 297mm;
  background-image: linear-gradient(to top, grey 1px, transparent 1px);*/
}

.sections-container {
  width: 100%;
  font-family: "EB Garamond", serif;

  & > *:not(:last-child) {
    padding-bottom: 2em;
  }
}

.page-break {
  margin: 0 -2em;
  page-break-after: always;
  background-size: 210mm 297mm;
  background-image: linear-gradient(to bottom, grey 1px, transparent 1px);
}

:deep(h1) {
  font-size: 1.6rem;
  font-family: "FreeSans", sans-serif;
  font-weight: 700;
}

:deep(h2) {
  font-size: 1.35rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

:deep(h3) {
  font-size: 1.15rem;
  font-weight: 600;
  margin-top: 0;
}
</style>
