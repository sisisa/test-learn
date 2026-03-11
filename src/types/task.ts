/**
 * タスク管理アプリの型定義
 */

/** タスクの優先度 */
export type Priority = 'low' | 'medium' | 'high'

/** タスクのステータス */
export type Status = 'todo' | 'in-progress' | 'done'

/** タスクのデータ構造 */
export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  createdAt: Date
  dueDate: Date | null
}

/** フォーム入力の型 */
export interface TaskFormInput {
  title: string
  description: string
  priority: Priority
  dueDate: string // input[type="date"] は文字列
}

/** バリデーションエラーの型 */
export interface ValidationErrors {
  title?: string
  description?: string
  dueDate?: string
}

/** フィルター条件の型 */
export interface TaskFilterOptions {
  status?: Status | 'all'
  priority?: Priority | 'all'
  searchQuery?: string
}

/** ソートキーの型 */
export type SortKey = 'createdAt' | 'dueDate' | 'priority'

/** ソート順の型 */
export type SortOrder = 'asc' | 'desc'
