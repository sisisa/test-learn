# テスト仕様書 — Task Manager

## 1. 概要

| 項目 | 内容 |
|------|------|
| ドキュメントID | TS-001 |
| 対象アプリ | Task Manager（タスク管理アプリ） |
| 作成日 | 2026-03-11 |

## 2. テスト目的

タスク管理アプリの各レイヤー（Utils / Services / Composables / Components）が仕様通りに動作することを検証する。

## 3. テスト対象範囲

### 単体テスト（6ファイル）

| モジュール | テスト観点 |
|-----------|----------|
| `validator.ts` | フォーム入力の検証ロジック（必須チェック、文字数制限、日付検証、複合バリデーション） |
| `formatter.ts` | 日付フォーマット、相対日付表現、テキスト省略、ラベル変換 |
| `taskFilter.ts` | ステータス/優先度フィルター、テキスト検索、ソート、複合フィルター |
| `taskApi.ts` | API模擬層の非同期CRUD操作、エラーハンドリング |
| `useTaskManager.ts` | タスク状態管理、API依存のモック注入、computed連動 |
| `useFormValidation.ts` | リアルタイムバリデーション、dirty管理、リセット |

### 結合テスト（3ファイル）

| コンポーネント | テスト観点 |
|--------------|----------|
| `TaskForm.vue` | フォーム入力 → バリデーション表示 → submit emit → リセット |
| `TaskList.vue` | フィルター選択 → 表示変化、検索絞り込み、空状態 |
| `TaskItem.vue` | ステータス変更emit、削除emit、表示内容の正確性 |

## 4. テスト手法

| 手法 | 適用 |
|------|------|
| 同値分割・境界値分析 | validator, formatter |
| パラメタライズドテスト | formatter の `it.each` |
| モック（`vi.fn()`） | taskApi, useTaskManager |
| 依存注入 | useTaskManager のAPI差替え |
| DOM操作シミュレーション | mount + trigger + emit検証 |

## 5. テスト環境

| 項目 | 内容 |
|------|------|
| テストフレームワーク | Vitest |
| DOM環境 | happy-dom |
| コンポーネントテスト | @vue/test-utils |

## 6. 合格基準

- [x] 全113テストケースがパスすること
- [x] 各レイヤーの正常系・異常系・境界値がカバーされていること
- [x] モック・非同期テストが正しく動作すること
