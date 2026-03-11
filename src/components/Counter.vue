<script setup lang="ts">
/**
 * Counter.vue — 結合テスト学習用コンポーネント
 *
 * useCounter composable を利用するUIコンポーネントです。
 * 結合テストでは、UIクリック → 状態変化 → 表示更新 の一連の流れを検証します。
 */
import { useCounter } from '@/composables/useCounter'

const { count, doubleCount, isPositive, increment, decrement, reset } = useCounter()
</script>

<template>
  <div class="counter">
    <h2>カウンター</h2>

    <div class="counter__display">
      <p data-testid="count" class="counter__value">{{ count }}</p>
      <p data-testid="double-count" class="counter__double">
        2倍: {{ doubleCount }}
      </p>
      <p data-testid="is-positive" class="counter__status">
        {{ isPositive ? '正の数です' : '正の数ではありません' }}
      </p>
    </div>

    <div class="counter__actions">
      <button id="decrement" class="counter__btn counter__btn--minus" @click="decrement">
        −
      </button>
      <button id="reset" class="counter__btn counter__btn--reset" @click="reset">
        リセット
      </button>
      <button id="increment" class="counter__btn counter__btn--plus" @click="increment">
        ＋
      </button>
    </div>
  </div>
</template>

<style scoped>
.counter {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: #f8f9fa;
  max-width: 400px;
  margin: 2rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.counter__value {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.counter__double {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.counter__status {
  color: #27ae60;
  font-weight: 500;
}

.counter__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.counter__btn {
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.2s;
}

.counter__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.counter__btn--plus {
  background: #3498db;
  color: white;
}

.counter__btn--minus {
  background: #e74c3c;
  color: white;
}

.counter__btn--reset {
  background: #95a5a6;
  color: white;
}
</style>
