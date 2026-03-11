/**
 * useFormValidation.spec.ts — フォームバリデーションComposableの単体テスト
 *
 * テスト設計:
 * - formData のリアクティブ更新 → errors 連動
 * - isValid computed の状態遷移
 * - resetForm による全状態クリア
 * - touchField によるdirty管理
 */

import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

describe('useFormValidation', () => {
  // ----- 初期状態 -----
  describe('初期状態', () => {
    it('formDataの初期値が正しい', () => {
      const { formData } = useFormValidation()

      expect(formData.title).toBe('')
      expect(formData.description).toBe('')
      expect(formData.priority).toBe('medium')
      expect(formData.dueDate).toBe('')
    })

    it('エラーが空の状態で開始する', () => {
      const { errors } = useFormValidation()

      expect(errors.title).toBeUndefined()
      expect(errors.description).toBeUndefined()
      expect(errors.dueDate).toBeUndefined()
    })

    it('バリデーション前はisValidがfalse', () => {
      const { isValid } = useFormValidation()
      expect(isValid.value).toBe(false)
    })
  })

  // ----- validate -----
  describe('validate', () => {
    it('有効な入力でtrueを返す', () => {
      const { formData, validate } = useFormValidation()

      formData.title = '有効なタスク'
      formData.description = '説明文'

      expect(validate()).toBe(true)
    })

    it('無効な入力でfalseを返しエラーを設定する', () => {
      const { errors, validate } = useFormValidation()

      const result = validate()

      expect(result).toBe(false)
      expect(errors.title).toBeDefined()
    })

    it('validate後にisValidが正しく更新される', () => {
      const { formData, isValid, validate } = useFormValidation()

      formData.title = '有効なタスク'
      validate()

      expect(isValid.value).toBe(true)
    })
  })

  // ----- リアルタイムバリデーション -----
  describe('リアルタイムバリデーション', () => {
    it('dirtyなフィールドのみバリデーションが実行される', async () => {
      const { formData, errors, touchField } = useFormValidation()

      // touchせずに値を変えてもエラーは出ない
      formData.title = ''
      await nextTick()
      expect(errors.title).toBeUndefined()

      // touchしてから値を変えるとエラーが出る
      touchField('title')
      formData.title = '' // 空文字をセット（トリガーのため再代入）
      formData.title = '  ' // 空白文字
      await nextTick()
      expect(errors.title).toBeDefined()
    })
  })

  // ----- resetForm -----
  describe('resetForm', () => {
    it('全ての状態を初期値に戻す', () => {
      const { formData, errors, isDirty, validate, resetForm } = useFormValidation()

      // 状態を変更
      formData.title = 'テスト'
      formData.description = '説明'
      formData.priority = 'high'
      validate()

      // リセット
      resetForm()

      expect(formData.title).toBe('')
      expect(formData.description).toBe('')
      expect(formData.priority).toBe('medium')
      expect(errors.title).toBeUndefined()
      expect(isDirty.title).toBe(false)
    })
  })

  // ----- touchField -----
  describe('touchField', () => {
    it('指定したフィールドをdirtyにする', () => {
      const { isDirty, touchField } = useFormValidation()

      expect(isDirty.title).toBe(false)

      touchField('title')

      expect(isDirty.title).toBe(true)
      expect(isDirty.description).toBe(false)
    })
  })
})
