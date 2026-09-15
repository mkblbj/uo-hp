<script setup lang="ts">
import { computed } from "vue";
import { useData, useRoute, withBase } from "vitepress";
import CorpFooter from "../components/corporate/CorpFooter.vue";
import CorpHeader from "../components/corporate/CorpHeader.vue";
import CorpPageHero from "../components/corporate/CorpPageHero.vue";
import RecruitApply from "../components/recruit/RecruitApply.vue";
import RecruitConditions from "../components/recruit/RecruitConditions.vue";
import RecruitJobFacts from "../components/recruit/RecruitJobFacts.vue";
import RecruitOthers from "../components/recruit/RecruitOthers.vue";
import RecruitSection from "../components/recruit/RecruitSection.vue";
import { useLocale } from "../composables/useLocale";
import { getHomeContent } from "../content/homeContent";
import { getHomeUi } from "../content/homeUi";
import { innerNavItems, normalizePath } from "../content/pageNav";
import { paragraphs, type ExtraSection } from "../content/recruitData";
import { employmentTag, getRecruitUi } from "../content/recruitUi";
import { data } from "../data/recruit.data";
import { accessMapUrl } from "../utils/accessMap";
import { navLinkAttrs } from "../utils/linkAttrs";
import { getLocalePath } from "../utils/localePath";

const { params } = useData();
const route = useRoute();
const { locale, localeLinks } = useLocale();

const content = computed(() => getHomeContent(locale.value));
const ui = computed(() => getHomeUi(locale.value));
const rui = computed(() => getRecruitUi(locale.value));
const page = computed(() => data.page[locale.value]);
// 网址名来自动态路由（recruit/[job]/index.paths.ts）
const job = computed(() => data.jobs[locale.value].find((item) => item.slug === params.value?.job));
const others = computed(() => data.jobs[locale.value].filter((item) => item.slug !== job.value?.slug));
const path = computed(() => normalizePath(route.path));
const homePath = computed(() => getLocalePath("/", locale.value));
const recruitPath = computed(() => getLocalePath("/recruit/", locale.value));
const listHref = computed(() => `${recruitPath.value}#positions`);
const accessHref = computed(() => `${homePath.value}#access`);
const navItems = computed(() => innerNavItems(content.value.nav, path.value));
const mapUrl = computed(() => accessMapUrl(content.value.access));
const crumbs = computed(() => [
  { label: ui.value.home, path: homePath.value },
  { label: content.value.nav.recruit, path: recruitPath.value },
  { label: job.value?.title ?? "" },
]);
const eyebrow = computed(() => (job.value ? `${rui.value.eyebrow} / ${rui.value.categories[job.value.category].eyebrow}` : rui.value.eyebrow));

// 正文小节：歓迎条件、附加小节、求人PR 没有内容就不显示，编号跟着顺延
type Section = { key: string; title: string; extra?: ExtraSection };
const sections = computed(() => {
  const current = job.value;
  if (!current) return [];
  const list: Section[] = [
    { key: "duties", title: rui.value.jobSections.duties },
    { key: "requirements", title: rui.value.jobSections.requirements },
    ...(current.preferred.items.length || current.preferred.note ? [{ key: "preferred", title: rui.value.jobSections.preferred }] : []),
    ...current.sections.map((extra, index) => ({ key: `extra-${index}`, title: extra.title, extra })),
    { key: "conditions", title: rui.value.jobSections.conditions },
    ...(current.pr ? [{ key: "pr", title: rui.value.jobSections.pr }] : []),
  ];
  return list.map((section, index) => ({ ...section, no: String(index + 1).padStart(2, "0") }));
});
</script>

