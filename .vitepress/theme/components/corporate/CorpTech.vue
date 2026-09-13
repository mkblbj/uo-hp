<script setup lang="ts">
import type { HomeContent } from "../../content/homeContent";
import CorpArrowLink from "./CorpArrowLink.vue";
import CorpMultiline from "./CorpMultiline.vue";

defineProps<{ tech: HomeContent["tech"] }>();
</script>

<template>
  <section id="tech" class="tech">
    <div class="tech__grid-bg" aria-hidden="true" />
    <div class="tech__glow" aria-hidden="true" />
    <div class="tech__inner corp-container">
      <div class="rv">
        <p class="corp-eyebrow"><span class="corp-eyebrow__line" aria-hidden="true" />{{ tech.eyebrow }}</p>
        <h2 class="tech__title"><CorpMultiline :text="tech.title" /></h2>
        <p class="tech__body">{{ tech.body }}</p>
        <p class="tech__note">{{ tech.note }}</p>
        <CorpArrowLink class="tech__link" :href="tech.linkHref" :label="tech.linkLabel" />
      </div>
      <div class="tech__list rv">
        <div v-for="item in tech.items" :key="item.code" class="tech__item">
          <span class="tech__code">{{ item.code }}</span>
          <span class="tech__text">
            <span class="tech__item-title">{{ item.title }}</span>
            <span class="tech__item-desc">{{ item.desc }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech {
  position: relative;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  background: #070c11;
  overflow: hidden;
}

.tech__grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(134, 187, 235, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(134, 187, 235, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 78% 50%, #000, transparent 72%);
  mask-image: radial-gradient(ellipse 70% 80% at 78% 50%, #000, transparent 72%);
}

.tech__glow {
  position: absolute;
  top: 50%;
  right: -8%;
  width: 38rem;
  height: 38rem;
  transform: translateY(-50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(24, 95, 159, 0.22), transparent 68%);
  filter: blur(50px);
  pointer-events: none;
}

.tech__inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
  padding: clamp(4.5rem, 9vw, 8rem) 0;
}

.tech__title {
  margin: 0 0 1.4rem;
  font-size: clamp(1.8rem, 3.1vw, 2.85rem);
  font-weight: 900;
  line-height: 1.32;
  color: #fff;
  text-wrap: balance;
}

.tech__body {
  margin: 0 0 1.2rem;
  font-size: clamp(0.93rem, 1.05vw, 1.02rem);
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.8);
  text-wrap: pretty;
}

.tech__note {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.66);
  text-wrap: pretty;
}

.tech .tech__link {
  margin-top: 1.8rem;
  font-size: 0.84rem;
}

.tech__list {
  display: grid;
  gap: 1px;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.tech__item {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: start;
  gap: 1rem;
  padding: 1.3rem 1.4rem;
  background: rgba(6, 10, 15, 0.9);
}

.tech__code {
  font-family: "Orbitron", sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #6fa9de;
  padding-top: 0.15rem;
}

.tech__text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.tech__item-title {
  font-size: 0.93rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
}

.tech__item-desc {
  font-size: 0.79rem;
  font-weight: 300;
  line-height: 1.75;
  color: rgba(248, 243, 235, 0.68);
  text-wrap: pretty;
}

@media (max-width: 760px) {
  .tech__inner {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
