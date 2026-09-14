import type { Locale } from "../content/siteCopy";

const LEGACY_LANG_PARAM = "lang";
const VALID_LOCALES: Locale[] = ["ja", "zh", "en"];
const LOCALE_PREFIX: Record<Locale, string> = {
  ja: "",
  zh: "/zh",
  en: "/en",
};

// 三种语言都有这 12 个页面（首页 + 11 个内页）。以前中英文只列了 3 页，内页切换语言会跳回栏目首页
const PAGES = [
  "/",
  "/about/",
  "/about/profile/",
  "/about/message/",
  "/services/",
  "/services/mobile-accessories/",
  "/services/domestic-foods/",
  "/services/oem-wholesale/",
  "/services/products/",
  "/services/performance/",
  "/services/strengths/",
  "/services/future/",
];

export const AVAILABLE_PATHS: Record<Locale, Set<string>> = {
  ja: new Set(PAGES),
  zh: new Set(PAGES),
  en: new Set(PAGES),
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
  const requestedPath = stripLocalePrefix(path);
  const basePath = AVAILABLE_PATHS[locale].has(requestedPath)
    ? requestedPath
    : requestedPath.startsWith("/about/")
      ? "/about/"
      : requestedPath.startsWith("/services/")
        ? "/services/"
        : "/";
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
