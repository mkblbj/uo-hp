<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { firstLine, groupByCategory, type Job } from "../../content/recruitData";
import { employmentTag, type RecruitUi } from "../../content/recruitUi";

const props = defineProps<{ jobs: Job[]; ui: RecruitUi; basePath: string }>();

// 按类别分组（物流・倉庫 → EC運営 → デザイン），没有职位的类别不显示；编号全页连续
const groups = computed(() => groupByCategory(props.jobs));
const href = (job: Job) => withBase(`${props.basePath}${job.slug}/`);
</script>

<template>
  <div class="jobs">
    <div v-for="group in groups" :key="group.category" class="jobs__group">
      <div class="jobs__head">
        <h3 class="jobs__label">
          <span class="jobs__en">{{ ui.categories[group.category].eyebrow }}</span>
          <span class="jobs__name">{{ ui.categories[group.category].label }}</span>
        </h3>
        <span class="jobs__count">{{ group.jobs.length }} {{ ui.facts.positionsCount }}</span>
      </div>
      <ul class="jobs__list">
        <li v-for="job in group.jobs" :key="job.slug">
          <a class="job" :href="href(job)">
            <span class="job__no" aria-hidden="true">{{ job.no }}</span>
            <span class="job__main">
              <span class="job__title">{{ job.title }}</span>
              <span v-if="job.summary" class="job__summary">{{ job.summary }}</span>
              <span class="job__meta">
                <span v-if="job.salary"><b>{{ ui.meta.salary }}</b>{{ firstLine(job.salary) }}</span>
                <span v-if="job.hours.text"><b>{{ ui.meta.hours }}</b>{{ job.hours.text }}</span>
              </span>
            </span>
            <span class="job__side">
              <span class="job__tags">
                <span v-if="job.employmentTypes.length" class="tag tag--type">{{ employmentTag(job.employmentTypes, ui) }}</span>
                <span v-for="(tag, index) in job.tags" :key="index" class="tag">{{ tag }}</span>
              </span>
              <span class="job__more">
                {{ ui.more }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.jobs {
  display: grid;
  gap: 2.4rem;
}

.jobs__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.jobs__label {
  display: inline-flex;
  align-items: baseline;
  gap: 0.8rem;
  margin: 0;
  font-size: inherit;
}

.jobs__en {
  font-family: "Orbitron", sans-serif;
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  color: #6fa9de;
}

.jobs__name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.jobs__count {
  font-size: 0.76rem;
  color: rgba(248, 243, 235, 0.55);
  white-space: nowrap;
}

.jobs__list {
  display: grid;
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.job {
  display: grid;
  grid-template-columns: 2.6rem minmax(0, 1fr) auto;
  gap: 1.3rem;
  align-items: center;
  padding: 1.4rem 1.6rem;
  background: #050809;
  transition: background 0.3s ease;
}

.job:hover {
  background: #080e14;
}

.job__no {
  align-self: start;
  padding-top: 0.38rem;
  font-family: "Orbitron", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  color: #6fa9de;
}

.job__title {
  display: block;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.55;
  color: #fff;
}

.job__summary {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.86rem;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(248, 243, 235, 0.74);
}

.job__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1.3rem;
  margin-top: 0.65rem;
  font-size: 0.76rem;
  line-height: 1.7;
  color: rgba(175, 208, 238, 0.9);
}

.job__meta > span {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
}

.job__meta b {
  flex: none;
  font-weight: 500;
  white-space: nowrap;
  color: rgba(248, 243, 235, 0.48);
}

.job__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.9rem;
}

.job__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
  max-width: 15rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.26rem 0.6rem;
  border: 1px solid rgba(199, 215, 231, 0.2);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(232, 241, 249, 0.86);
  white-space: nowrap;
}

.tag--type {
  border-color: rgba(120, 175, 225, 0.45);
  background: rgba(24, 95, 159, 0.2);
  color: #eef6fd;
  font-weight: 700;
}

.job__more {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #6fa9de;
  white-space: nowrap;
  transition: gap 0.2s ease, color 0.2s ease;
}

.job:hover .job__more {
  gap: 0.8rem;
  color: #9ec8ec;
}

.job__more svg {
  width: 0.75rem;
  height: 0.75rem;
}

@media (max-width: 760px) {
  .job {
    grid-template-columns: 2rem minmax(0, 1fr);
    gap: 0.9rem 1rem;
    padding: 1.2rem 1.2rem 1.3rem;
  }

  .job__side {
    grid-column: 2;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .job__tags {
    justify-content: flex-start;
    max-width: none;
  }
}

@media (max-width: 520px) {
  .job__side {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
