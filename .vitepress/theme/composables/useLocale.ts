import { computed } from "vue";
import { useRoute, withBase } from "vitepress";
import type { Locale } from "../content/siteCopy";
import { getLocaleFromPath, getLocalePath } from "../utils/localePath";

// 纯函数在 utils/localePath.ts（测试可以直接导入）；这里转出，原来的调用方（Layout.vue 等）不用改
export { getLegacyLocaleFromSearch, getLocaleFromPath, getLocalePath, removeLegacyLocaleFromSearch } from "../utils/localePath";

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
