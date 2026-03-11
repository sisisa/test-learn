<script setup lang="ts">
/**
 * TaskForm.vue — タスク追加フォーム
 *
 * 結合テストポイント:
 * - 入力 → リアルタイムバリデーション表示
 * - 送信時のバリデーション → 成功時にemit('submit')
 * - フォームリセット
 */
import type { TaskFormInput } from '@/types/task'
import { useFormValidation } from '@/composables/useFormValidation'

const emit = defineEmits<{
  submit: [data: TaskFormInput]
}>()

const {
  formData,
  errors,
  isValid,
  touchField,
  validate,
  resetForm,
} = useFormValidation()

function onSubmit() {
  if (!validate()) return

  emit('submit', { ...formData })
  resetForm()
}
</script>

<template>
  <form class="task-form" data-testid="task-form" @submit.prevent="onSubmit">
    <h2 class="task-form__heading">タスクを追加</h2>

    <div class="task-form__field">
      <label for="title" class="task-form__label">タイトル *</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="task-form__input"
        :class="{ 'task-form__input--error': errors.title }"
        data-testid="input-title"
        placeholder="タスクのタイトル"
        @blur="touchField('title')"
      />
      <span
        v-if="errors.title"
        class="task-form__error"
        data-testid="error-title"
      >
        {{ errors.title }}
      </span>
    </div>

    <div class="task-form__field">
      <label for="description" class="task-form__label">説明</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="task-form__textarea"
        :class="{ 'task-form__textarea--error': errors.description }"
        data-testid="input-description"
        placeholder="タスクの詳細説明（任意）"
        rows="3"
        @blur="touchField('description')"
      />
      <span
        v-if="errors.description"
        class="task-form__error"
        data-testid="error-description"
      >
        {{ errors.description }}
      </span>
    </div>

    <div class="task-form__row">
      <div class="task-form__field">
        <label for="priority" class="task-form__label">優先度</label>
        <select
          id="priority"
          v-model="formData.priority"
          class="task-form__select"
          data-testid="input-priority"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>

      <div class="task-form__field">
        <label for="dueDate" class="task-form__label">期限日</label>
        <input
          id="dueDate"
          v-model="formData.dueDate"
          type="date"
          class="task-form__input"
          :class="{ 'task-form__input--error': errors.dueDate }"
          data-testid="input-dueDate"
          @blur="touchField('dueDate')"
        />
        <span
          v-if="errors.dueDate"
          class="task-form__error"
          data-testid="error-dueDate"
        >
          {{ errors.dueDate }}
        </span>
      </div>
    </div>

    <button
      type="submit"
      class="task-form__submit"
      data-testid="submit-btn"
      :disabled="!isValid"
    >
      追加する
    </button>
  </form>
</template>

<style scoped>
.task-form {
  padding: 1.75rem;
  border-radius: 12px;
  background: #1e1e2e;
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 2rem;
}

.task-form__heading {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.25rem;
  color: #cdd6f4;
}

.task-form__field {
  margin-bottom: 1rem;
  flex: 1;
}

.task-form__label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #a6adc8;
  margin-bottom: 0.35rem;
}

.task-form__input,
.task-form__textarea,
.task-form__select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #45475a;
  background: #313244;
  color: #cdd6f4;
  font-size: 0.9rem;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.task-form__input:focus,
.task-form__textarea:focus,
.task-form__select:focus {
  outline: none;
  border-color: #89b4fa;
}

.task-form__input--error,
.task-form__textarea--error {
  border-color: #f38ba8 !important;
}

.task-form__error {
  display: block;
  font-size: 0.75rem;
  color: #f38ba8;
  margin-top: 0.3rem;
}

.task-form__textarea {
  resize: vertical;
  min-height: 60px;
}

.task-form__row {
  display: flex;
  gap: 1rem;
}

.task-form__submit {
  width: 100%;
  padding: 0.7rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #89b4fa, #74c7ec);
  color: #1e1e2e;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.task-form__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  opacity: 0.9;
}

.task-form__submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
