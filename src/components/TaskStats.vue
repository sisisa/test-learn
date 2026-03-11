<script setup lang="ts">
/**
 * TaskStats.vue — タスク統計サマリー
 */
defineProps<{
  total: number
  todo: number
  inProgress: number
  done: number
}>()
</script>

<template>
  <div class="stats">
    <div class="stats__card stats__card--total" data-testid="stat-total">
      <span class="stats__number">{{ total }}</span>
      <span class="stats__label">全タスク</span>
    </div>
    <div class="stats__card stats__card--todo" data-testid="stat-todo">
      <span class="stats__number">{{ todo }}</span>
      <span class="stats__label">未着手</span>
    </div>
    <div class="stats__card stats__card--progress" data-testid="stat-progress">
      <span class="stats__number">{{ inProgress }}</span>
      <span class="stats__label">進行中</span>
    </div>
    <div class="stats__card stats__card--done" data-testid="stat-done">
      <span class="stats__number">{{ done }}</span>
      <span class="stats__label">完了</span>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stats__card {
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  background: #1e1e2e;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stats__number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stats__label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.stats__card--total .stats__number { color: #89b4fa; }
.stats__card--todo .stats__number { color: #fab387; }
.stats__card--progress .stats__number { color: #f9e2af; }
.stats__card--done .stats__number { color: #a6e3a1; }

@media (max-width: 600px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
