/**
 * useTaskManager.ts — タスクCRUD + 状態管理の Composable
 *
 * テストポイント:
 * - API層のモック注入で外部依存を分離
 * - リアクティブな状態変化の検証
 * - エラーハンドリング（loading / error 状態）
 * - computed プロパティ（統計情報）のリアクティブ検証
 */

import { ref, computed } from 'vue'
import type { Task, TaskFormInput, Status } from '@/types/task'
import * as taskApi from '@/services/taskApi'

/** API関数の型（テスト時にモック注入用） */
export interface TaskApiDeps {
  fetchTasks: typeof taskApi.fetchTasks
  createTask: typeof taskApi.createTask
  updateTaskStatus: typeof taskApi.updateTaskStatus
  deleteTask: typeof taskApi.deleteTask
}

/**
 * タスク管理 Composable
 * @param api - API依存の注入（テスト時にモック可）
 */
export function useTaskManager(api: TaskApiDeps = taskApi) {
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /** 各ステータスの件数 */
  const taskStats = computed(() => ({
    total: tasks.value.length,
    todo: tasks.value.filter((t) => t.status === 'todo').length,
    inProgress: tasks.value.filter((t) => t.status === 'in-progress').length,
    done: tasks.value.filter((t) => t.status === 'done').length,
  }))

  /** タスク一覧を読み込む */
  async function loadTasks() {
    isLoading.value = true
    error.value = null

    try {
      tasks.value = await api.fetchTasks()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '読み込みに失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  /** タスクを追加する */
  async function addTask(input: TaskFormInput) {
    error.value = null

    try {
      const newTask = await api.createTask(input)
      tasks.value.push(newTask)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '追加に失敗しました'
    }
  }

  /** タスクのステータスを変更する */
  async function changeStatus(id: string, status: Status) {
    error.value = null

    try {
      const updated = await api.updateTaskStatus(id, status)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updated
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'ステータス変更に失敗しました'
    }
  }

  /** タスクを削除する */
  async function removeTask(id: string) {
    error.value = null

    try {
      await api.deleteTask(id)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '削除に失敗しました'
    }
  }

  return {
    tasks,
    isLoading,
    error,
    taskStats,
    loadTasks,
    addTask,
    changeStatus,
    removeTask,
  }
}
