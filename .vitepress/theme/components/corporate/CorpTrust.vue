<script setup lang="ts">
import type { HomeContent } from "../../content/homeContent";

defineProps<{ trust: HomeContent["trust"] }>();
</script>

<template>
  <section class="trust">
    <div class="trust__inner corp-container">
      <div class="trust__grid">
        <div v-for="item in trust.items" :key="item.label" class="trust__item rv">
          <span class="trust__value" :data-count="item.value">{{ item.value }}</span>
          <span class="trust__label">{{ item.label }}</span>
        </div>
      </div>
      <div class="trust__notes">
        <p v-for="note in trust.notes" :key="note" class="trust__note">{{ note }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust {
  position: relative;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
  background: #070c11;
}

.trust__inner {
  padding: clamp(2.6rem, 5vw, 4rem) 0 clamp(2rem, 4vw, 3rem);
}

.trust__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1px;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.trust__item {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1.45rem 1.2rem 1.55rem;
  background: #070c11;
}

.trust__value {
  font-family: "Orbitron", sans-serif;
  font-size: clamp(1.35rem, 2.1vw, 1.85rem);
  font-weight: 700;
  line-height: 1;
  color: #fff;
}

.trust__label {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  line-height: 1.55;
  color: rgba(248, 243, 235, 0.64);
  text-wrap: pretty;
}

.trust__notes {
  display: grid;
  gap: 0.35rem;
  margin-top: 1.1rem;
}

.trust__note {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.7;
  color: rgba(248, 243, 235, 0.6);
}

@media (max-width: 760px) {
  .trust__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .trust__grid {
    grid-template-columns: 1fr;
  }
}
</style>
