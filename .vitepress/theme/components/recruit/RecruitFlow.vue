<script setup lang="ts">
defineProps<{ steps: { title: string; body: string }[]; label: string }>();

const toNo = (index: number) => String(index + 1).padStart(2, "0");
</script>

<template>
  <ol class="flow">
    <li v-for="(step, index) in steps" :key="index" class="flow__step">
      <span class="flow__no">{{ label }} {{ toNo(index) }}</span>
      <h3 class="flow__title">{{ step.title }}</h3>
      <p v-if="step.body" class="flow__body">{{ step.body }}</p>
    </li>
  </ol>
</template>

<style scoped>
/* 电脑端一行排开（步骤之间有箭头）；≤880px 两列；≤520px 一列 */
.flow {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.flow__step {
  position: relative;
  padding: 1.4rem 1.4rem 1.5rem;
  background: #050809;
}

.flow__step:not(:last-child)::after {
  content: "";
  position: absolute;
  z-index: 2;
  top: 50%;
  right: -6px;
  width: 11px;
  height: 11px;
  border-top: 1px solid #6fa9de;
  border-right: 1px solid #6fa9de;
  background: #050809;
  transform: translateY(-50%) rotate(45deg);
}

.flow__no {
  font-family: "Orbitron", sans-serif;
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  color: #6fa9de;
}

.flow__title {
  margin: 0.6rem 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  color: #fff;
}

.flow__body {
  margin: 0;
  font-size: 0.84rem;
  font-weight: 300;
  line-height: 1.85;
  color: rgba(248, 243, 235, 0.72);
}

@media (max-width: 880px) {
  .flow {
    grid-auto-flow: row;
    grid-template-columns: 1fr 1fr;
  }

  .flow__step:nth-child(2n)::after {
    display: none;
  }
}

@media (max-width: 520px) {
  .flow {
    grid-template-columns: 1fr;
  }

  .flow__step::after {
    display: none;
  }
}
</style>