<template>
  <div class="corp corp-recruit" :data-locale="locale">
    <a class="corp-skip" href="#main" target="_self">{{ ui.skipToContent }}</a>
    <CorpHeader
      :brand="content.brand"
      :nav-items="navItems"
      :contact-label="content.nav.contact"
      :home-href="homePath"
      :contact-href="`${homePath}#contact`"
      :ui="ui"
      :locale="locale"
      :locale-links="localeLinks"
    />
    <main v-if="job" id="main" tabindex="-1">
      <CorpPageHero :crumbs="crumbs" :crumbs-label="ui.breadcrumbLabel" :eyebrow="eyebrow" :title="job.title" :lead="job.summary" compact>
        <template #before-title>
          <div class="job-tags">
            <span v-if="job.employmentTypes.length" class="job-tag job-tag--type">{{ employmentTag(job.employmentTypes, rui) }}</span>
            <span v-for="(tag, index) in job.tags" :key="index" class="job-tag">{{ tag }}</span>
            <span class="job-tag">{{ rui.categories[job.category].label }}</span>
          </div>
        </template>
        <div class="job-ctas">
          <a class="job-btn job-btn--primary" href="#apply" target="_self">
            {{ rui.cta.apply }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <a class="job-btn job-btn--ghost" v-bind="navLinkAttrs(listHref)">{{ rui.cta.list }}</a>
        </div>
      </CorpPageHero>
      <RecruitJobFacts :job="job" :ui="rui" :location="page.locationShort" :access-href="accessHref" />

      <div class="recruit-body corp-container">
        <RecruitSection v-for="section in sections" :key="section.key" :no="section.no" :title="section.title">
          <div v-if="section.key === 'duties'" class="corp-prose job-text">
            <p v-for="(paragraph, index) in paragraphs(job.duties.intro)" :key="`intro-${index}`">{{ paragraph }}</p>
            <ul v-if="job.duties.items.length" class="job-text__cols">
              <li v-for="(item, index) in job.duties.items" :key="index">{{ item }}</li>
            </ul>
            <p v-for="(paragraph, index) in paragraphs(job.duties.note)" :key="`note-${index}`">{{ paragraph }}</p>
          </div>
          <div v-else-if="section.key === 'requirements' || section.key === 'preferred'" class="corp-prose job-text">
            <ul v-if="job[section.key].items.length">
              <li v-for="(item, index) in job[section.key].items" :key="index">{{ item }}</li>
            </ul>
            <p v-for="(paragraph, index) in paragraphs(job[section.key].note)" :key="`note-${index}`">{{ paragraph }}</p>
          </div>
          <div v-else-if="section.extra" class="corp-prose job-text">
            <p v-for="(paragraph, index) in paragraphs(section.extra.intro)" :key="`intro-${index}`">{{ paragraph }}</p>
            <ul v-if="section.extra.items.length">
              <li v-for="(item, index) in section.extra.items" :key="index">{{ item }}</li>
            </ul>
            <p v-for="(paragraph, index) in paragraphs(section.extra.note)" :key="`note-${index}`">{{ paragraph }}</p>
          </div>
          <RecruitConditions v-else-if="section.key === 'conditions'" :job="job" :ui="rui" :address="content.access.address" :access-href="accessHref" />
          <div v-else class="job-pr">
            <p v-for="(paragraph, index) in paragraphs(job.pr)" :key="index">{{ paragraph }}</p>
          </div>
        </RecruitSection>

        <RecruitOthers v-if="others.length" :jobs="others" :ui="rui" :base-path="recruitPath" :list-href="listHref" />
      </div>
      <RecruitApply :page="page" :ui="rui" :subject="`${rui.apply.subjectPrefix}${job.title}`" show-subject />
    </main>
    <!-- 找不到职位（例如数据刚被删掉）时只留一个回到职位列表的链接 -->
    <main v-else id="main" tabindex="-1" class="job-missing corp-container">
      <a :href="withBase(recruitPath)">{{ rui.cta.list }}</a>
    </main>
    <CorpFooter
      :brand="content.brand"
      :footer="content.footer"
      :map-url="mapUrl"
      :locale="locale"
      :locale-links="localeLinks"
      :home-href="homePath"
      :current-path="path"
    />
  </div>
</template>

<style scoped>
.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0 0 1.1rem;
}

.job-tag {
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

.job-tag--type {
  border-color: rgba(120, 175, 225, 0.45);
  background: rgba(24, 95, 159, 0.2);
  color: #eef6fd;
  font-weight: 700;
}

.job-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: clamp(1.6rem, 3vw, 2.2rem);
}

.job-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem 1.7rem;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.job-btn svg {
  width: 0.85rem;
  height: 0.85rem;
}

.job-btn--primary {
  background: #185f9f;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(120, 175, 225, 0.34), 0 20px 50px rgba(24, 95, 159, 0.35);
}

.job-btn--primary:hover {
  background: #2277bd;
  transform: translateY(-2px);
  color: #fff;
}

.job-btn--ghost {
  border: 1px solid rgba(199, 215, 231, 0.28);
  background: rgba(255, 255, 255, 0.02);
  color: #f0f6fc;
  font-weight: 500;
}

.job-btn--ghost:hover {
  border-color: rgba(199, 215, 231, 0.54);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
  color: #f0f6fc;
}

.recruit-body {
  padding-top: clamp(1rem, 3vw, 2rem);
}

/* 正文文字用内页的排版（.corp-prose：段落、蓝色小方块列表），这里只管段落之间的间距 */
.job-text > * {
  margin: 0;
}

.job-text > * + * {
  margin-top: 1.5rem;
}

.job-text__cols {
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
}

.job-pr {
  padding: 1.7rem 1.9rem;
  border: 1px solid rgba(199, 215, 231, 0.12);
  border-left: 2px solid #6fa9de;
  background: linear-gradient(135deg, rgba(24, 95, 159, 0.14), rgba(5, 8, 9, 0.92) 62%);
}

.job-pr p {
  margin: 0;
  font-size: 1rem;
  line-height: 2.05;
  color: rgba(248, 243, 235, 0.88);
}

.job-pr p + p {
  margin-top: 1rem;
}

.job-missing {
  padding: clamp(4rem, 8vw, 6.5rem) 0;
}

.job-missing a {
  color: #6fa9de;
}

@media (max-width: 760px) {
  .job-text__cols {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .job-btn {
    flex: 1 1 100%;
  }
}
</style>
