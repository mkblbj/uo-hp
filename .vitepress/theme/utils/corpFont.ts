import type { Locale } from "../content/siteCopy";

export const corpFontFamily = (locale: Locale): string => {
  if (locale === "zh") return '"Noto Sans SC", sans-serif';
  if (locale === "en") return '"Manrope", sans-serif';
  return '"Noto Sans JP", sans-serif';
};
