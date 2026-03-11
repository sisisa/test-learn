/**
 * useFormValidation.ts — フォームバリデーション Composable
 *
 * テストポイント:
 * - リアクティブなバリデーション（入力変更 → エラー即座更新）
 * - isValid computed の連動
 * - resetForm によるクリア動作
 */

import { reactive, computed, watch } from 'vue'
import type { TaskFormInput, ValidationErrors } from '@/types/task'
import { validateTaskForm, hasNoErrors } from '@/utils/validator'

/** フォームの初期値 */
function createInitialForm(): TaskFormInput {
  return {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  }
}

export function useFormValidation() {
  const formData = reactive<TaskFormInput>(createInitialForm())
  const errors = reactive<ValidationErrors>({})
  const isDirty = reactive<Record<string, boolean>>({
    title: false,
    description: false,
    dueDate: false,
  })

  /** バリデーション済みかどうか */
  const hasBeenValidated = computed(() =>
    Object.values(isDirty).some((v) => v)
  )

  /** フォームが有効かどうか */
  const isValid = computed(() => {
    if (!hasBeenValidated.value) return false

    const currentErrors = validateTaskForm(formData)
    return hasNoErrors(currentErrors)
  })

  /** フィールドに触れたことをマークする */
  function touchField(field: keyof typeof isDirty) {
    isDirty[field] = true
  }

  /** 全フィールドをバリデーションする */
  function validate(): boolean {
    // 全フィールドをdirtyにする
    isDirty.title = true
    isDirty.description = true
    isDirty.dueDate = true

    const result = validateTaskForm(formData)

    // errorsをリアクティブに更新
    errors.title = result.title
    errors.description = result.description
    errors.dueDate = result.dueDate

    return hasNoErrors(result)
  }

  /** フォームをリセットする */
  function resetForm() {
    Object.assign(formData, createInitialForm())

    errors.title = undefined
    errors.description = undefined
    errors.dueDate = undefined

    isDirty.title = false
    isDirty.description = false
    isDirty.dueDate = false
  }

  // リアルタイムバリデーション（dirtyなフィールドのみ）
  watch(
    () => formData.title,
    () => {
      if (isDirty.title) {
        const result = validateTaskForm(formData)
        errors.title = result.title
      }
    }
  )

  watch(
    () => formData.description,
    () => {
      if (isDirty.description) {
        const result = validateTaskForm(formData)
        errors.description = result.description
      }
    }
  )

  watch(
    () => formData.dueDate,
    () => {
      if (isDirty.dueDate) {
        const result = validateTaskForm(formData)
        errors.dueDate = result.dueDate
      }
    }
  )

  return {
    formData,
    errors,
    isDirty,
    isValid,
    hasBeenValidated,
    touchField,
    validate,
    resetForm,
  }
}
