<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import RenderResultatrakning from "@/components/render/RenderResultatrakning.vue";
import RenderBalansrakning from "@/components/render/RenderBalansrakning.vue";

defineProps<{
  arsredovsining: Arsredovisning;
}>();
</script>

<template>
  <div class="ar-page">
    <div class="sections-container">
      <RenderResultatrakning :arsredovsining="arsredovsining" />
      <RenderBalansrakning :arsredovsining="arsredovsining" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ar-page {
  min-width: 30em;
  margin: 1em 0px;
  padding: 1em 2em 2em;
  border: 1px solid rgb(240, 240, 240);
  border-image: none;
  line-height: 1.2;
  min-height: 52em;
  max-width: 38em;
  box-shadow: 0.25em 0.25em 0.3em #999;
}

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 2em;
}
</style>
