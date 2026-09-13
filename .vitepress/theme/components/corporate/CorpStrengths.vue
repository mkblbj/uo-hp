<script setup lang="ts">
import type { HomeContent } from "../../content/homeContent";
import CorpSectionHead from "./CorpSectionHead.vue";

defineProps<{ strengths: HomeContent["strengths"] }>();
</script>

<template>
  <section id="strengths" class="strengths">
    <div class="strengths__inner corp-container">
      <CorpSectionHead :eyebrow="strengths.eyebrow" :title="strengths.title" :intro="strengths.intro" />
      <div class="strengths__reasons">
        <article v-for="reason in strengths.reasons" :key="reason.no" class="reason rv">
          <span class="reason__no">{{ reason.no }}</span>
          <h3 class="reason__title">{{ reason.title }}</h3>
          <p class="reason__body">{{ reason.body }}</p>
        </article>
      </div>
      <div class="core rv">
        <div class="core__head"><span class="corp-cardlabel">{{ strengths.coreTitle }}</span></div>
        <div class="core__grid">
          <div v-for="item in strengths.core" :key="item.text" class="core__item">
            <span class="core__dot" aria-hidden="true" />
            <span class="core__text">
              <span class="core__label">{{ item.text }}</span>
              <span class="core__category">{{ item.category }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.strengths {
  position: relative;
  background: #030507;
}

.strengths__inner {
  padding: clamp(4.5rem, 9vw, 8rem) 0;
}

.strengths__reasons {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.reason {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.7rem, 3vw, 2.4rem);
  background: #050809;
}

.reason__no {
  font-family: "Orbitron", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  color: #6fa9de;
}

.reason__title {
  margin: 0;
  font-size: clamp(1.02rem, 1.35vw, 1.18rem);
  font-weight: 700;
  line-height: 1.5;
  color: #fff;
  text-wrap: balance;
}

.reason__body {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.74);
  text-wrap: pretty;
}

.core {
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
}

.core__head {
  padding: 1rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
  background: rgba(24, 95, 159, 0.1);
}

.core__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: rgba(199, 215, 231, 0.1);
}

.core__item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1.15rem 1.4rem;
  background: #050809;
}

.core__dot {
  flex: none;
  width: 5px;
  height: 5px;
  margin-top: 0.55rem;
  background: #6fa9de;
  box-shadow: 0 0 8px rgba(111, 169, 222, 0.8);
}

.core__text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.core__label {
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.65;
  color: rgba(248, 243, 235, 0.92);
  text-wrap: pretty;
}

.core__category {
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  color: rgba(175, 208, 238, 0.9);
}

@media (max-width: 1020px) {
  .strengths__reasons,
  .core__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .strengths__reasons,
  .core__grid {
    grid-template-columns: 1fr;
  }
}
</style>
