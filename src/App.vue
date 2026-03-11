<script setup lang="ts">
/**
 * App.vue — アプリケーションルート
 */
import { onMounted } from 'vue'
import type { TaskFormInput, Status } from '@/types/task'
import { useTaskManager } from '@/composables/useTaskManager'
import TaskStats from './components/TaskStats.vue'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'

const {
  tasks,
  isLoading,
  error,
  taskStats,
  loadTasks,
  addTask,
  changeStatus,
  removeTask,
} = useTaskManager()

onMounted(() => {
  loadTasks()
})

async function handleSubmit(data: TaskFormInput) {
  await addTask(data)
}

async function handleUpdateStatus(id: string, status: Status) {
  await changeStatus(id, status)
}

async function handleDelete(id: string) {
  await removeTask(id)
}
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">Task Manager</h1>
      <p class="app__subtitle">Vue.js + TypeScript + Vitest</p>
    </header>

    <main class="app__main">
      <div
        v-if="error"
        class="app__error"
        data-testid="error-banner"
      >
        {{ error }}
      </div>

      <TaskStats
        :total="taskStats.total"
        :todo="taskStats.todo"
        :in-progress="taskStats.inProgress"
        :done="taskStats.done"
      />

      <div class="app__content">
        <aside class="app__sidebar">
          <TaskForm @submit="handleSubmit" />
        </aside>

        <section class="app__tasks">
          <div v-if="isLoading" class="app__loading" data-testid="loading">
            読み込み中...
          </div>
          <TaskList
            v-else
            :tasks="tasks"
            @update-status="handleUpdateStatus"
            @delete="handleDelete"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #11111b;
  color: #cdd6f4;
  line-height: 1.6;
  min-height: 100vh;
}

.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.app__header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.app__title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #89b4fa, #cba6f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app__subtitle {
  font-size: 0.85rem;
  color: #6c7086;
  margin-top: 0.25rem;
}

.app__error {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #f38ba820;
  border: 1px solid #f38ba845;
  color: #f38ba8;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.app__content {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
  align-items: start;
}

.app__loading {
  text-align: center;
  padding: 3rem;
  color: #6c7086;
}

@media (max-width: 800px) {
  .app__content {
    grid-template-columns: 1fr;
  }
}
</style>
