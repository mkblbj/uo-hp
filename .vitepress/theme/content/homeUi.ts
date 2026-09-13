import type { Locale } from "./siteCopy";

export interface HomeUi {
  skipToContent: string;
  mainNavLabel: string;
  menuLabel: string;
  langLabel: string;
  more: string;
  contactLabels: { tel: string; email: string; hours: string };
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
};

const uiByLocale: Partial<Record<Locale, HomeUi>> = { ja };

export const getHomeUi = (locale: Locale): HomeUi => uiByLocale[locale] ?? ja;
