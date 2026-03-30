import type { Locale } from "../content/siteCopy";

interface LanguageToggleProps {
  activeLocale: Locale;
  label: string;
  localeNames: Record<Locale, string>;
  onChange: (locale: Locale) => void;
}

export function LanguageToggle({
  activeLocale,
  label,
  localeNames,
  onChange,
}: LanguageToggleProps) {
  return (
    <div className="locale-toggle" role="group" aria-label={label}>
      {(["ja", "zh", "en"] as const).map((locale) => {
        const isActive = activeLocale === locale;

        return (
          <button
            key={locale}
            type="button"
            className={`locale-toggle__button${isActive ? " is-active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onChange(locale)}
          >
            {localeNames[locale]}
          </button>
        );
      })}
    </div>
  );
}
