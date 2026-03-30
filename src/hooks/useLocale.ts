import { useCallback, useEffect, useState } from "react";
import type { Locale } from "../content/siteCopy";

const LOCALE_STORAGE_KEY = "uo-hp-locale";
const VALID_LOCALES: Locale[] = ["ja", "zh", "en"];

const isValidLocale = (value: string | null): value is Locale =>
  value !== null && VALID_LOCALES.includes(value as Locale);

const getLocaleFromSearch = (): Locale | null => {
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang");

  return isValidLocale(language) ? language : null;
};

const getInitialLocale = (): Locale => {
  const fromSearch = getLocaleFromSearch();

  if (fromSearch) {
    return fromSearch;
  }

  const fromStorage = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  return isValidLocale(fromStorage) ? fromStorage : "ja";
};

export const useLocale = () => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const updateUrl = useCallback((nextLocale: Locale) => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLocale);
    window.history.replaceState({}, "", url.toString());
  }, []);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      updateUrl(nextLocale);
    },
    [updateUrl],
  );

  useEffect(() => {
    const onPopState = () => {
      setLocaleState(getInitialLocale());
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  return {
    locale,
    setLocale,
  };
};
