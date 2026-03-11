/**
 * taskFilter.ts — タスクのフィルタリング・ソート・検索ロジック
 *
 * テストポイント:
 * - 各フィルターの正確性
 * - ソート順（昇順・降順）
 * - 検索の部分一致・大小文字無視
 * - 空配列・全件一致のエッジケース
 */

import type { Task, Status, Priority, SortKey, SortOrder } from '@/types/task'

/**
 * ステータスでフィルタリングする
 */
export function filterByStatus(tasks: Task[], status: Status | 'all'): Task[] {
  if (status === 'all') return tasks

  return tasks.filter((task) => task.status === status)
}

/**
 * 優先度でフィルタリングする
 */
export function filterByPriority(tasks: Task[], priority: Priority | 'all'): Task[] {
  if (priority === 'all') return tasks

  return tasks.filter((task) => task.priority === priority)
}

/**
 * タイトルまたは説明文で部分一致検索する（大文字小文字を区別しない）
 */
export function searchTasks(tasks: Task[], query: string): Task[] {
  const trimmed = query.trim().toLowerCase()

  if (trimmed === '') return tasks

  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(trimmed) ||
      task.description.toLowerCase().includes(trimmed)
  )
}

/** 優先度の重み（ソート用） */
const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

/**
 * タスクをソートする
 */
export function sortTasks(tasks: Task[], key: SortKey, order: SortOrder): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0

    switch (key) {
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break

      case 'dueDate': {
        const aTime = a.dueDate?.getTime() ?? Infinity
        const bTime = b.dueDate?.getTime() ?? Infinity
        comparison = aTime - bTime
        break
      }

      case 'priority':
        comparison = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
        break
    }

    return comparison
  })

  return order === 'desc' ? sorted.reverse() : sorted
}

/**
 * 複数のフィルター条件を組み合わせてタスクを絞り込む
 */
export function applyFilters(
  tasks: Task[],
  options: {
    status?: Status | 'all'
    priority?: Priority | 'all'
    searchQuery?: string
  }
): Task[] {
  let result = tasks

  if (options.status) {
    result = filterByStatus(result, options.status)
  }

  if (options.priority) {
    result = filterByPriority(result, options.priority)
  }

  if (options.searchQuery) {
    result = searchTasks(result, options.searchQuery)
  }

  return result
}
