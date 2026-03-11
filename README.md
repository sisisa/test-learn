# テスト学習プロジェクト — Task Manager

Vue.js (Composition API) + TypeScript + Vitest で構築したタスク管理アプリです。  
実務的なテスト設計パターンを実践的に学べるよう設計されています。

## 学べるテスト技術

| テスト技術 | 対象ファイル | 学習ポイント |
|-----------|-------------|-------------|
| 純粋関数の単体テスト | `validator`, `formatter`, `taskFilter` | 正常系/異常系/境界値、パラメタライズドテスト |
| 非同期テスト + モック | `taskApi` | `vi.fn()`、`async/await`、localStorage モック |
| Composable テスト | `useTaskManager`, `useFormValidation` | 依存注入、リアクティブ検証、computed連動 |
| コンポーネント結合テスト | `TaskForm`, `TaskList`, `TaskItem` | mount、ユーザー操作シミュレーション、emit検証 |

## セットアップ

```bash
yarn install
yarn dev      # 開発サーバー起動
```

## テスト実行

```bash
yarn test             # 全テスト実行（113件）
yarn test:watch       # ウォッチモード
yarn test:coverage    # カバレッジレポート付き
```

## プロジェクト構成

```
src/
├── types/task.ts                  # 型定義
├── utils/
│   ├── validator.ts               # バリデーション（単体テスト対象）
│   ├── formatter.ts               # フォーマッター（単体テスト対象）
│   └── taskFilter.ts              # フィルター/ソート（単体テスト対象）
├── services/taskApi.ts            # API模擬層（モックテスト対象）
├── composables/
│   ├── useTaskManager.ts          # タスクCRUD（依存注入テスト対象）
│   └── useFormValidation.ts       # フォーム制御（リアクティブテスト対象）
└── components/
    ├── TaskForm.vue               # 追加フォーム（結合テスト対象）
    ├── TaskList.vue               # 一覧+フィルター（結合テスト対象）
    ├── TaskItem.vue               # 個別タスク（結合テスト対象）
    └── TaskStats.vue              # 統計カード

tests/
├── unit/          # 単体テスト（6ファイル）
└── integration/   # 結合テスト（3ファイル）

docs/
├── test-specification.md   # テスト仕様書
└── test-cases.md           # テストケース一覧
```

## 技術スタック

| 技術 | 用途 |
|------|------|
| Vue.js 3 (Composition API) | UIフレームワーク |
| TypeScript | 型安全 |
| Vite | ビルドツール |
| Vitest | テストフレームワーク |
| @vue/test-utils | コンポーネントテスト |
| happy-dom | テスト用DOM環境 |
