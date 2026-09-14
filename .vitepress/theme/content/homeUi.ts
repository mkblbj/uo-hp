import type { Locale } from "./siteCopy";

export interface HomeUi {
  skipToContent: string;
  mainNavLabel: string;
  menuLabel: string;
  langLabel: string;
  more: string;
  contactLabels: { tel: string; email: string; hours: string };
  /** 内页：面包屑的第一项 */
  home: string;
  /** 内页：面包屑的无障碍标签 */
  breadcrumbLabel: string;
  /** 内页：栏目页签的无障碍标签，「{section}」会换成栏目名 */
  tabsLabel: string;
  /** 内页：上一页/下一页的无障碍标签和标签文字 */
  pagerLabel: string;
  prev: string;
  next: string;
  /** 栏目首页：各页卡片的英文小标题和标题，「{section}」会换成栏目名 */
  pagesEyebrow: string;
  pagesTitle: string;
  /** 会社概要「基本情報」表格的表头 */
  profileHead: { label: string; value: string };
}

export interface LocaleMenuItem {
  locale: Locale;
  code: string;
  name: string;
}

export const LOCALE_MENU: LocaleMenuItem[] = [
  { locale: "ja", code: "JA", name: "日本語" },
  { locale: "zh", code: "ZH", name: "简体中文" },
  { locale: "en", code: "EN", name: "English" },
];

const ja: HomeUi = {
  skipToContent: "本文へスキップ",
  mainNavLabel: "メインナビゲーション",
  menuLabel: "ページナビゲーション",
  langLabel: "表示言語を切り替える",
  more: "詳しく見る",
  contactLabels: { tel: "TEL", email: "EMAIL", hours: "HOURS" },
  home: "ホーム",
  breadcrumbLabel: "パンくずリスト",
  tabsLabel: "{section}のページ",
  pagerLabel: "前後のページ",
  prev: "PREV",
  next: "NEXT",
  pagesEyebrow: "PAGES",
  pagesTitle: "{section}の各ページ",
  profileHead: { label: "項目", value: "内容" },
};

const uiByLocale: Partial<Record<Locale, HomeUi>> = { ja };

export const getHomeUi = (locale: Locale): HomeUi => uiByLocale[locale] ?? ja;
