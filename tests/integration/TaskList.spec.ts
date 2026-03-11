/**
 * TaskList.spec.ts — タスク一覧の結合テスト
 *
 * テスト設計:
 * - フィルター select 操作 → 表示タスク数の変化
 * - 検索入力 → 絞り込み
 * - 空状態メッセージの表示
 * - TaskItem への props 伝搬と emit バブルアップ
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '@/components/TaskList.vue'
import type { Task } from '@/types/task'

/** テスト用タスクデータ */
const testTasks: Task[] = [
  {
    id: '1',
    title: 'API設計書を書く',
    description: 'REST APIの設計',
    priority: 'high',
    status: 'todo',
    createdAt: new Date('2026-03-01'),
    dueDate: new Date('2026-03-15'),
  },
  {
    id: '2',
    title: 'テストコード実装',
    description: 'Vitestでテスト',
    priority: 'medium',
    status: 'in-progress',
    createdAt: new Date('2026-03-02'),
    dueDate: new Date('2026-03-20'),
  },
  {
    id: '3',
    title: 'README更新',
    description: '',
    priority: 'low',
    status: 'done',
    createdAt: new Date('2026-03-03'),
    dueDate: null,
  },
]

describe('TaskList.vue', () => {
  function mountTaskList(tasks: Task[] = testTasks) {
    return mount(TaskList, {
      props: { tasks },
    })
  }

  // ----- 初期表示 -----
  describe('初期表示', () => {
    it('全タスクが表示される', () => {
      const wrapper = mountTaskList()
      expect(wrapper.find('[data-testid="task-count"]').text()).toContain('3')
    })

    it('空配列で空メッセージが表示される', () => {
      const wrapper = mountTaskList([])
      expect(wrapper.find('[data-testid="empty-message"]').exists()).toBe(true)
    })
  })

  // ----- ステータスフィルター -----
  describe('ステータスフィルター', () => {
    it('"未着手" で絞り込める', async () => {
      const wrapper = mountTaskList()

      await wrapper.find('[data-testid="status-filter"]').setValue('todo')

      expect(wrapper.find('[data-testid="task-count"]').text()).toContain('1')
    })

    it('"完了" で絞り込める', async () => {
      const wrapper = mountTaskList()

      await wrapper.find('[data-testid="status-filter"]').setValue('done')

      expect(wrapper.find('[data-testid="task-count"]').text()).toContain('1')
    })

    it('"すべて" に戻すと全件表示される', async () => {
      const wrapper = mountTaskList()

      await wrapper.find('[data-testid="status-filter"]').setValue('todo')
      await wrapper.find('[data-testid="status-filter"]').setValue('all')

      expect(wrapper.find('[data-testid="task-count"]').text()).toContain('3')
    })
  })

  // ----- 優先度フィルター -----
  describe('優先度フィルター', () => {
    it('"高" で絞り込める', async () => {
      const wrapper = mountTaskList()

      await wrapper.find('[data-testid="priority-filter"]').setValue('high')

      expect(wrapper.find('[data-testid="task-count"]').text()).toContain('1')
    })
  })

  // ----- 検索 -----
  describe('検索', () => {
    it('タイトルで検索できる', async () => {
      const wrapper = mountTaskList()

      await wrapper.find('[data-testid="search-input"]').setValue('API')

      expect(wrapper.find('[data-testid="task-count"]').text()).toContain('1')
    })

    it('該当なしで空メッセージが表示される', async () => {
      const wrapper = mountTaskList()

      await wrapper.find('[data-testid="search-input"]').setValue('存在しないキーワード')

      expect(wrapper.find('[data-testid="empty-message"]').exists()).toBe(true)
    })
  })

  // ----- 複合フィルター -----
  describe('複合フィルター', () => {
    it('ステータスと検索を組み合わせて絞り込める', async () => {
      const wrapper = mountTaskList()

      await wrapper.find('[data-testid="status-filter"]').setValue('todo')
      await wrapper.find('[data-testid="search-input"]').setValue('API')

      expect(wrapper.find('[data-testid="task-count"]').text()).toContain('1')
    })
  })
})
