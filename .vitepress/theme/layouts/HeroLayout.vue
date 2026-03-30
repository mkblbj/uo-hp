<script setup lang="ts">
import { computed, watchEffect } from "vue";
import HeroSection from "../components/HeroSection.vue";
import { type Locale, siteCopy } from "../content/siteCopy";
import { useLocale } from "../composables/useLocale";

const htmlLanguageByLocale: Record<Locale, string> = {
  ja: "ja",
  zh: "zh-CN",
  en: "en",
};

const { locale, localeLinks } = useLocale();
const copy = computed(() => siteCopy[locale.value]);

watchEffect(() => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = htmlLanguageByLocale[locale.value];
  document.documentElement.dataset.locale = locale.value;
  document.title = copy.value.metaTitle;
});
</script>

<template>
  <div class="hero-layout" :data-locale="locale">
    <div class="page-shell">
      <HeroSection
        :locale="locale"
        :locale-links="localeLinks"
        :navigation="copy.navigation"
        :hero="copy.hero"
      />
    </div>
  </div>
</template>
