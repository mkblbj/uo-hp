<script setup lang="ts">
import CorpMultiline from "./CorpMultiline.vue";

defineProps<{ eyebrow: string; title: string; intro: string; tightTitle?: boolean }>();
</script>

<template>
  <div class="head rv">
    <div>
      <p class="corp-eyebrow"><span class="corp-eyebrow__line" aria-hidden="true" />{{ eyebrow }}</p>
      <h2 class="head__title" :class="{ 'head__title--tight': tightTitle }"><CorpMultiline :text="title" /></h2>
    </div>
    <p class="head__intro">{{ intro }}</p>
  </div>
</template>

<style scoped>
.head {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: end;
  gap: clamp(1.5rem, 4vw, 4rem);
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.head__title {
  margin: 0;
  font-size: clamp(1.8rem, 3.1vw, 2.85rem);
  font-weight: 900;
  line-height: 1.3;
  color: #fff;
  text-wrap: balance;
}

.head__title--tight {
  letter-spacing: -0.005em;
}

.head__intro {
  margin: 0;
  font-size: clamp(0.93rem, 1.05vw, 1.02rem);
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.72);
  text-wrap: pretty;
}

@media (max-width: 760px) {
  .head {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
