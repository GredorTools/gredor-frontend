<script lang="ts" setup>
/**
 * En komponent som visar en att-åtgärda-lista med uppgifter som eventuellt
 * behöver åtgärdas innan årsredovisningen kan färdigställas.
 */

import {
  removeTodoListItem,
  type TodoList,
} from "@/model/todolist/TodoList.ts";
import CommonDeleteButton from "@/components/common/CommonDeleteButton.vue";

/** Att-åtgärda-listan som ska visas. */
const todoList = defineModel<TodoList>("todoList", { required: true });
</script>

<template>
  <template v-if="todoList.items.length > 0">
    <h5 class="todo-header d-flex align-items-center">
      <i class="bi bi-list-check me-3 fs-4"></i>
      Att åtgärda
    </h5>

    <div class="todo-items">
      <div class="d-flex flex-column gap-3">
        <div
          v-for="item in todoList.items"
          :key="item.id"
          :data-testid="`todo-list-item-${item.id}`"
          class="todo-item card"
        >
          <div class="card-body p-3">
            <div class="d-flex justify-content-between">
              <div>
                <h6
                  :data-testid="`todo-list-item-${item.id}-title`"
                  class="mb-1"
                >
                  {{ item.title }}
                </h6>

                <p
                  v-if="item.description"
                  :data-testid="`todo-list-item-${item.id}-description`"
                  class="text-muted mb-2 small"
                >
                  {{ item.description }}
                </p>

                <div>
                  <span class="badge bg-light text-dark border">
                    <i class="bi bi-clock me-1"></i>
                    {{ new Date(item.timestamp).toLocaleDateString("sv-SE") }}
                    {{
                      new Date(item.timestamp).toLocaleTimeString("sv-SE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}
                  </span>
                </div>
              </div>

              <div class="ms-4">
                <CommonDeleteButton
                  :data-testid="`todo-list-item-delete-${item.id}`"
                  description="Ta bort avsnittet från att-åtgärda-listan"
                  @delete="removeTodoListItem(todoList, item.id)"
                />
              </div>
            </div>

            <ul v-if="item.tasks.length > 0" class="task-list mt-3 mb-0">
              <li
                v-for="(task, taskIndex) in item.tasks"
                :key="task.text"
                :data-testid="`todo-list-item-${item.id}-task-${taskIndex}`"
                class="task-item d-flex"
                role="button"
                tabindex="0"
                @click="task.complete = !task.complete"
                @keydown.enter="task.complete = !task.complete"
                @keydown.space.prevent="task.complete = !task.complete"
              >
                <i
                  :class="{
                    'bi-circle': !task.complete,
                    'bi-check-circle-fill text-success': task.complete,
                    'text-muted': !task.complete,
                  }"
                  class="bi me-2"
                ></i>
                <span
                  :class="{
                    'text-decoration-line-through text-muted': task.complete,
                  }"
                  >{{ task.text }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>

  <div v-else class="empty-state text-center p-4 text-muted">
    <i class="bi bi-check2-circle fs-1 mb-3 d-block"></i>
    <p class="empty-state-title">Allt klart!</p>
    <p class="empty-state-text">
      Här visas meddelanden från Gredor, t.ex. när fel upptäcks i
      årsredovisningen. Just nu finns det ingenting att åtgärda.
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.todo-header,
.todo-items {
  padding-left: $spacing-lg;
  padding-right: $spacing-lg;
}

.todo-header {
  padding-top: $spacing-lg;
  padding-bottom: $spacing-md;
}

.todo-items {
  max-height: 50vh;
  overflow-y: auto;
  padding-bottom: $spacing-lg;
}

.todo-item {
  border: 1px solid $border-color-normal;
  border-left: 4px solid $primary-color;
  background-color: $background-light;

  &:hover {
    box-shadow: $shadow-sm;
  }

  &:last-of-type {
    margin-bottom: 0 !important;
  }

  .badge {
    font-weight: normal;
  }
}

.task-list {
  list-style: none;
  padding-left: 0;
  border-top: 1px solid $border-color-normal;
  padding-top: $spacing-sm;

  .task-item {
    margin: $spacing-sm 0;
    cursor: pointer;
    font-size: $font-size-sm;
    border-radius: $border-radius-sm;

    &:hover {
      background-color: rgba($primary-color, 0.05);
    }

    .bi {
      margin-right: $spacing-sm;
    }
  }
}

.empty-state {
  i {
    color: darken($background-medium, 20%);
  }

  .empty-state-title {
    color: $dark;
    font-weight: 500;
    margin-bottom: $spacing-sm;
  }

  .empty-state-text {
    font-size: $font-size-xs;
    margin-bottom: $spacing-sm;
  }
}
</style>
