<script setup lang="ts">
import { onMounted } from "vue";
import { inBrowser, useData, useRoute, withBase } from "vitepress";
import DefaultTheme from "vitepress/theme";
import {
  getLegacyLocaleFromSearch,
  getLocalePath,
  removeLegacyLocaleFromSearch,
} from "./composables/useLocale";
import HeroLayout from "./layouts/HeroLayout.vue";

const { frontmatter } = useData();
const route = useRoute();

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
  <HeroLayout v-if="frontmatter.layout === 'hero'" />
  <DefaultTheme.Layout v-else />
</template>
