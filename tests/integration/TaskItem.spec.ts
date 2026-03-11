/**
 * TaskItem.spec.ts — 個別タスクコンポーネントの結合テスト
 *
 * テスト設計:
 * - ステータス select 変更 → emit('update-status') 検証
 * - 削除ボタンクリック → emit('delete') 検証
 * - 優先度バッジ・期限表示の正確性
 * - ステータスに応じたCSSクラの適用
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItem from '@/components/TaskItem.vue'
import type { Task } from '@/types/task'

const baseTask: Task = {
  id: 'test-1',
  title: 'テストタスク',
  description: '詳細な説明',
  priority: 'high',
  status: 'todo',
  createdAt: new Date('2026-03-11'),
  dueDate: new Date('2026-03-20'),
}

function mountTaskItem(taskOverrides: Partial<Task> = {}) {
  return mount(TaskItem, {
    props: {
      task: { ...baseTask, ...taskOverrides },
    },
  })
}

describe('TaskItem.vue', () => {
  // ----- 表示 -----
  describe('タスク情報の表示', () => {
    it('タイトルが表示される', () => {
      const wrapper = mountTaskItem()
      expect(wrapper.find('[data-testid="task-title"]').text()).toBe('テストタスク')
    })

    it('説明文が表示される', () => {
      const wrapper = mountTaskItem()
      expect(wrapper.find('[data-testid="task-description"]').text()).toBe('詳細な説明')
    })

    it('説明が空の場合は非表示', () => {
      const wrapper = mountTaskItem({ description: '' })
      expect(wrapper.find('[data-testid="task-description"]').exists()).toBe(false)
    })

    it('優先度ラベルが表示される', () => {
      const wrapper = mountTaskItem({ priority: 'high' })
      expect(wrapper.find('[data-testid="task-priority"]').text()).toBe('高')
    })

    it('期限が表示される', () => {
      const wrapper = mountTaskItem()
      expect(wrapper.find('[data-testid="task-due"]').text()).toBeTruthy()
    })
  })

  // ----- CSSクラス -----
  describe('ステータスに応じたスタイル', () => {
    it('todoクラスが適用される', () => {
      const wrapper = mountTaskItem({ status: 'todo' })
      expect(wrapper.find('.task-item--todo').exists()).toBe(true)
    })

    it('in-progressクラスが適用される', () => {
      const wrapper = mountTaskItem({ status: 'in-progress' })
      expect(wrapper.find('.task-item--in-progress').exists()).toBe(true)
    })

    it('doneクラスが適用される', () => {
      const wrapper = mountTaskItem({ status: 'done' })
      expect(wrapper.find('.task-item--done').exists()).toBe(true)
    })
  })

  // ----- ステータス変更 -----
  describe('ステータス変更', () => {
    it('selectを変更するとupdate-statusイベントが発火する', async () => {
      const wrapper = mountTaskItem()

      await wrapper.find('[data-testid="status-select"]').setValue('in-progress')

      const emitted = wrapper.emitted('update-status')
      expect(emitted).toBeTruthy()
      expect(emitted![0]).toEqual(['test-1', 'in-progress'])
    })
  })

  // ----- 削除 -----
  describe('削除', () => {
    it('削除ボタンクリックでdeleteイベントが発火する', async () => {
      const wrapper = mountTaskItem()

      await wrapper.find('[data-testid="delete-btn"]').trigger('click')

      const emitted = wrapper.emitted('delete')
      expect(emitted).toBeTruthy()
      expect(emitted![0]).toEqual(['test-1'])
    })
  })
})
