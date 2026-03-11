/**
 * useCounter.spec.ts — useCounter composable の単体テスト
 *
 * Composition API の ref / computed がリアクティブに動作することを検証します。
 * コンポーネントに依存せず、composable 単体でテストできるのがポイントです。
 */

import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  // ----- 初期化 -----
  describe('初期化', () => {
    it('デフォルトの初期値は0', () => {
      const { count } = useCounter()
      expect(count.value).toBe(0)
    })

    it('指定した初期値で開始できる', () => {
      const { count } = useCounter(10)
      expect(count.value).toBe(10)
    })
  })

  // ----- increment -----
  describe('increment', () => {
    it('カウントが1増える', () => {
      const { count, increment } = useCounter()
      increment()
      expect(count.value).toBe(1)
    })

    it('複数回呼ぶとその分増える', () => {
      const { count, increment } = useCounter()
      increment()
      increment()
      increment()
      expect(count.value).toBe(3)
    })
  })

  // ----- decrement -----
  describe('decrement', () => {
    it('カウントが1減る', () => {
      const { count, decrement } = useCounter(5)
      decrement()
      expect(count.value).toBe(4)
    })

    it('0以下にもなれる', () => {
      const { count, decrement } = useCounter(0)
      decrement()
      expect(count.value).toBe(-1)
    })
  })

  // ----- reset -----
  describe('reset', () => {
    it('初期値にリセットされる', () => {
      const { count, increment, reset } = useCounter(5)
      increment()
      increment()
      expect(count.value).toBe(7)
      reset()
      expect(count.value).toBe(5)
    })
  })

  // ----- incrementBy -----
  describe('incrementBy', () => {
    it('指定した量だけ増える', () => {
      const { count, incrementBy } = useCounter()
      incrementBy(10)
      expect(count.value).toBe(10)
    })

    it('負の数を指定すると減る', () => {
      const { count, incrementBy } = useCounter(5)
      incrementBy(-3)
      expect(count.value).toBe(2)
    })
  })

  // ----- computed プロパティ -----
  describe('doubleCount', () => {
    it('カウントの2倍を返す', () => {
      const { doubleCount, increment } = useCounter(3)
      expect(doubleCount.value).toBe(6)
      increment()
      expect(doubleCount.value).toBe(8)
    })
  })

  describe('isPositive', () => {
    it('正の数のときtrueを返す', () => {
      const { isPositive } = useCounter(1)
      expect(isPositive.value).toBe(true)
    })

    it('0のときfalseを返す', () => {
      const { isPositive } = useCounter(0)
      expect(isPositive.value).toBe(false)
    })

    it('負の数のときfalseを返す', () => {
      const { isPositive } = useCounter(-1)
      expect(isPositive.value).toBe(false)
    })
  })
})
