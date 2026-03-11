/**
 * validator.spec.ts — バリデーション関数の単体テスト
 *
 * テスト設計:
 * - 正常系 / 異常系 / 境界値を網羅
 * - 複合バリデーション（複数エラー同時検出）
 * - 日付テストでは now を注入して再現性を確保
 */

import { describe, it, expect } from 'vitest'
import {
  validateTitle,
  validateDescription,
  validateDueDate,
  validateTaskForm,
  hasNoErrors,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from '@/utils/validator'

// ============================================================
// validateTitle
// ============================================================
describe('validateTitle', () => {
  // 正常系
  it('有効なタイトルでundefinedを返す', () => {
    expect(validateTitle('買い物リスト')).toBeUndefined()
  })

  it('最大文字数ちょうどで有効', () => {
    const title = 'a'.repeat(TITLE_MAX_LENGTH)
    expect(validateTitle(title)).toBeUndefined()
  })

  // 異常系
  it('空文字でエラーを返す', () => {
    expect(validateTitle('')).toBe('タイトルは必須です')
  })

  it('空白のみでエラーを返す', () => {
    expect(validateTitle('   ')).toBe('タイトルは必須です')
  })

  // 境界値
  it('最大文字数+1でエラーを返す', () => {
    const title = 'a'.repeat(TITLE_MAX_LENGTH + 1)
    expect(validateTitle(title)).toContain(`${TITLE_MAX_LENGTH}文字以内`)
  })

  it('1文字で有効', () => {
    expect(validateTitle('a')).toBeUndefined()
  })
})

// ============================================================
// validateDescription
// ============================================================
describe('validateDescription', () => {
  it('空の説明は有効（任意項目）', () => {
    expect(validateDescription('')).toBeUndefined()
  })

  it('最大文字数以内で有効', () => {
    const desc = 'a'.repeat(DESCRIPTION_MAX_LENGTH)
    expect(validateDescription(desc)).toBeUndefined()
  })

  it('最大文字数超過でエラーを返す', () => {
    const desc = 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1)
    expect(validateDescription(desc)).toContain(`${DESCRIPTION_MAX_LENGTH}文字以内`)
  })
})

// ============================================================
// validateDueDate
// ============================================================
describe('validateDueDate', () => {
  // 基準日を固定してテストの再現性を確保
  const now = new Date('2026-03-11T10:00:00')

  it('空文字は有効（任意項目）', () => {
    expect(validateDueDate('', now)).toBeUndefined()
  })

  it('今日の日付は有効', () => {
    expect(validateDueDate('2026-03-11', now)).toBeUndefined()
  })

  it('未来の日付は有効', () => {
    expect(validateDueDate('2026-12-31', now)).toBeUndefined()
  })

  it('過去の日付でエラーを返す', () => {
    expect(validateDueDate('2026-03-10', now)).toBe('過去の日付は指定できません')
  })

  it('不正な日付文字列でエラーを返す', () => {
    expect(validateDueDate('invalid-date', now)).toBe('有効な日付を入力してください')
  })
})

// ============================================================
// validateTaskForm（複合バリデーション）
// ============================================================
describe('validateTaskForm', () => {
  it('有効な入力で空のエラーオブジェクトを返す', () => {
    const errors = validateTaskForm({
      title: 'テストタスク',
      description: '詳細説明',
      priority: 'medium',
      dueDate: '',
    })
    expect(errors).toEqual({})
  })

  it('複数のエラーを同時に検出する', () => {
    const errors = validateTaskForm({
      title: '',
      description: 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1),
      priority: 'high',
      dueDate: 'invalid',
    })
    expect(errors.title).toBeDefined()
    expect(errors.description).toBeDefined()
    expect(errors.dueDate).toBeDefined()
  })

  it('タイトルのみエラーの場合、他のフィールドにはエラーがない', () => {
    const errors = validateTaskForm({
      title: '',
      description: '有効な説明',
      priority: 'low',
      dueDate: '',
    })
    expect(errors.title).toBeDefined()
    expect(errors.description).toBeUndefined()
    expect(errors.dueDate).toBeUndefined()
  })
})

// ============================================================
// hasNoErrors
// ============================================================
describe('hasNoErrors', () => {
  it('空オブジェクトでtrueを返す', () => {
    expect(hasNoErrors({})).toBe(true)
  })

  it('エラーが1つでもあればfalseを返す', () => {
    expect(hasNoErrors({ title: 'エラー' })).toBe(false)
  })
})
