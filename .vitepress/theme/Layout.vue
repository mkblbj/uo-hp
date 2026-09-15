<script setup lang="ts">
import { defineAsyncComponent, onMounted } from "vue";
import { inBrowser, useData, useRoute, withBase } from "vitepress";
import DefaultTheme from "vitepress/theme";
import {
  getLegacyLocaleFromSearch,
  getLocalePath,
  removeLegacyLocaleFromSearch,
  useLocale,
} from "./composables/useLocale";
import { loadRecruitJobLayout, loadRecruitLayout } from "./layouts/asyncLayouts";
import CorporateLayout from "./layouts/CorporateLayout.vue";
import CorporatePageLayout from "./layouts/CorporatePageLayout.vue";
import HeroLayout from "./layouts/HeroLayout.vue";

// 招聘页的布局和招聘数据按需加载：只有打开招聘页时才下载，其他页面的体积不变
const RecruitLayout = defineAsyncComponent(loadRecruitLayout);
const RecruitJobLayout = defineAsyncComponent(loadRecruitJobLayout);

const { frontmatter, page } = useData();
const route = useRoute();
const { locale } = useLocale();

onMounted(() => {
  if (!inBrowser) {
    return;
  }

  const legacyLocale = getLegacyLocaleFromSearch(window.location.search);

  if (!legacyLocale) {
    return;
  }

  const nextPath = withBase(getLocalePath(route.path, legacyLocale));
  const nextSearch = removeLegacyLocaleFromSearch(window.location.search);
  const nextUrl = `${nextPath}${nextSearch}${window.location.hash}`;

  if (window.location.pathname === nextPath) {
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState({}, "", nextUrl);
    }

    return;
  }

  window.location.replace(nextUrl);
});
</script>

<template>
  <CorporateLayout v-if="frontmatter.layout === 'corporate'" />
  <HeroLayout v-else-if="frontmatter.layout === 'hero'" />
  <RecruitLayout v-else-if="frontmatter.layout === 'recruit'" />
  <RecruitJobLayout v-else-if="frontmatter.layout === 'recruit-job'" />
  <!-- 404.html 只构建一次、却会用于任何不存在的网址（包括 /zh/…），所以 404 不按语言选布局，保持 VitePress 默认样式 -->
  <CorporatePageLayout v-else-if="!page.isNotFound" />
  <DefaultTheme.Layout v-else />
</template>
