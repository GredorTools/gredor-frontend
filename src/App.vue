<script lang="ts" setup>
import { ref } from "vue";
import { exampleArsredovisning } from "@/example/ExampleArsredovisning.ts";
import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";
import ToolsFinalize from "@/components/tools/ToolsFinalize.vue";

const arsredovisning = ref(exampleArsredovisning);
</script>

<template>
  <header>
    <h1>Gredor</h1>
  </header>

  <div class="editor">
    <EditMain v-model="arsredovisning" />
  </div>

  <div>
    <RenderMain :arsredovisning="arsredovisning" />
  </div>

  <div></div>

  <div>
    <ToolsFinalize :arsredovisning="arsredovisning" />
  </div>
</template>

<style lang="scss" scoped>
header {
  grid-column: 1 / span 2;

  h1 {
    margin-bottom: 0;
  }
}

.editor {
  overflow-y: auto;

  border: 1px solid #566f41;
  border-radius: 0.5rem;
  background-color: #fdfff8;
  padding: 1rem;
}
</style>
