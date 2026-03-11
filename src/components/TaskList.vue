<script setup lang="ts">
/**
 * TaskList.vue — タスク一覧 + フィルター
 *
 * 結合テストポイント:
 * - フィルター選択 → 表示タスクの変化
 * - 検索入力 → 表示タスクの絞り込み
 * - 空状態のメッセージ表示
 */
import { ref, computed } from 'vue'
import type { Task, Status, Priority } from '@/types/task'
import { applyFilters } from '@/utils/taskFilter'
import TaskItem from './TaskItem.vue'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  'update-status': [id: string, status: Status]
  'delete': [id: string]
}>()

const statusFilter = ref<Status | 'all'>('all')
const priorityFilter = ref<Priority | 'all'>('all')
const searchQuery = ref('')

const filteredTasks = computed(() =>
  applyFilters(props.tasks, {
    status: statusFilter.value,
    priority: priorityFilter.value,
    searchQuery: searchQuery.value,
  })
)
</script>

<template>
  <div class="task-list">
    <div class="task-list__filters">
      <input
        v-model="searchQuery"
        type="text"
        class="task-list__search"
        data-testid="search-input"
        placeholder="タスクを検索..."
      />

      <select
        v-model="statusFilter"
        class="task-list__filter-select"
        data-testid="status-filter"
      >
        <option value="all">すべてのステータス</option>
        <option value="todo">未着手</option>
        <option value="in-progress">進行中</option>
        <option value="done">完了</option>
      </select>

      <select
        v-model="priorityFilter"
        class="task-list__filter-select"
        data-testid="priority-filter"
      >
        <option value="all">すべての優先度</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
    </div>

    <p class="task-list__count" data-testid="task-count">
      {{ filteredTasks.length }} 件のタスク
    </p>

    <div v-if="filteredTasks.length > 0" class="task-list__items">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @update-status="(id, status) => emit('update-status', id, status)"
        @delete="(id) => emit('delete', id)"
      />
    </div>

    <div v-else class="task-list__empty" data-testid="empty-message">
      <p>該当するタスクがありません</p>
    </div>
  </div>
</template>

<style scoped>
.task-list__filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.task-list__search {
  flex: 1;
  min-width: 200px;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #45475a;
  background: #313244;
  color: #cdd6f4;
  font-size: 0.85rem;
}

.task-list__search:focus {
  outline: none;
  border-color: #89b4fa;
}

.task-list__search::placeholder {
  color: #6c7086;
}

.task-list__filter-select {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #45475a;
  background: #313244;
  color: #cdd6f4;
  font-size: 0.85rem;
  cursor: pointer;
}

.task-list__count {
  font-size: 0.8rem;
  color: #6c7086;
  margin: 0 0 1rem;
}

.task-list__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-list__empty {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c7086;
  font-size: 0.9rem;
}
</style>
