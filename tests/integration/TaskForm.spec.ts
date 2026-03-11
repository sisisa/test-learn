/**
 * TaskForm.spec.ts — タスクフォームの結合テスト
 *
 * テスト設計:
 * - フォーム入力 → バリデーションエラー表示
 * - 有効入力 → 送信ボタン活性化 → submit emit
 * - submitイベントのペイロード検証
 * - フォームリセット
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskForm from '@/components/TaskForm.vue'

describe('TaskForm.vue', () => {
  // ----- バリデーション表示 -----
  describe('バリデーション', () => {
    it('空のまま送信するとタイトルエラーが表示される', async () => {
      const wrapper = mount(TaskForm)

      await wrapper.find('[data-testid="task-form"]').trigger('submit')

      expect(wrapper.find('[data-testid="error-title"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="error-title"]').text()).toContain('必須')
    })

    it('タイトル入力後にblurでバリデーションが走る', async () => {
      const wrapper = mount(TaskForm)

      const input = wrapper.find('[data-testid="input-title"]')
      // 一度値を入れてからblurでdirtyにし、その後空にする
      await input.setValue('a')
      await input.trigger('blur')
      await input.setValue('')

      // dirtyかつ空なのでエラー表示
      expect(wrapper.find('[data-testid="error-title"]').exists()).toBe(true)
    })
  })

  // ----- 送信ボタンの状態 -----
  describe('送信ボタン', () => {
    it('初期状態では無効化されている', () => {
      const wrapper = mount(TaskForm)

      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('有効な入力後に活性化される', async () => {
      const wrapper = mount(TaskForm)

      await wrapper.find('[data-testid="input-title"]').setValue('テストタスク')

      // validate() を呼ぶために一度submitする（内部でvalidateが呼ばれるため）
      // 代わりに手動でblurを発火してdirtyにする
      await wrapper.find('[data-testid="input-title"]').trigger('blur')

      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(false)
    })
  })

  // ----- submit emit -----
  describe('送信', () => {
    it('有効なフォームを送信するとsubmitイベントが発火する', async () => {
      const wrapper = mount(TaskForm)

      // フォームに入力
      await wrapper.find('[data-testid="input-title"]').setValue('テストタスク')
      await wrapper.find('[data-testid="input-description"]').setValue('説明文')
      await wrapper.find('[data-testid="input-priority"]').setValue('high')

      // フォーム送信
      await wrapper.find('[data-testid="task-form"]').trigger('submit')

      // emitの確認
      const emitted = wrapper.emitted('submit')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toMatchObject({
        title: 'テストタスク',
        description: '説明文',
        priority: 'high',
      })
    })

    it('送信後にフォームがリセットされる', async () => {
      const wrapper = mount(TaskForm)

      await wrapper.find('[data-testid="input-title"]').setValue('テストタスク')
      await wrapper.find('[data-testid="task-form"]').trigger('submit')

      // 送信後のリセット確認
      const titleInput = wrapper.find('[data-testid="input-title"]').element as HTMLInputElement
      expect(titleInput.value).toBe('')
    })
  })
})
