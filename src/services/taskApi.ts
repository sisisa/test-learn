/**
 * taskApi.ts — API通信の模擬レイヤー
 *
 * テストポイント:
 * - vi.fn() によるモック
 * - async/await の非同期テスト
 * - エラーハンドリング（ネットワークエラーのシミュレーション）
 *
 * localStorage を永続化先として使い、遅延を付与してAPIを再現する。
 */

import type { Task, TaskFormInput, Status } from '@/types/task'

const STORAGE_KEY = 'test-learn-tasks'

/** API応答の遅延をシミュレーションする */
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** ユニークIDを生成する */
function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** localStorage からタスクを読み込む */
function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>
    return parsed.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt as string),
      dueDate: item.dueDate ? new Date(item.dueDate as string) : null,
    })) as Task[]
  } catch {
    return []
  }
}

/** localStorage にタスクを保存する */
function saveToStorage(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

/**
 * タスク一覧を取得する
 */
export async function fetchTasks(): Promise<Task[]> {
  await delay()
  return loadFromStorage()
}

/**
 * タスクを作成する
 */
export async function createTask(input: TaskFormInput): Promise<Task> {
  await delay()

  const newTask: Task = {
    id: generateId(),
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    status: 'todo',
    createdAt: new Date(),
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  }

  const tasks = loadFromStorage()
  tasks.push(newTask)
  saveToStorage(tasks)

  return newTask
}

/**
 * タスクのステータスを更新する
 * @throws {Error} タスクが見つからない場合
 */
export async function updateTaskStatus(id: string, status: Status): Promise<Task> {
  await delay()

  const tasks = loadFromStorage()
  const index = tasks.findIndex((t) => t.id === id)

  if (index === -1) {
    throw new Error(`タスクが見つかりません: ${id}`)
  }

  tasks[index].status = status
  saveToStorage(tasks)

  return tasks[index]
}

/**
 * タスクを削除する
 * @throws {Error} タスクが見つからない場合
 */
export async function deleteTask(id: string): Promise<void> {
  await delay()

  const tasks = loadFromStorage()
  const index = tasks.findIndex((t) => t.id === id)

  if (index === -1) {
    throw new Error(`タスクが見つかりません: ${id}`)
  }

  tasks.splice(index, 1)
  saveToStorage(tasks)
}
