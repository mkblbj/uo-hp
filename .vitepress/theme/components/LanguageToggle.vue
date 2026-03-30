<script setup lang="ts">
import type { Locale } from "../content/siteCopy";

interface LanguageToggleProps {
  activeLocale: Locale;
  label: string;
  localeNames: Record<Locale, string>;
}

const props = defineProps<LanguageToggleProps>();
const emit = defineEmits<{
  change: [locale: Locale];
}>();

const locales: Locale[] = ["ja", "zh", "en"];
</script>

<template>
  <div class="locale-toggle" role="group" :aria-label="props.label">
    <button
      v-for="locale in locales"
      :key="locale"
      type="button"
      class="locale-toggle__button"
      :class="{ 'is-active': props.activeLocale === locale }"
      :aria-pressed="props.activeLocale === locale"
      @click="emit('change', locale)"
    >
      {{ props.localeNames[locale] }}
    </button>
  </div>
</template>
