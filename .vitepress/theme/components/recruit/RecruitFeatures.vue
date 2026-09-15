<script setup lang="ts">
defineProps<{ features: { title: string; body: string }[]; benefits: string[]; note: string; benefitsTitle: string }>();

const toNo = (index: number) => String(index + 1).padStart(2, "0");
</script>

<template>
  <div v-if="features.length" class="feat">
    <div v-for="(feature, index) in features" :key="index" class="feat__card">
      <span class="feat__no" aria-hidden="true">{{ toNo(index) }}</span>
      <h3 class="feat__title">{{ feature.title }}</h3>
      <p class="feat__body">{{ feature.body }}</p>
    </div>
  </div>
  <div v-if="benefits.length" class="perks">
    <h3 class="perks__title">{{ benefitsTitle }}</h3>
    <ul class="perks__list">
      <li v-for="(benefit, index) in benefits" :key="index" class="perks__item">{{ benefit }}</li>
    </ul>
    <p v-if="note" class="perks__note">{{ note }}</p>
  </div>
</template>

<style scoped>
.feat {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.feat__card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.5rem 1.6rem 1.7rem;
  background: #050809;
}

.feat__no {
  font-family: "Orbitron", sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #6fa9de;
}

.feat__title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.5;
  color: #fff;
}

.feat__body {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 300;
  line-height: 1.9;
  color: rgba(248, 243, 235, 0.76);
}

/* 首页「CORE STRENGTHS」面板的样子 */
.perks {
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
}

.perks__title {
  margin: 0;
  padding: 0.95rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
  background: rgba(24, 95, 159, 0.1);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.5;
  color: rgba(226, 238, 249, 0.96);
}

.perks__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 1.2rem 1.4rem;
  list-style: none;
}

.perks__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border: 1px solid rgba(199, 215, 231, 0.16);
  background: rgba(255, 255, 255, 0.015);
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(232, 241, 249, 0.88);
}

.perks__item::before {
  content: "";
  flex: none;
  width: 5px;
  height: 5px;
  background: #6fa9de;
  box-shadow: 0 0 8px rgba(111, 169, 222, 0.8);
}

.perks__note {
  margin: 0;
  padding: 0 1.4rem 1.2rem;
  font-size: 0.76rem;
  line-height: 1.8;
  color: rgba(248, 243, 235, 0.55);
}

@media (max-width: 1020px) {
  .feat {
    grid-template-columns: 1fr;
  }
}
</style>
