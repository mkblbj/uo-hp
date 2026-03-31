<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Locale } from "../content/siteCopy";

interface LanguageToggleProps {
  activeLocale: Locale;
  label: string;
  localeLinks: Record<Locale, string>;
  localeNames: Record<Locale, string>;
}

interface LocaleOption {
  code: Locale;
  flag: string;
  href: string;
  label: string;
}

const props = defineProps<LanguageToggleProps>();

const localeFlags: Record<Locale, string> = {
  ja: "🇯🇵",
  zh: "🇨🇳",
  en: "🇺🇸",
};

const locales: Locale[] = ["ja", "zh", "en"];
const rootRef = ref<HTMLElement | null>(null);
const open = ref(false);

const localeOptions = computed<LocaleOption[]>(() =>
  locales.map((locale) => ({
    code: locale,
    flag: localeFlags[locale],
    href: props.localeLinks[locale],
    label: props.localeNames[locale],
  })),
);

const activeOption = computed(
  () => localeOptions.value.find((locale) => locale.code === props.activeLocale) ?? localeOptions.value[0],
);

const closeMenu = () => {
  open.value = false;
};

const toggleMenu = () => {
  open.value = !open.value;
};

const handlePointerDown = (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  if (rootRef.value && !rootRef.value.contains(target)) {
    closeMenu();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handlePointerDown);
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handlePointerDown);
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div ref="rootRef" class="locale-toggle">
    <button
      type="button"
      class="locale-toggle__trigger"
      :aria-label="props.label"
      aria-haspopup="menu"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggleMenu"
    >
      <span class="locale-toggle__flag">{{ activeOption.flag }}</span>
      <span class="locale-toggle__label">{{ activeOption.label }}</span>
      <svg
        class="locale-toggle__chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div v-if="open" class="locale-toggle__menu" role="menu" :aria-label="props.label">
      <a
        v-for="locale in localeOptions"
        :key="locale.code"
        :href="locale.href"
        class="locale-toggle__item"
        :class="{ 'is-active': props.activeLocale === locale.code }"
        :aria-current="props.activeLocale === locale.code ? 'page' : undefined"
        @click="closeMenu"
      >
        <span class="locale-toggle__flag">{{ locale.flag }}</span>
        <span class="locale-toggle__item-label">{{ locale.label }}</span>
        <svg
          v-if="props.activeLocale === locale.code"
          class="locale-toggle__check"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </a>
    </div>
  </div>
</template>
