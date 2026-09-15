<script setup lang="ts">
import { computed } from "vue";
import { useData, useRoute } from "vitepress";
import CorpFooter from "../components/corporate/CorpFooter.vue";
import CorpHeader from "../components/corporate/CorpHeader.vue";
import CorpPageHero from "../components/corporate/CorpPageHero.vue";
import CorpPageTabs from "../components/corporate/CorpPageTabs.vue";
import RecruitApply from "../components/recruit/RecruitApply.vue";
import RecruitFaq from "../components/recruit/RecruitFaq.vue";
import RecruitFeatures from "../components/recruit/RecruitFeatures.vue";
import RecruitFlow from "../components/recruit/RecruitFlow.vue";
import RecruitJobList from "../components/recruit/RecruitJobList.vue";
import RecruitSection from "../components/recruit/RecruitSection.vue";
import { useLocale } from "../composables/useLocale";
import { getHomeContent } from "../content/homeContent";
import { getHomeUi } from "../content/homeUi";
import { innerNavItems, normalizePath, type PageTab } from "../content/pageNav";
import { fillCount, getRecruitUi } from "../content/recruitUi";
import { data } from "../data/recruit.data";
import { accessMapUrl } from "../utils/accessMap";
import { getLocalePath } from "../utils/localePath";

const { frontmatter } = useData();
const route = useRoute();
const { locale, localeLinks } = useLocale();

// 页头、页脚的数据和首页是同一份；招聘内容来自 data/recruit/（后台「招聘首页」「招聘职位」）
const content = computed(() => getHomeContent(locale.value));
const ui = computed(() => getHomeUi(locale.value));
const rui = computed(() => getRecruitUi(locale.value));
const jobs = computed(() => data.jobs[locale.value]);
const page = computed(() => data.page[locale.value]);
const path = computed(() => normalizePath(route.path));
const homePath = computed(() => getLocalePath("/", locale.value));
const recruitPath = computed(() => getLocalePath("/recruit/", locale.value));
const navItems = computed(() => innerNavItems(content.value.nav, path.value));
const title = computed(() => String(frontmatter.value.title ?? ""));
const crumbs = computed(() => [{ label: ui.value.home, path: homePath.value }, { label: title.value }]);
const mapUrl = computed(() => accessMapUrl(content.value.access));

// 各区块：没有内容的不显示，编号和页签跟着顺延；应聘方式固定在最后
const sections = computed(() =>
  [
    { id: "positions", tab: rui.value.tabs.positions, title: rui.value.sections.positions, show: jobs.value.length > 0 },
    { id: "environment", tab: rui.value.tabs.environment, title: rui.value.sections.environment, show: page.value.features.length > 0 || page.value.benefits.length > 0 },
    { id: "flow", tab: rui.value.tabs.flow, title: rui.value.sections.flow, show: page.value.steps.length > 0 },
    { id: "faq", tab: rui.value.tabs.faq, title: rui.value.sections.faq, show: page.value.faq.length > 0 },
  ]
    .filter((section) => section.show)
    .map((section, index) => ({ ...section, no: String(index + 1).padStart(2, "0") })),
);

const tabs = computed<PageTab[]>(() => [
  ...sections.value.map((section) => ({ path: `#${section.id}`, label: section.tab, no: section.no, current: false, groupStart: false })),
  { path: "#apply", label: rui.value.tabs.apply, no: String(sections.value.length + 1).padStart(2, "0"), current: false, groupStart: false },
]);
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
    <main id="main" tabindex="-1">
      <CorpPageHero :crumbs="crumbs" :crumbs-label="ui.breadcrumbLabel" :eyebrow="rui.eyebrow" :title="title" :lead="page.lead">
        <dl class="recruit-facts">
          <div class="recruit-facts__item">
            <dt>{{ rui.facts.positions }}</dt>
            <dd><span class="recruit-facts__num">{{ jobs.length }}</span>{{ rui.facts.positionsCount }}</dd>
          </div>
          <div v-if="page.locationShort" class="recruit-facts__item">
            <dt>{{ rui.facts.location }}</dt>
            <dd>{{ page.locationShort }}</dd>
          </div>
          <div class="recruit-facts__item">
            <dt>{{ rui.facts.apply }}</dt>
            <dd>{{ rui.facts.applyMethods }}</dd>
          </div>
        </dl>
      </CorpPageHero>
      <CorpPageTabs :tabs="tabs" :label="rui.tabsLabel" />
      <div class="recruit-body corp-container">
        <RecruitSection
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          :no="section.no"
          :title="section.title"
          :sub="section.id === 'positions' ? fillCount(rui.positionsSub, jobs.length) : undefined"
        >
          <RecruitJobList v-if="section.id === 'positions'" :jobs="jobs" :ui="rui" :base-path="recruitPath" />
          <RecruitFeatures
            v-else-if="section.id === 'environment'"
            :features="page.features"
            :benefits="page.benefits"
            :note="page.benefitsNote"
            :benefits-title="rui.benefitsTitle"
          />
          <RecruitFlow v-else-if="section.id === 'flow'" :steps="page.steps" :label="rui.step" />
          <RecruitFaq v-else :items="page.faq" :marks="rui.faqMarks" />
        </RecruitSection>
      </div>
      <RecruitApply :page="page" :ui="rui" :subject="rui.apply.subjectPrefix.trim()" />
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

<style>
/* 页签是页内锚点，交给浏览器原生跳转；落点由 corporate.css 的 .corp [id] { scroll-margin-top } 控制 */
html:has(.corp-recruit) {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html:has(.corp-recruit) {
    scroll-behavior: auto;
  }
}
</style>

<style scoped>
.recruit-facts {
  display: inline-flex;
  margin: clamp(1.8rem, 3vw, 2.4rem) 0 0;
  border: 1px solid rgba(199, 215, 231, 0.14);
  background: rgba(5, 8, 9, 0.72);
}

.recruit-facts__item {
  margin: 0;
  padding: 0.95rem 1.5rem 1rem;
}

.recruit-facts__item + .recruit-facts__item {
  border-left: 1px solid rgba(199, 215, 231, 0.1);
}

.recruit-facts dt {
  margin: 0 0 0.45rem;
  font-family: "Orbitron", sans-serif;
  font-size: 0.56rem;
  letter-spacing: 0.2em;
  color: rgba(175, 208, 238, 0.9);
}

.recruit-facts dd {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.recruit-facts__num {
  margin-right: 0.25rem;
  font-family: "Orbitron", sans-serif;
  font-size: 1.45rem;
  font-weight: 600;
}

.recruit-body {
  padding: clamp(1rem, 3vw, 2rem) 0 clamp(4rem, 8vw, 6.5rem);
}

@media (max-width: 760px) {
  .recruit-facts {
    display: grid;
    width: 100%;
  }

  .recruit-facts__item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.8rem 1.1rem;
  }

  .recruit-facts dt {
    margin: 0;
  }

  .recruit-facts__item + .recruit-facts__item {
    border-top: 1px solid rgba(199, 215, 231, 0.1);
    border-left: none;
  }
}
</style>
