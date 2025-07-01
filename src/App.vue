<script lang="ts" setup>
/**
 * Huvudkomponenten som sammanför alla delar av applikationen.
 */

import { ref } from "vue";
import { exampleArsredovisning } from "@/example/ExampleArsredovisning.ts";
import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";
import ToolsFinalize from "@/components/tools/ToolsFinalize.vue";
import { getConfigValue } from "@/util/configUtils.ts";

const arsredovisning = ref(exampleArsredovisning);

const environmentName = getConfigValue("VITE_ENV_NAME");
</script>

<template>
  <header>
    <h1>
      Gredor
      <span v-if="environmentName" class="environment">{{
        environmentName
      }}</span>
    </h1>
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

    .environment {
      color: #566f41;
      font-style: italic;
    }
  }
}

.editor {
  overflow-y: auto;

  border: 1px solid #566f41;
  border-radius: 0.5rem;
  background-color: #fdfff8;
  padding: 1rem;
  justify-self: end;

  width: 100%;
}
</style>
