import { useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { type Locale, siteCopy } from "./content/siteCopy";
import { useLocale } from "./hooks/useLocale";

const htmlLanguageByLocale: Record<Locale, string> = {
  ja: "ja",
  zh: "zh-CN",
  en: "en",
};

function App() {
  const { locale, setLocale } = useLocale();
  const copy = siteCopy[locale];

  useEffect(() => {
    document.documentElement.lang = htmlLanguageByLocale[locale];
    document.documentElement.dataset.locale = locale;
    document.title = copy.metaTitle;
  }, [copy.metaTitle, locale]);

  return (
    <div className="page-shell">
      <HeroSection
        locale={locale}
        onLocaleChange={setLocale}
        navigation={copy.navigation}
        hero={copy.hero}
      />
    </div>
  );
}

export default App;
