<script setup lang="ts">
import { computed } from "vue";
import { useData, useRoute } from "vitepress";
import CorpContact from "../components/corporate/CorpContact.vue";
import CorpFooter from "../components/corporate/CorpFooter.vue";
import CorpHeader from "../components/corporate/CorpHeader.vue";
import CorpPageCards from "../components/corporate/CorpPageCards.vue";
import CorpPageHero from "../components/corporate/CorpPageHero.vue";
import CorpPagePager from "../components/corporate/CorpPagePager.vue";
import CorpPageTabs from "../components/corporate/CorpPageTabs.vue";
import { useLocale } from "../composables/useLocale";
import { getHomeContent } from "../content/homeContent";
import { getHomeUi } from "../content/homeUi";
import { getPageNav, innerNavItems, normalizePath, pageCrumbs } from "../content/pageNav";
import { accessMapUrl } from "../utils/accessMap";
import { getLocalePath } from "../utils/localePath";

const { frontmatter } = useData();
const route = useRoute();
const { locale, localeLinks } = useLocale();

// 页头、联系区、页脚的数据和首页是同一份（data/home/ja.json）
const content = computed(() => getHomeContent(locale.value));
const ui = computed(() => getHomeUi(locale.value));
const path = computed(() => normalizePath(route.path));
const homePath = computed(() => getLocalePath("/", locale.value));
const nav = computed(() => getPageNav(path.value));
const navItems = computed(() => innerNavItems(content.value.nav, path.value));
const title = computed(() => String(frontmatter.value.title ?? ""));
const lead = computed(() => String(frontmatter.value.description ?? ""));
// 后台没填英文小标题时，用栏目的默认值（COMPANY / BUSINESS）
const eyebrow = computed(() => String(frontmatter.value.eyebrow || nav.value?.section.eyebrow || ""));
// 不在页面清单里的日文页面（以后新增的）只显示「ホーム / 标题」
const crumbs = computed(() =>
  nav.value ? pageCrumbs(nav.value, ui.value.home, title.value) : [{ label: ui.value.home, path: homePath.value }, { label: title.value }],
);
const withSection = (template: string) => template.replace("{section}", nav.value?.section.label ?? "");
const mapUrl = computed(() => accessMapUrl(content.value.access));
</script>

<template>
  <div class="corp corp-page" :data-locale="locale">
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
      <CorpPageHero :crumbs="crumbs" :crumbs-label="ui.breadcrumbLabel" :eyebrow="eyebrow" :title="title" :lead="lead" />
      <CorpPageTabs v-if="nav" :tabs="nav.tabs" :label="withSection(ui.tabsLabel)" />
      <div class="corp-page__body corp-container">
        <Content class="corp-prose" />
        <CorpPageCards
          v-if="nav?.isSectionTop"
          :cards="nav.sectionPages"
          :eyebrow="ui.pagesEyebrow"
          :title="withSection(ui.pagesTitle)"
          :more="ui.more"
        />
        <CorpPagePager
          v-else-if="nav"
          :prev="nav.prev"
          :next="nav.next"
          :label="ui.pagerLabel"
          :prev-label="ui.prev"
          :next-label="ui.next"
        />
      </div>
      <CorpContact :contact="content.contact" :ui="ui" :current-path="path" />
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
.corp-page__body {
  padding-bottom: clamp(4rem, 8vw, 6.5rem);
}
</style>
