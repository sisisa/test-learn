/**
 * formatter.spec.ts — フォーマッター関数の単体テスト
 *
 * テスト設計:
 * - 日付フォーマット: 各月・日のゼロ埋め、null入力
 * - 相対日付: 今日・明日・7日以内・超過・null
 * - テキスト省略: 境界値（ちょうど・超過・短い）
 * - ラベル変換: 全パターン網羅
 */

import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatRelativeDate,
  truncateText,
  getPriorityLabel,
  getStatusLabel,
} from '@/utils/formatter'

// ============================================================
// formatDate
// ============================================================
describe('formatDate', () => {
  it('"YYYY/MM/DD" 形式にフォーマットする', () => {
    expect(formatDate(new Date('2026-01-05'))).toBe('2026/01/05')
  })

  it('月と日をゼロ埋めする', () => {
    expect(formatDate(new Date('2026-03-11'))).toBe('2026/03/11')
  })

  it('nullの場合 "—" を返す', () => {
    expect(formatDate(null)).toBe('—')
  })
})

// ============================================================
// formatRelativeDate
// ============================================================
describe('formatRelativeDate', () => {
  const now = new Date('2026-03-11T10:00:00')

  it('nullの場合 "期限なし" を返す', () => {
    expect(formatRelativeDate(null, now)).toBe('期限なし')
  })

  it('今日の場合 "今日まで" を返す', () => {
    expect(formatRelativeDate(new Date('2026-03-11'), now)).toBe('今日まで')
  })

  it('明日の場合 "明日まで" を返す', () => {
    expect(formatRelativeDate(new Date('2026-03-12'), now)).toBe('明日まで')
  })

  it('3日後の場合 "あと3日" を返す', () => {
    expect(formatRelativeDate(new Date('2026-03-14'), now)).toBe('あと3日')
  })

  it('7日後も "あとN日" で表示する', () => {
    expect(formatRelativeDate(new Date('2026-03-18'), now)).toBe('あと7日')
  })

  it('8日以上先は日付を表示する', () => {
    expect(formatRelativeDate(new Date('2026-03-20'), now)).toBe('2026/03/20')
  })

  it('1日超過の場合 "1日超過" を返す', () => {
    expect(formatRelativeDate(new Date('2026-03-10'), now)).toBe('1日超過')
  })

  it('複数日超過の場合 "N日超過" を返す', () => {
    expect(formatRelativeDate(new Date('2026-03-05'), now)).toBe('6日超過')
  })
})

// ============================================================
// truncateText
// ============================================================
describe('truncateText', () => {
  it('最大文字数以内ならそのまま返す', () => {
    expect(truncateText('短いテキスト', 20)).toBe('短いテキスト')
  })

  it('最大文字数ちょうどならそのまま返す', () => {
    expect(truncateText('abc', 3)).toBe('abc')
  })

  it('最大文字数を超えたら省略する', () => {
    expect(truncateText('abcdef', 3)).toBe('abc...')
  })

  it('空文字をそのまま返す', () => {
    expect(truncateText('', 10)).toBe('')
  })

  it('負の maxLength でエラーを投げる', () => {
    expect(() => truncateText('test', -1)).toThrowError('maxLengthは0以上')
  })
})

// ============================================================
// getPriorityLabel / getStatusLabel
// ============================================================
describe('getPriorityLabel', () => {
  it.each([
    ['low', '低'],
    ['medium', '中'],
    ['high', '高'],
  ] as const)('%s → "%s"', (priority, expected) => {
    expect(getPriorityLabel(priority)).toBe(expected)
  })
})

describe('getStatusLabel', () => {
  it.each([
    ['todo', '未着手'],
    ['in-progress', '進行中'],
    ['done', '完了'],
  ] as const)('%s → "%s"', (status, expected) => {
    expect(getStatusLabel(status)).toBe(expected)
  })
})
