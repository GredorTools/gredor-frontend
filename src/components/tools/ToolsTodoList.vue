<script lang="ts" setup>
/**
 * En komponent med en knapp som visar en att-åtgärda-lista i en popover, med
 * uppgifter som eventuellt behöver göras innan årsredovisningen kan
 * färdigställas.
 */

import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { Popover } from "bootstrap";
import ToolsTodoListPopover from "@/components/tools/todolist/ToolsTodoListContent.vue";
import type { TodoList } from "@/model/todolist/TodoList.ts";

/** Att-åtgärda-listan som ska visas. */
const todoList = defineModel<TodoList>("todoList", { required: true });

const popoverVisible = ref<boolean>(false);

const todoBtn = useTemplateRef("todo-btn");
const popoverContent = useTemplateRef("popover-content");

let popover: Popover | undefined;

onMounted(() => {
  if (!(todoBtn.value && popoverContent.value)) {
    throw new Error("Missing required template refs for popover");
  }

  popover = new Popover(todoBtn.value, {
    content: popoverContent.value,
    html: true,
    placement: "top",
    offset: [0, 12],
    trigger: "manual",
    container: "body",
    customClass: "todo-popover",
  });
});

const numTasksRemaining = computed(
  () =>
    todoList.value.items
      .flatMap((item) => item.tasks)
      .filter((task) => !task.complete).length,
);

watch(popoverVisible, (newVisible, oldVisible) => {
  if (popover) {
    if (newVisible && !oldVisible) {
      popover.show();
    } else if (!newVisible && oldVisible) {
      popover.hide();
    }
  }
});
</script>

<template>
  <button
    ref="todo-btn"
    :class="{
      'btn-secondary': popoverVisible,
      'btn-outline-secondary': !popoverVisible,
    }"
    class="btn"
    data-testid="todo-list-button"
    type="button"
    @click="popoverVisible = !popoverVisible"
  >
    <span class="todo-icon-and-text-container">
      <template v-if="popoverVisible">
        <i class="bi bi-x-lg me-2"></i>
        Stäng
      </template>
      <template v-else>
        <i class="bi bi-list-check me-2"></i>
        Att åtgärda
      </template>
    </span>

    <span
      v-if="numTasksRemaining > 0"
      class="badge rounded-pill bg-danger ms-2 font-monospace"
      data-testid="todo-list-num-tasks-remaining"
    >
      {{ numTasksRemaining }}
    </span>
  </button>

  <div class="d-none">
    <div
      ref="popover-content"
      class="text-start"
      data-testid="todo-list-popover-content"
    >
      <ToolsTodoListPopover v-model:todo-list="todoList" />
    </div>
  </div>
</template>

<style lang="scss">
// OBS! Ej scoped
.todo-popover {
  @import "@/assets/_variables.scss";

  --bs-popover-body-padding-x: 0;
  --bs-popover-body-padding-y: 0;
  --bs-popover-max-width: 450px;
  --bs-popover-font-size: $font-size-base;
}
</style>

<style lang="scss" scoped>
.todo-icon-and-text-container {
  min-width: 11ch;
}
</style>
