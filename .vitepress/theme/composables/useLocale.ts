import { onMounted, onUnmounted, ref, watch } from "vue";
import type { Locale } from "../content/siteCopy";

const LOCALE_STORAGE_KEY = "uo-hp-locale";
const VALID_LOCALES: Locale[] = ["ja", "zh", "en"];

const isValidLocale = (value: string | null): value is Locale =>
  value !== null && VALID_LOCALES.includes(value as Locale);

const getLocaleFromSearch = (): Locale | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang");

  return isValidLocale(language) ? language : null;
};

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") {
    return "ja";
  }

  const fromSearch = getLocaleFromSearch();

  if (fromSearch) {
    return fromSearch;
  }

  const fromStorage = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  return isValidLocale(fromStorage) ? fromStorage : "ja";
};

export const useLocale = () => {
  const locale = ref<Locale>(getInitialLocale());

  const updateUrl = (nextLocale: Locale) => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLocale);
    window.history.replaceState({}, "", url.toString());
  };

  const setLocale = (nextLocale: Locale) => {
    locale.value = nextLocale;

    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    updateUrl(nextLocale);
  };

  const onPopState = () => {
    locale.value = getInitialLocale();
  };

  onMounted(() => {
    locale.value = getInitialLocale();
    window.addEventListener("popstate", onPopState);
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", onPopState);
    }
  });

  watch(locale, (nextLocale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    }
  });

  return {
    locale,
    setLocale,
  };
};
