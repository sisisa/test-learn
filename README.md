# テスト学習プロジェクト

Vue.js (Composition API) + TypeScript + Vitest を使って、ソフトウェアテストの基本を実践的に学ぶためのプロジェクトです。

## 学習できること

1. **テスト仕様書** の書き方 → `docs/test-specification.md`
2. **テストケース** の設計方法 → `docs/test-cases.md`
3. **単体テスト** の実装 → `tests/unit/`
4. **結合テスト** の実装 → `tests/integration/`

## セットアップ

```bash
# 依存関係のインストール
yarn install

# 開発サーバー起動
yarn dev
```

## テスト実行

```bash
# 全テスト実行
yarn test

# ウォッチモード（ファイル変更時に自動再実行）
yarn test:watch

# カバレッジレポート付き
yarn test:coverage
```

## プロジェクト構成

```
src/
├── components/
│   └── Counter.vue          # 結合テスト対象のUIコンポーネント
├── composables/
│   └── useCounter.ts        # Composition API のロジック（単体テスト対象）
├── utils/
│   └── calculator.ts        # 純粋関数（単体テスト対象）
├── App.vue
└── main.ts

tests/
├── unit/
│   ├── calculator.spec.ts   # calculator.ts の単体テスト
│   └── useCounter.spec.ts   # useCounter.ts の単体テスト
└── integration/
    └── Counter.spec.ts      # Counter.vue の結合テスト

docs/
├── test-specification.md    # テスト仕様書のサンプル
└── test-cases.md            # テストケース一覧のサンプル
```

## 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Vue.js | 3.x | UIフレームワーク |
| TypeScript | 5.x | 型安全なコード |
| Vite | 6.x | ビルドツール |
| Vitest | 3.x | テストフレームワーク |
| @vue/test-utils | 2.x | Vueコンポーネントテスト |
| happy-dom | 17.x | テスト用DOM環境 |
