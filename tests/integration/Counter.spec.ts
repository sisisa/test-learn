/**
 * Counter.spec.ts — Counter.vue の結合テスト
 *
 * @vue/test-utils を使ってコンポーネントをマウントし、
 * ユーザー操作（クリック）→ 状態変化 → DOM更新 の一連の流れを検証します。
 *
 * 単体テストとの違い:
 * - 単体テスト: 関数やcomposableを直接呼び出してテスト
 * - 結合テスト: コンポーネント全体（テンプレート + ロジック）を検証
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  // ----- 初期表示 -----
  describe('初期表示', () => {
    it('初期カウントが0と表示される', () => {
      const wrapper = mount(Counter)
      expect(wrapper.find('[data-testid="count"]').text()).toBe('0')
    })

    it('2倍の値が0と表示される', () => {
      const wrapper = mount(Counter)
      expect(wrapper.find('[data-testid="double-count"]').text()).toContain('0')
    })

    it('「正の数ではありません」と表示される', () => {
      const wrapper = mount(Counter)
      expect(wrapper.find('[data-testid="is-positive"]').text()).toBe('正の数ではありません')
    })
  })

  // ----- ボタン操作 -----
  describe('インクリメント', () => {
    it('＋ボタンをクリックするとカウントが1に増える', async () => {
      const wrapper = mount(Counter)
      await wrapper.find('#increment').trigger('click')
      expect(wrapper.find('[data-testid="count"]').text()).toBe('1')
    })

    it('＋ボタンを3回クリックするとカウントが3になる', async () => {
      const wrapper = mount(Counter)
      for (let i = 0; i < 3; i++) {
        await wrapper.find('#increment').trigger('click')
      }
      expect(wrapper.find('[data-testid="count"]').text()).toBe('3')
    })
  })

  describe('デクリメント', () => {
    it('−ボタンをクリックするとカウントが-1になる', async () => {
      const wrapper = mount(Counter)
      await wrapper.find('#decrement').trigger('click')
      expect(wrapper.find('[data-testid="count"]').text()).toBe('-1')
    })
  })

  describe('リセット', () => {
    it('リセットボタンで0に戻る', async () => {
      const wrapper = mount(Counter)
      // まずカウントを増やす
      await wrapper.find('#increment').trigger('click')
      await wrapper.find('#increment').trigger('click')
      expect(wrapper.find('[data-testid="count"]').text()).toBe('2')

      // リセット
      await wrapper.find('#reset').trigger('click')
      expect(wrapper.find('[data-testid="count"]').text()).toBe('0')
    })
  })

  // ----- computed プロパティのUI連携 -----
  describe('computed プロパティの表示', () => {
    it('カウントが2のとき、2倍の値が4と表示される', async () => {
      const wrapper = mount(Counter)
      await wrapper.find('#increment').trigger('click')
      await wrapper.find('#increment').trigger('click')
      expect(wrapper.find('[data-testid="double-count"]').text()).toContain('4')
    })

    it('カウントが正のとき「正の数です」と表示される', async () => {
      const wrapper = mount(Counter)
      await wrapper.find('#increment').trigger('click')
      expect(wrapper.find('[data-testid="is-positive"]').text()).toBe('正の数です')
    })
  })

  // ----- 複合操作 -----
  describe('複合操作', () => {
    it('増やして減らしてリセットの一連操作', async () => {
      const wrapper = mount(Counter)

      // +3
      for (let i = 0; i < 3; i++) {
        await wrapper.find('#increment').trigger('click')
      }
      expect(wrapper.find('[data-testid="count"]').text()).toBe('3')

      // -1 → 2
      await wrapper.find('#decrement').trigger('click')
      expect(wrapper.find('[data-testid="count"]').text()).toBe('2')

      // リセット → 0
      await wrapper.find('#reset').trigger('click')
      expect(wrapper.find('[data-testid="count"]').text()).toBe('0')
    })
  })
})
