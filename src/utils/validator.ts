/**
 * validator.ts — フォーム入力のバリデーション関数群
 *
 * テストポイント:
 * - 正常系 / 異常系 / 境界値
 * - 複合バリデーション（複数フィールドのエラー同時検出）
 */

import type { TaskFormInput, ValidationErrors } from '@/types/task'

/** タイトルの最大文字数 */
export const TITLE_MAX_LENGTH = 50

/** 説明の最大文字数 */
export const DESCRIPTION_MAX_LENGTH = 200

/**
 * タイトルを検証する
 * @returns エラーメッセージ。問題なければ undefined
 */
export function validateTitle(title: string): string | undefined {
  const trimmed = title.trim()

  if (trimmed.length === 0) {
    return 'タイトルは必須です'
  }

  if (trimmed.length > TITLE_MAX_LENGTH) {
    return `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください`
  }

  return undefined
}

/**
 * 説明文を検証する
 * @returns エラーメッセージ。問題なければ undefined
 */
export function validateDescription(description: string): string | undefined {
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `説明は${DESCRIPTION_MAX_LENGTH}文字以内で入力してください`
  }

  return undefined
}

/**
 * 期限日を検証する
 * @param dateString - "YYYY-MM-DD" 形式の日付文字列
 * @param now - 現在日時（テスト時に注入用）
 * @returns エラーメッセージ。問題なければ undefined
 */
export function validateDueDate(
  dateString: string,
  now: Date = new Date()
): string | undefined {
  if (dateString === '') {
    return undefined // 任意項目
  }

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return '有効な日付を入力してください'
  }

  // 日付のみ比較（時間を無視）
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (dueDay < today) {
    return '過去の日付は指定できません'
  }

  return undefined
}

/**
 * フォーム全体をバリデーションする
 * @returns エラーオブジェクト。エラーがなければ空オブジェクト
 */
export function validateTaskForm(input: TaskFormInput): ValidationErrors {
  const errors: ValidationErrors = {}

  const titleError = validateTitle(input.title)
  if (titleError) errors.title = titleError

  const descError = validateDescription(input.description)
  if (descError) errors.description = descError

  const dateError = validateDueDate(input.dueDate)
  if (dateError) errors.dueDate = dateError

  return errors
}

/**
 * エラーオブジェクトにエラーがないか判定する
 */
export function hasNoErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0
}
