<script setup lang="ts">
import { paragraphs, type Job } from "../../content/recruitData";
import { employmentFull, type RecruitUi } from "../../content/recruitUi";
import { navLinkAttrs } from "../../utils/linkAttrs";

// address：本语言首页 ACCESS 的地址（公司搬家时改一处，所有职位一起变）
defineProps<{ job: Job; ui: RecruitUi; address: string; accessHref: string }>();

const lines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);
</script>

<template>
  <!-- 募集要項：可选栏目（休日・休暇、試用期間、その他）没填时整行不输出 -->
  <table class="cond">
    <tbody>
      <tr v-if="job.employmentTypes.length">
        <th scope="row">{{ ui.conditions.employment }}</th>
        <td>{{ employmentFull(job.employmentTypes, ui) }}</td>
      </tr>
      <tr v-if="job.salary">
        <th scope="row">{{ ui.conditions.salary }}</th>
        <td><span v-for="(line, index) in lines(job.salary)" :key="index" class="cond__line">{{ line }}</span></td>
      </tr>
      <tr v-if="job.hours.text || job.hours.items.length">
        <th scope="row">{{ ui.conditions.hours }}</th>
        <td>
          {{ job.hours.text }}
          <ul v-if="job.hours.items.length" class="cond__list">
            <li v-for="(item, index) in job.hours.items" :key="index">{{ item }}</li>
          </ul>
        </td>
      </tr>
      <tr v-if="job.holidays">
        <th scope="row">{{ ui.conditions.holidays }}</th>
        <td><p v-for="(paragraph, index) in paragraphs(job.holidays)" :key="index" class="cond__para">{{ paragraph }}</p></td>
      </tr>
      <tr v-if="job.trialPeriod">
        <th scope="row">{{ ui.conditions.trialPeriod }}</th>
        <td>{{ job.trialPeriod }}</td>
      </tr>
      <tr>
        <th scope="row">{{ ui.conditions.workplace }}</th>
        <td>
          {{ address }}
          <ul v-if="job.workplace.items.length" class="cond__list">
            <li v-for="(item, index) in job.workplace.items" :key="index">{{ item }}</li>
          </ul>
          <a class="cond__link" v-bind="navLinkAttrs(accessHref)">
            {{ ui.cta.accessLong }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </td>
      </tr>
      <tr v-if="job.benefits.length">
        <th scope="row">{{ ui.conditions.benefits }}</th>
        <td>
          <ul class="cond__chips">
            <li v-for="(benefit, index) in job.benefits" :key="index">{{ benefit }}</li>
          </ul>
        </td>
      </tr>
      <tr v-if="job.otherConditions">
        <th scope="row">{{ ui.conditions.other }}</th>
        <td><p v-for="(paragraph, index) in paragraphs(job.otherConditions)" :key="index" class="cond__para">{{ paragraph }}</p></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
/* 首页「基本情報」卡片的样子；左列是项目名 */
.cond {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
}

.cond th {
  width: 10rem;
  padding: 1.05rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.08);
  background: rgba(24, 95, 159, 0.08);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1.75;
  text-align: left;
  vertical-align: top;
  color: rgba(175, 208, 238, 0.95);
}

.cond td {
  padding: 1.05rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.08);
  font-size: 0.9rem;
  line-height: 1.85;
  vertical-align: top;
  color: rgba(248, 243, 235, 0.9);
}

.cond tr:last-child th,
.cond tr:last-child td {
  border-bottom: none;
}

.cond__line {
  display: block;
}

.cond__para {
  margin: 0;
}

.cond__para + .cond__para {
  margin-top: 0.6rem;
}

.cond__list {
  display: grid;
  gap: 0.35rem;
  margin: 0.6rem 0 0;
  padding: 0;
  list-style: none;
}

.cond__list li {
  position: relative;
  padding-left: 1.35rem;
  font-size: 0.86rem;
  line-height: 1.75;
  color: rgba(248, 243, 235, 0.84);
}

.cond__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.72em;
  width: 5px;
  height: 5px;
  background: #6fa9de;
  box-shadow: 0 0 8px rgba(111, 169, 222, 0.8);
}

.cond__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #6fa9de;
}

.cond__link:hover {
  color: #9ec8ec;
}

.cond__link svg {
  width: 0.7rem;
  height: 0.7rem;
}

.cond__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cond__chips li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(199, 215, 231, 0.16);
  background: rgba(255, 255, 255, 0.015);
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(232, 241, 249, 0.88);
}

.cond__chips li::before {
  content: "";
  flex: none;
  width: 5px;
  height: 5px;
  background: #6fa9de;
  box-shadow: 0 0 8px rgba(111, 169, 222, 0.8);
}

@media (max-width: 760px) {
  .cond th {
    width: 6.4rem;
    padding-left: 1rem;
    padding-right: 0.8rem;
  }

  .cond td {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
