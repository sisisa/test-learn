---
name: test-learning
description: Vue.js + TypeScript + Vitest を使ったテスト学習スキル。テスト仕様書・テストケースの作成方法と、単体テスト・結合テストの実装方法をガイドする。
---

# テスト学習スキル

実務的なテスト設計パターンを、タスク管理アプリを題材に学ぶためのガイドです。

---

## 1. テスト仕様書（Test Specification）

**何を・なぜ・どのようにテストするか** を定義するドキュメント。

[テンプレート → templates/test-specification.md](templates/test-specification.md)  
[記入例 → docs/test-specification.md](../../docs/test-specification.md)

---

## 2. テストケース（Test Case）

テスト仕様書の各項目を **具体的な手順と期待結果** に落とし込んだもの。

[テンプレート → templates/test-case.md](templates/test-case.md)  
[記入例 → docs/test-cases.md](../../docs/test-cases.md)

### 設計技法
| 技法 | 説明 | 使用例 |
|------|------|--------|
| 同値分割 | 入力を有効/無効クラスに分けて代表値をテスト | `validator.spec.ts` |
| 境界値分析 | クラスの境界付近の値をテスト | `validator.spec.ts`, `formatter.spec.ts` |
| パラメタライズドテスト | `it.each` で複数入力パターンを効率的にテスト | `formatter.spec.ts` |
| エラー推測 | バグが出やすい箇所を経験的にテスト | `taskApi.spec.ts` |

---

## 3. 単体テスト（Unit Test）

外部依存なしで **純粋なロジック** をテストする。

### 3.1 純粋関数のテスト

```typescript
// validator.spec.ts より
describe('validateTitle', () => {
  it('空文字でエラーを返す', () => {
    expect(validateTitle('')).toBe('タイトルは必須です')
  })
})
```

### 3.2 非同期テスト + モック

`vi.fn()` で外部依存（localStorage）をモック化し、`async/await` で非同期処理をテスト。

```typescript
// taskApi.spec.ts より
const localStorageMock = {
  getItem: vi.fn((key) => mockStorage[key] ?? null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value }),
}

it('タスクを作成してIDが付与される', async () => {
  const result = await createTask({ title: '新タスク', ... })
  expect(result.id).toBeDefined()
  expect(result.status).toBe('todo')
})
```

### 3.3 依存注入によるComposableテスト

API層をコンストラクタ引数で注入可能にし、テスト時にモックを差し替える。

```typescript
// useTaskManager.spec.ts より
const mockApi = {
  fetchTasks: vi.fn().mockResolvedValue(mockTasks),
  createTask: vi.fn().mockResolvedValue(newTask),
  ...
}
const { tasks, loadTasks } = useTaskManager(mockApi)
await loadTasks()
expect(tasks.value).toHaveLength(2)
```

---

## 4. 結合テスト（Integration Test）

**複数モジュールが連携して正しく動作するか** をテストする。

### 4.1 フォーム入力 → バリデーション → emit

```typescript
// TaskForm.spec.ts より
it('有効なフォームを送信するとsubmitイベントが発火する', async () => {
  const wrapper = mount(TaskForm)
  await wrapper.find('[data-testid="input-title"]').setValue('テスト')
  await wrapper.find('[data-testid="task-form"]').trigger('submit')
  expect(wrapper.emitted('submit')).toBeTruthy()
})
```

### 4.2 フィルターUI操作 → 表示変化

```typescript
// TaskList.spec.ts より
it('"未着手" で絞り込める', async () => {
  const wrapper = mount(TaskList, { props: { tasks } })
  await wrapper.find('[data-testid="status-filter"]').setValue('todo')
  expect(wrapper.find('[data-testid="task-count"]').text()).toContain('1')
})
```

---

## 5. テスト実行コマンド

```bash
yarn test                              # 全テスト実行
yarn test:watch                        # ウォッチモード
yarn test:coverage                     # カバレッジ付き
yarn test tests/unit/validator.spec.ts # 特定ファイル
```

---

## 6. 学習の進め方

1. `docs/test-specification.md` → テスト仕様書の書き方を理解
2. `docs/test-cases.md` → テストケース設計を理解
3. `tests/unit/validator.spec.ts` → 純粋関数の単体テスト
4. `tests/unit/taskApi.spec.ts` → モック・非同期テスト
5. `tests/unit/useTaskManager.spec.ts` → 依存注入テスト
6. `tests/integration/TaskForm.spec.ts` → フォーム結合テスト
7. 自分で新機能を追加し、テストを書いてみる
