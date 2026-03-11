/**
 * taskApi.spec.ts — API層のモック・非同期テスト
 *
 * テスト設計:
 * - vi.fn() でlocalStorageをモック
 * - async/await の非同期テスト
 * - エラーケース（存在しないID）の検証
 * - vi.spyOn でストレージ操作を監視
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '@/services/taskApi'

// localStorage のモック
const mockStorage: Record<string, string> = {}
const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { mockStorage[key] = value }),
  removeItem: vi.fn((key: string) => { delete mockStorage[key] }),
  clear: vi.fn(() => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]) }),
  length: 0,
  key: vi.fn(() => null),
}

// グローバル localStorage を差し替え
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('taskApi', () => {
  beforeEach(() => {
    // 各テスト前にストレージとモックをリセット
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k])
    vi.clearAllMocks()
  })

  // ============================================================
  // fetchTasks
  // ============================================================
  describe('fetchTasks', () => {
    it('空のストレージから空配列を返す', async () => {
      const result = await fetchTasks()
      expect(result).toEqual([])
    })

    it('ストレージのデータを返す', async () => {
      const stored = [
        {
          id: 'task-1',
          title: 'テスト',
          description: '',
          priority: 'medium',
          status: 'todo',
          createdAt: '2026-03-11T00:00:00.000Z',
          dueDate: null,
        },
      ]
      mockStorage['test-learn-tasks'] = JSON.stringify(stored)

      const result = await fetchTasks()
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('テスト')
      expect(result[0].createdAt).toBeInstanceOf(Date)
    })

    it('localStorage.getItem が呼ばれる', async () => {
      await fetchTasks()
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-learn-tasks')
    })
  })

  // ============================================================
  // createTask
  // ============================================================
  describe('createTask', () => {
    it('タスクを作成してIDが付与される', async () => {
      const result = await createTask({
        title: '新しいタスク',
        description: '詳細',
        priority: 'high',
        dueDate: '2026-12-31',
      })

      expect(result.id).toBeDefined()
      expect(result.title).toBe('新しいタスク')
      expect(result.status).toBe('todo')
      expect(result.createdAt).toBeInstanceOf(Date)
    })

    it('localStorage.setItem が呼ばれる', async () => {
      await createTask({
        title: 'テスト',
        description: '',
        priority: 'medium',
        dueDate: '',
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('期限なしの場合 dueDate が null になる', async () => {
      const result = await createTask({
        title: 'テスト',
        description: '',
        priority: 'medium',
        dueDate: '',
      })

      expect(result.dueDate).toBeNull()
    })
  })

  // ============================================================
  // updateTaskStatus
  // ============================================================
  describe('updateTaskStatus', () => {
    it('ステータスを更新できる', async () => {
      // 事前にタスクを作成
      const created = await createTask({
        title: 'テスト',
        description: '',
        priority: 'medium',
        dueDate: '',
      })

      const updated = await updateTaskStatus(created.id, 'in-progress')
      expect(updated.status).toBe('in-progress')
    })

    it('存在しないIDでエラーを投げる', async () => {
      await expect(
        updateTaskStatus('nonexistent-id', 'done')
      ).rejects.toThrowError('タスクが見つかりません')
    })
  })

  // ============================================================
  // deleteTask
  // ============================================================
  describe('deleteTask', () => {
    it('タスクを削除できる', async () => {
      const created = await createTask({
        title: '削除テスト',
        description: '',
        priority: 'low',
        dueDate: '',
      })

      await deleteTask(created.id)
      const remaining = await fetchTasks()
      expect(remaining.find((t) => t.id === created.id)).toBeUndefined()
    })

    it('存在しないIDでエラーを投げる', async () => {
      await expect(
        deleteTask('nonexistent-id')
      ).rejects.toThrowError('タスクが見つかりません')
    })
  })
})
