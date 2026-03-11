/**
 * formatter.ts — 日付・テキストのフォーマッター関数群
 *
 * テストポイント:
 * - 様々な日付パターン（今日・未来・過去・null）
 * - テキスト省略の境界値
 * - 優先度ラベルの網羅
 */

import type { Priority, Status } from '@/types/task'

/**
 * Date を "YYYY/MM/DD" 形式にフォーマットする
 */
export function formatDate(date: Date | null): string {
  if (!date) return '—'

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  return `${y}/${m}/${d}`
}

/**
 * 期限日を相対表現にフォーマットする
 * @param dueDate - 期限日
 * @param now - 現在日時（テスト時に注入用）
 */
export function formatRelativeDate(
  dueDate: Date | null,
  now: Date = new Date()
): string {
  if (!dueDate) return '期限なし'

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())

  const diffMs = due.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `${Math.abs(diffDays)}日超過`
  if (diffDays === 0) return '今日まで'
  if (diffDays === 1) return '明日まで'
  if (diffDays <= 7) return `あと${diffDays}日`

  return formatDate(dueDate)
}

/**
 * テキストを指定文字数で省略する
 */
export function truncateText(text: string, maxLength: number): string {
  if (maxLength < 0) {
    throw new Error('maxLengthは0以上である必要があります')
  }

  if (text.length <= maxLength) return text

  return text.slice(0, maxLength) + '...'
}

/**
 * 優先度の日本語ラベルを返す
 */
export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    low: '低',
    medium: '中',
    high: '高',
  }

  return labels[priority]
}

/**
 * ステータスの日本語ラベルを返す
 */
export function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    'todo': '未着手',
    'in-progress': '進行中',
    'done': '完了',
  }

  return labels[status]
}
