<script setup lang="ts">
import { withBase } from "vitepress";
import type { Job } from "../../content/recruitData";
import { employmentTag, type RecruitUi } from "../../content/recruitUi";
import { navLinkAttrs } from "../../utils/linkAttrs";

// 职位页底部的其他职位（相当于内页的上一页/下一页）；listHref 是招聘首页的职位列表（带 #positions）
const props = defineProps<{ jobs: Job[]; ui: RecruitUi; basePath: string; listHref: string }>();
const href = (job: Job) => withBase(`${props.basePath}${job.slug}/`);
</script>

<template>
  <nav class="others" :aria-label="ui.others.title">
    <div class="others__head">
      <div class="others__head-inner">
        <span class="others__eyebrow">{{ ui.others.eyebrow }}</span>
        <h2 class="others__title">{{ ui.others.title }}</h2>
        <a class="others__more" v-bind="navLinkAttrs(listHref)">
          {{ ui.cta.list }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>
    </div>
    <ul class="others__grid">
      <li v-for="job in jobs" :key="job.slug">
        <a class="other" :href="href(job)">
          <span class="other__cat">{{ ui.categories[job.category].eyebrow }}</span>
          <span class="other__title">{{ job.title }}</span>
          <span v-if="job.employmentTypes.length" class="other__type">{{ employmentTag(job.employmentTypes, ui) }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 和正文小节一样的左右两栏 */
.others {
  display: grid;
  grid-template-columns: minmax(0, 0.32fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 5rem);
  padding: clamp(2.6rem, 5vw, 4rem) 0 clamp(4rem, 8vw, 6.5rem);
}

.others__head-inner {
  position: sticky;
  top: 96px;
}

.others__eyebrow {
  display: block;
  margin-bottom: 0.8rem;
  font-family: "Orbitron", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  color: #6fa9de;
}

.others__title {
  margin: 0 0 1.2rem;
  font-size: clamp(1.3rem, 1.9vw, 1.7rem);
  font-weight: 700;
  line-height: 1.45;
  color: #fff;
}

.others__more {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #6fa9de;
}

.others__more:hover {
  color: #9ec8ec;
}

.others__more svg {
  width: 0.75rem;
  height: 0.75rem;
}

.others__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  max-width: 54rem;
  margin: 0;
  padding: 0;
  list-style: none;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.others__grid li {
  display: flex;
}

.other {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1.15rem 1.35rem 1.25rem;
  background: #050809;
  transition: background 0.3s ease;
}

.other:hover {
  background: #080e14;
}

.other__cat {
  font-family: "Orbitron", sans-serif;
  font-size: 0.56rem;
  letter-spacing: 0.18em;
  color: #6fa9de;
}

.other__title {
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.55;
  color: #fff;
}

.other__type {
  font-size: 0.74rem;
  color: rgba(175, 208, 238, 0.85);
}

/* 最后一行只有一张卡片时占满一行 */
.others__grid li:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

@media (max-width: 1020px) {
  .others {
    grid-template-columns: minmax(0, 0.38fr) minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .others {
    grid-template-columns: 1fr;
    gap: 1.3rem;
  }

  .others__head-inner {
    position: static;
  }

  .others__grid {
    grid-template-columns: 1fr;
  }
}
</style>
