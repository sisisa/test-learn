/**
 * taskFilter.spec.ts — フィルタリング・ソート・検索の単体テスト
 *
 * テスト設計:
 * - フィルター: 全件一致・部分一致・0件
 * - ソート: 昇順・降順・null値の扱い
 * - 検索: 部分一致・大小文字無視・空クエリ
 * - 元配列を変更しないイミュータブル性
 */

import { describe, it, expect } from 'vitest'
import {
  filterByStatus,
  filterByPriority,
  searchTasks,
  sortTasks,
  applyFilters,
} from '@/utils/taskFilter'
import type { Task } from '@/types/task'

/** テスト用のタスクデータを生成するヘルパー */
function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'テストタスク',
    description: 'テスト用の説明',
    priority: 'medium',
    status: 'todo',
    createdAt: new Date('2026-03-01'),
    dueDate: new Date('2026-03-15'),
    ...overrides,
  }
}

// テストデータ
const tasks: Task[] = [
  createTask({ id: '1', title: 'API設計', status: 'todo', priority: 'high', createdAt: new Date('2026-03-01'), dueDate: new Date('2026-03-10') }),
  createTask({ id: '2', title: 'テスト実装', description: 'Vitestで実装', status: 'in-progress', priority: 'high', createdAt: new Date('2026-03-02'), dueDate: new Date('2026-03-20') }),
  createTask({ id: '3', title: 'ドキュメント作成', status: 'todo', priority: 'low', createdAt: new Date('2026-03-03'), dueDate: null }),
  createTask({ id: '4', title: 'デプロイ設定', status: 'done', priority: 'medium', createdAt: new Date('2026-03-04'), dueDate: new Date('2026-03-05') }),
]

// ============================================================
// filterByStatus
// ============================================================
describe('filterByStatus', () => {
  it('"all" で全件を返す', () => {
    expect(filterByStatus(tasks, 'all')).toHaveLength(4)
  })

  it('"todo" で未着手タスクのみ返す', () => {
    const result = filterByStatus(tasks, 'todo')
    expect(result).toHaveLength(2)
    expect(result.every((t) => t.status === 'todo')).toBe(true)
  })

  it('"done" で完了タスクのみ返す', () => {
    const result = filterByStatus(tasks, 'done')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('4')
  })

  it('元の配列を変更しない', () => {
    const original = [...tasks]
    filterByStatus(tasks, 'todo')
    expect(tasks).toEqual(original)
  })
})

// ============================================================
// filterByPriority
// ============================================================
describe('filterByPriority', () => {
  it('"all" で全件を返す', () => {
    expect(filterByPriority(tasks, 'all')).toHaveLength(4)
  })

  it('"high" で高優先度のみ返す', () => {
    const result = filterByPriority(tasks, 'high')
    expect(result).toHaveLength(2)
    expect(result.every((t) => t.priority === 'high')).toBe(true)
  })

  it('該当なしで空配列を返す', () => {
    const singleTask = [createTask({ priority: 'high' })]
    expect(filterByPriority(singleTask, 'low')).toHaveLength(0)
  })
})

// ============================================================
// searchTasks
// ============================================================
describe('searchTasks', () => {
  it('タイトルの部分一致で検索できる', () => {
    const result = searchTasks(tasks, 'API')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('API設計')
  })

  it('説明文からも検索できる', () => {
    const result = searchTasks(tasks, 'Vitest')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('テスト実装')
  })

  it('大文字小文字を区別しない', () => {
    const result = searchTasks(tasks, 'api')
    expect(result).toHaveLength(1)
  })

  it('空のクエリで全件を返す', () => {
    expect(searchTasks(tasks, '')).toHaveLength(4)
  })

  it('空白のみのクエリで全件を返す', () => {
    expect(searchTasks(tasks, '   ')).toHaveLength(4)
  })

  it('該当なしで空配列を返す', () => {
    expect(searchTasks(tasks, '存在しないキーワード')).toHaveLength(0)
  })
})

// ============================================================
// sortTasks
// ============================================================
describe('sortTasks', () => {
  it('作成日で昇順ソート', () => {
    const result = sortTasks(tasks, 'createdAt', 'asc')
    expect(result[0].id).toBe('1')
    expect(result[3].id).toBe('4')
  })

  it('作成日で降順ソート', () => {
    const result = sortTasks(tasks, 'createdAt', 'desc')
    expect(result[0].id).toBe('4')
    expect(result[3].id).toBe('1')
  })

  it('優先度でソート（高→低）', () => {
    const result = sortTasks(tasks, 'priority', 'desc')
    expect(result[0].priority).toBe('high')
    expect(result[result.length - 1].priority).toBe('low')
  })

  it('期限日ソートでnullは末尾になる', () => {
    const result = sortTasks(tasks, 'dueDate', 'asc')
    expect(result[result.length - 1].dueDate).toBeNull()
  })

  it('元の配列を変更しない', () => {
    const original = [...tasks]
    sortTasks(tasks, 'createdAt', 'asc')
    expect(tasks).toEqual(original)
  })
})

// ============================================================
// applyFilters（複合フィルター）
// ============================================================
describe('applyFilters', () => {
  it('ステータスと優先度の複合フィルター', () => {
    const result = applyFilters(tasks, { status: 'todo', priority: 'high' })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('API設計')
  })

  it('検索とステータスの複合フィルター', () => {
    const result = applyFilters(tasks, { status: 'todo', searchQuery: 'ドキュメント' })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('ドキュメント作成')
  })

  it('条件なしで全件を返す', () => {
    expect(applyFilters(tasks, {})).toHaveLength(4)
  })
})
