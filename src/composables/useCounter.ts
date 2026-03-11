/**
 * useCounter.ts — Composition API の Composable 学習用
 *
 * ref と computed を使ったカウンターロジックです。
 * UIコンポーネントから分離されたロジックを単体テストする例として使用します。
 */

import { ref, computed } from 'vue'

export function useCounter(initialValue: number = 0) {
  const count = ref(initialValue)

  const doubleCount = computed(() => count.value * 2)

  const isPositive = computed(() => count.value > 0)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  function incrementBy(amount: number) {
    count.value += amount
  }

  return {
    count,
    doubleCount,
    isPositive,
    increment,
    decrement,
    reset,
    incrementBy,
  }
}
