<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import type { PageLink } from "../../content/pageNav";
import { data as pages } from "../../data/pages.data";

const props = defineProps<{ cards: PageLink[]; eyebrow: string; title: string; more: string }>();

// 卡片说明取各页后台的「页面描述」；描述为空时只显示名称
const items = computed(() =>
  props.cards.map((card) => ({ ...card, description: pages.find((page) => page.url === card.path)?.description ?? "" })),
);
</script>

<template>
  <section class="page-cards">
    <div class="page-cards__head">
      <div class="page-cards__head-inner">
        <span class="page-cards__eyebrow">{{ eyebrow }}</span>
        <h2 class="page-cards__title">{{ title }}</h2>
      </div>
    </div>
    <div class="page-cards__grid">
      <a v-for="card in items" :key="card.path" class="page-cards__card" :href="withBase(card.path)">
        <span class="page-cards__no" aria-hidden="true">{{ card.no }}</span>
        <span class="page-cards__name">{{ card.label }}</span>
        <span v-if="card.description" class="page-cards__desc">{{ card.description }}</span>
        <span class="page-cards__more">
          {{ more }}
          <svg class="page-cards__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
/* 和正文小节一样：左边小标题，右边卡片 */
.page-cards {
  display: grid;
  grid-template-columns: minmax(0, 0.32fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 5rem);
  padding-top: clamp(2.6rem, 5vw, 4rem);
}

.page-cards__head-inner {
  position: sticky;
  top: 96px;
}

.page-cards__eyebrow {
  display: block;
  margin-bottom: 0.8rem;
  font-family: "Orbitron", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  line-height: 1.5;
  color: #6fa9de;
}

.page-cards__title {
  margin: 0;
  font-size: clamp(1.3rem, 1.9vw, 1.7rem);
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: 0.03em;
  color: #fff;
  text-wrap: balance;
}

/* 和正文小节的内容栏一样最宽 54rem */
.page-cards__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  min-width: 0;
  max-width: 54rem;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.page-cards__card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-height: 10.5rem;
  padding: 1.5rem 1.6rem 1.6rem;
  background: #050809;
  transition: background 0.3s ease;
}

.page-cards__card:hover {
  background: #080e14;
}

.page-cards__no {
  font-family: "Orbitron", sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #6fa9de;
}

.page-cards__name {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  color: #fff;
}

/* 字号、行高、颜色和示意图实际显示的一致（示意图里 .sec__body p 盖过了 .pcard__desc） */
.page-cards__desc {
  font-size: 0.97rem;
  font-weight: 300;
  line-height: 2;
  color: rgba(248, 243, 235, 0.8);
}

.page-cards__more {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: auto;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #6fa9de;
  transition: gap 0.2s ease, color 0.2s ease;
}

.page-cards__card:hover .page-cards__more {
  gap: 0.8rem;
  color: #9ec8ec;
}

.page-cards__icon {
  width: 0.75rem;
  height: 0.75rem;
}

/* 最后一行不满时，最后一张卡片占满剩下的格子（事業案内 7 张、会社情報 2 张） */
.page-cards__card:last-child:nth-child(3n + 1) {
  grid-column: 1 / -1;
}

.page-cards__card:last-child:nth-child(3n + 2) {
  grid-column: span 2;
}

/* 和正文小节一样，窄一些的电脑屏幕上左栏稍微加宽 */
@media (max-width: 1020px) {
  .page-cards {
    grid-template-columns: minmax(0, 0.38fr) minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .page-cards {
    grid-template-columns: 1fr;
    gap: 1.3rem;
  }

  .page-cards__head-inner {
    position: static;
  }

  .page-cards__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .page-cards__card:last-child:nth-child(3n + 1),
  .page-cards__card:last-child:nth-child(3n + 2) {
    grid-column: auto;
  }

  .page-cards__card:last-child:nth-child(2n + 1) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 520px) {
  .page-cards__grid {
    grid-template-columns: 1fr;
  }

  .page-cards__card:last-child:nth-child(2n + 1) {
    grid-column: auto;
  }
}
</style>
