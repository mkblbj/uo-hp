<script setup lang="ts">
import type { Locale } from "../content/siteCopy";

interface LanguageToggleProps {
  activeLocale: Locale;
  label: string;
  localeLinks: Record<Locale, string>;
  localeNames: Record<Locale, string>;
}

const props = defineProps<LanguageToggleProps>();

const locales: Locale[] = ["ja", "zh", "en"];
</script>

<template>
  <div class="locale-toggle" role="group" :aria-label="props.label">
    <a
      v-for="locale in locales"
      :key="locale"
      :href="props.localeLinks[locale]"
      class="locale-toggle__button"
      :class="{ 'is-active': props.activeLocale === locale }"
      :aria-current="props.activeLocale === locale ? 'page' : undefined"
    >
      {{ props.localeNames[locale] }}
    </a>
  </div>
</template>
