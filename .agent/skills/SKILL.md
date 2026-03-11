---
name: test-learning
description: Vue.js + TypeScript + Vitest を使ったテスト学習スキル。テスト仕様書・テストケースの作成方法と、単体テスト・結合テストの実装方法をガイドする。
---

# テスト学習スキル

このスキルは、ソフトウェアテストの基本概念を **実践的に** 学ぶためのガイドです。

---

## 1. テスト仕様書（Test Specification）

テスト仕様書は、**何を・なぜ・どのようにテストするか** を定義するドキュメントです。

### 目的
- テスト対象の機能と範囲を明確にする
- テスト手法（ブラックボックス / ホワイトボックス）を決定する
- 合格基準を事前に定義する

### テンプレート
[templates/test-specification.md](templates/test-specification.md) を参照してください。

### 書き方のポイント
1. **対象範囲を明確に** — テスト対象の関数・モジュール・画面を具体的に列挙する
2. **テスト手法を記載** — 単体テスト / 結合テスト / E2E テスト など
3. **合格基準を定量的に** — 「全テストケースがパスすること」「カバレッジ 80% 以上」など

---

## 2. テストケース（Test Case）

テストケースは、テスト仕様書の各項目を **具体的な手順と期待結果** に落とし込んだものです。

### テンプレート
[templates/test-case.md](templates/test-case.md) を参照してください。

### 設計技法
| 技法 | 説明 | 例 |
|------|------|-----|
| **同値分割** | 入力を有効/無効のクラスに分けて代表値をテスト | 正の整数 / 0 / 負の整数 |
| **境界値分析** | クラスの境界付近の値をテスト | 0, 1, -1, MAX, MIN |
| **エラー推測** | 経験に基づいてバグが出やすい箇所をテスト | null, undefined, 空文字 |

---

## 3. Vitest によるテスト実装

### 単体テスト（Unit Test）

純粋関数や Composable を **外部依存なし** でテストします。

```typescript
// 例: calculator.ts の add 関数をテスト
import { describe, it, expect } from 'vitest'
import { add } from '@/utils/calculator'

describe('add', () => {
  it('2つの正の数を足せる', () => {
    expect(add(1, 2)).toBe(3)
  })

  it('負の数を扱える', () => {
    expect(add(-1, -2)).toBe(-3)
  })
})
```

**ポイント:**
- `describe` でテスト対象をグループ化
- `it` で個別のテストケースを記述（日本語OK）
- `expect(...).toBe(...)` で期待値を検証

### 結合テスト（Integration Test）

複数モジュールが **連携して正しく動作するか** をテストします。Vue コンポーネントのテストでは `@vue/test-utils` を使います。

```typescript
// 例: Counter.vue の結合テスト
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('ボタンクリックでカウントが増える', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button#increment').trigger('click')
    expect(wrapper.find('[data-testid="count"]').text()).toBe('1')
  })
})
```

**ポイント:**
- `mount` でコンポーネントを実際にレンダリング
- `trigger('click')` でユーザー操作をシミュレーション
- DOM の状態を検証して、UI と ロジックの連携を確認

---

## 4. テスト実行コマンド

```bash
# 全テスト実行
yarn test

# ウォッチモード（ファイル変更時に自動再実行）
yarn test:watch

# カバレッジレポート付き実行
yarn test:coverage

# 特定ファイルのみ実行
yarn test tests/unit/calculator.spec.ts
```

---

## 5. 学習の進め方

1. `docs/test-specification.md` を読んで、テスト仕様書の書き方を理解する
2. `docs/test-cases.md` を読んで、テストケースの設計方法を理解する
3. `tests/unit/calculator.spec.ts` を読み、`yarn test` で実行して単体テストを体験する
4. `tests/unit/useCounter.spec.ts` で Composable のテストを体験する
5. `tests/integration/Counter.spec.ts` で結合テストを体験する
6. 自分で新しい関数やコンポーネントを追加し、テストを書いてみる
