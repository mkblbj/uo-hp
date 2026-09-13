<script setup lang="ts">
import { withBase } from "vitepress";
import type { HomeContent } from "../../content/homeContent";
import { linkAttrs } from "../../utils/linkAttrs";
import CorpArrowLink from "./CorpArrowLink.vue";
import CorpSectionHead from "./CorpSectionHead.vue";

defineProps<{ performance: HomeContent["performance"] }>();
</script>

<template>
  <section id="performance" class="perf">
    <div class="perf__inner corp-container">
      <CorpSectionHead :eyebrow="performance.eyebrow" :title="performance.title" :intro="performance.intro" />
      <div class="perf__grid">
        <div class="perf__results rv">
          <div class="perf__head"><span class="corp-cardlabel">{{ performance.resultsTitle }}</span></div>
          <div v-for="result in performance.results" :key="result.label" class="perf__row">
            <span class="perf__label">{{ result.label }}</span>
            <span class="perf__value">{{ result.value }}</span>
          </div>
          <div class="perf__foot">
            <p class="perf__note">{{ performance.note }}</p>
            <CorpArrowLink :href="performance.linkHref" :label="performance.linkLabel" />
          </div>
        </div>
        <div class="perf__groups rv">
          <div v-for="group in performance.channelGroups" :key="group.platform" class="perf__group">
            <span class="perf__platform">{{ group.platform }}</span>
            <div class="perf__shops">
              <span v-for="shop in group.shops" :key="shop" class="perf__shop">{{ shop }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 合作伙伴 LOGO：后台有内容才显示（设计稿里是「待補充」占位） -->
      <div v-if="performance.partners.length" class="perf__partners rv">
        <div class="perf__head"><span class="corp-cardlabel">{{ performance.partnersTitle }}</span></div>
        <div class="perf__logos">
          <component
            :is="partner.url ? 'a' : 'div'"
            v-for="partner in performance.partners"
            :key="partner.name"
            class="perf__logo"
            v-bind="linkAttrs(partner.url)"
          >
            <img :src="withBase(partner.logo)" :alt="partner.name" loading="lazy" decoding="async" />
          </component>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.perf {
  position: relative;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  background: #070c11;
}

.perf__inner {
  padding: clamp(4.5rem, 9vw, 8rem) 0;
}

.perf__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.perf__results {
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
}

.perf__head {
  padding: 1rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
}

.perf__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.07);
}

.perf__label {
  font-size: 0.83rem;
  font-weight: 300;
  color: rgba(248, 243, 235, 0.72);
  text-wrap: pretty;
}

.perf__value {
  font-family: "Orbitron", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  text-align: right;
  white-space: nowrap;
}

.perf__foot {
  padding: 1rem 1.4rem 1.2rem;
}

.perf__note {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  line-height: 1.7;
  color: rgba(248, 243, 235, 0.62);
  text-wrap: pretty;
}

.perf__groups {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.perf__group {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.25rem 1.4rem;
  background: #050809;
}

/* 修复（spec §5-4）：最后一组撑满剩余高度，去掉设计稿里底部露出的灰条 */
.perf__group:last-child {
  flex: 1;
}

.perf__platform {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #8fc0ea;
}

.perf__shops {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.perf__shop {
  padding: 0.34rem 0.68rem;
  border: 1px solid rgba(199, 215, 231, 0.18);
  font-size: 0.73rem;
  color: rgba(232, 241, 249, 0.84);
}

.perf__partners {
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
}

.perf__logos {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.6rem;
  padding: 1.2rem 1.4rem 1.4rem;
}

.perf__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.4rem;
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: rgba(255, 255, 255, 0.015);
}

.perf__logo img {
  max-width: 80%;
  max-height: 2rem;
  width: auto;
  height: auto;
  object-fit: contain;
}

@media (max-width: 1020px) {
  .perf__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .perf__logos {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .perf__logos {
    grid-template-columns: 1fr;
  }
}
</style>
