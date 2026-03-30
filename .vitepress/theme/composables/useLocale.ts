import { computed } from "vue";
import { useRoute, withBase } from "vitepress";
import type { Locale } from "../content/siteCopy";

const LEGACY_LANG_PARAM = "lang";
const VALID_LOCALES: Locale[] = ["ja", "zh", "en"];
const LOCALE_PREFIX: Record<Locale, string> = {
  ja: "",
  zh: "/zh",
  en: "/en",
};

const isValidLocale = (value: string | null | undefined): value is Locale =>
  value !== null && VALID_LOCALES.includes(value as Locale);

const normalizePath = (path: string) => {
  const pathname = path.split(/[?#]/, 1)[0] || "/";

  if (pathname === "/") {
    return pathname;
  }

  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, "");

  return withoutTrailingSlash ? `${withoutTrailingSlash}/` : "/";
};

const stripLocalePrefix = (path: string) => {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/zh/" || normalizedPath.startsWith("/zh/")) {
    const nextPath = normalizedPath.slice("/zh".length);
    return nextPath || "/";
  }

  if (normalizedPath === "/en/" || normalizedPath.startsWith("/en/")) {
    const nextPath = normalizedPath.slice("/en".length);
    return nextPath || "/";
  }

  return normalizedPath;
};

export const getLocaleFromPath = (path: string): Locale => {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/zh/" || normalizedPath.startsWith("/zh/")) {
    return "zh";
  }

  if (normalizedPath === "/en/" || normalizedPath.startsWith("/en/")) {
    return "en";
  }

  return "ja";
};

export const getLocalePath = (path: string, locale: Locale) => {
  const basePath = stripLocalePrefix(path);
  const prefix = LOCALE_PREFIX[locale];

  if (basePath === "/") {
    return prefix ? `${prefix}/` : "/";
  }

  return `${prefix}${basePath}`;
};

export const getLegacyLocaleFromSearch = (search: string) => {
  const params = new URLSearchParams(search);
  const locale = params.get(LEGACY_LANG_PARAM);

  return isValidLocale(locale) ? locale : null;
};

export const removeLegacyLocaleFromSearch = (search: string) => {
  const params = new URLSearchParams(search);
  params.delete(LEGACY_LANG_PARAM);

  const nextSearch = params.toString();
  return nextSearch ? `?${nextSearch}` : "";
};

export const useLocale = () => {
  const route = useRoute();
  const locale = computed<Locale>(() => getLocaleFromPath(route.path));
  const localeLinks = computed<Record<Locale, string>>(() => ({
    ja: withBase(getLocalePath(route.path, "ja")),
    zh: withBase(getLocalePath(route.path, "zh")),
    en: withBase(getLocalePath(route.path, "en")),
  }));

  return {
    locale,
    localeLinks,
  };
};
