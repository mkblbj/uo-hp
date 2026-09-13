<script setup lang="ts">
import type { HomeContent } from "../../content/homeContent";
import type { HomeUi } from "../../content/homeUi";
import CorpArrowLink from "./CorpArrowLink.vue";
import CorpSectionHead from "./CorpSectionHead.vue";

defineProps<{ business: HomeContent["business"]; ui: HomeUi }>();
</script>

<template>
  <section id="business" class="business">
    <div class="business__inner corp-container">
      <CorpSectionHead :eyebrow="business.eyebrow" :title="business.title" :intro="business.intro" tight-title />
      <div class="business__grid">
        <article v-for="pillar in business.pillars" :key="pillar.no" class="pillar rv">
          <div class="pillar__top">
            <span class="pillar__no">{{ pillar.no }}</span>
            <span class="pillar__tag">{{ pillar.tag }}</span>
          </div>
          <h3 class="pillar__title">{{ pillar.title }}</h3>
          <p class="pillar__body">{{ pillar.body }}</p>
          <div class="pillar__chips">
            <span v-for="chip in pillar.chips" :key="chip" class="pillar__chip">{{ chip }}</span>
          </div>
          <CorpArrowLink class="pillar__more" :href="pillar.href" :label="ui.more" />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.business {
  position: relative;
  background: #030507;
}

.business__inner {
  padding: clamp(4.5rem, 9vw, 8rem) 0;
}

.business__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.pillar {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: clamp(1.7rem, 3vw, 2.6rem);
  background: #050809;
  transition: background 0.3s ease;
}

/* 滚动淡入的 transition 优先级更高，会把悬停背景过渡覆盖掉，所以合并写在一起 */
.corp[data-rv] .pillar.rv {
  transition:
    opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1),
    background 0.3s ease;
}

.pillar:hover {
  background: #080e14;
}

.pillar__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.pillar__no {
  font-family: "Orbitron", sans-serif;
  font-size: 2.1rem;
  font-weight: 700;
  line-height: 1;
  color: rgba(111, 169, 222, 0.32);
}

.pillar__tag {
  font-family: "Orbitron", sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  color: rgba(175, 208, 238, 0.9);
}

.pillar__title {
  margin: 0;
  font-size: clamp(1.08rem, 1.5vw, 1.3rem);
  font-weight: 700;
  line-height: 1.5;
  color: #fff;
  text-wrap: balance;
}

.pillar__body {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.76);
  text-wrap: pretty;
}

.pillar__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
  padding-top: 0.5rem;
}

.pillar__chip {
  padding: 0.34rem 0.68rem;
  border: 1px solid rgba(199, 215, 231, 0.18);
  font-size: 0.7rem;
  letter-spacing: 0.03em;
  color: rgba(232, 241, 249, 0.78);
}

.pillar .pillar__more {
  margin-top: 0.3rem;
}

@media (max-width: 1020px) {
  .business__grid {
    grid-template-columns: 1fr;
  }
}
</style>
