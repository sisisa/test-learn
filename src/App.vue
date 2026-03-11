<script setup lang="ts">
import Counter from './components/Counter.vue'
</script>

<template>
  <div id="app-root">
    <h1>テスト学習アプリ</h1>
    <Counter />
  </div>
</template>

<style>
#app-root {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
}
</style>
