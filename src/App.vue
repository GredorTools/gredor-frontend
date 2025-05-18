<script lang="ts" setup>
import { ref } from "vue";
import { exampleArsredovisning } from "@/example/ExampleArsredovisning.ts";
import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";

const arsredovsining = ref(exampleArsredovisning);
</script>

<template>
  <div>
    <header>
      <h1>Gredor</h1>
    </header>

    <EditMain v-model="arsredovsining" />
  </div>

  <main>
    <RenderMain :arsredovsining="arsredovsining" />
  </main>
</template>

<style lang="scss" scoped></style>
