<script setup lang="ts">
/**
 * TaskItem.vue — 個別タスク表示コンポーネント
 *
 * 結合テストポイント:
 * - ステータス変更 select → emit('update-status')
 * - 削除ボタンクリック → emit('delete')
 * - 優先度バッジ・期限表示の正確性
 */
import type { Task, Status } from '@/types/task'
import { getPriorityLabel, getStatusLabel, formatRelativeDate } from '@/utils/formatter'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  'update-status': [id: string, status: Status]
  'delete': [id: string]
}>()

function onStatusChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update-status', props.task.id, target.value as Status)
}

function onDelete() {
  emit('delete', props.task.id)
}
</script>

<template>
  <div
    class="task-item"
    :class="`task-item--${task.status}`"
    :data-testid="`task-${task.id}`"
  >
    <div class="task-item__content">
      <div class="task-item__header">
        <h3 class="task-item__title" data-testid="task-title">{{ task.title }}</h3>
        <span
          class="task-item__priority"
          :class="`task-item__priority--${task.priority}`"
          data-testid="task-priority"
        >
          {{ getPriorityLabel(task.priority) }}
        </span>
      </div>

      <p
        v-if="task.description"
        class="task-item__description"
        data-testid="task-description"
      >
        {{ task.description }}
      </p>

      <div class="task-item__meta">
        <span class="task-item__due" data-testid="task-due">
          {{ formatRelativeDate(task.dueDate) }}
        </span>
      </div>
    </div>

    <div class="task-item__actions">
      <select
        :value="task.status"
        class="task-item__status-select"
        data-testid="status-select"
        @change="onStatusChange"
      >
        <option value="todo">{{ getStatusLabel('todo') }}</option>
        <option value="in-progress">{{ getStatusLabel('in-progress') }}</option>
        <option value="done">{{ getStatusLabel('done') }}</option>
      </select>

      <button
        class="task-item__delete-btn"
        data-testid="delete-btn"
        @click="onDelete"
      >
        削除
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: #1e1e2e;
  border-left: 4px solid transparent;
  transition: transform 0.15s, box-shadow 0.15s;
}

.task-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.task-item--todo { border-left-color: #fab387; }
.task-item--in-progress { border-left-color: #f9e2af; }
.task-item--done {
  border-left-color: #a6e3a1;
  opacity: 0.7;
}

.task-item__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #cdd6f4;
}

.task-item__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.task-item__priority {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.task-item__priority--high { background: #f38ba845; color: #f38ba8; }
.task-item__priority--medium { background: #f9e2af45; color: #f9e2af; }
.task-item__priority--low { background: #89b4fa45; color: #89b4fa; }

.task-item__description {
  font-size: 0.85rem;
  color: #a6adc8;
  margin: 0.35rem 0;
  line-height: 1.5;
}

.task-item__meta {
  font-size: 0.75rem;
  color: #6c7086;
  margin-top: 0.5rem;
}

.task-item__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.task-item__status-select {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #45475a;
  background: #313244;
  color: #cdd6f4;
  font-size: 0.8rem;
  cursor: pointer;
}

.task-item__delete-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #f38ba845;
  background: transparent;
  color: #f38ba8;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s;
}

.task-item__delete-btn:hover {
  background: #f38ba820;
}
</style>
