import logoMark from "../assets/uo-logo-pure.png";
import logoWhite from "../assets/uo-logo-white.png";
import type { Locale, SiteCopy } from "../content/siteCopy";
import { LanguageToggle } from "./LanguageToggle";
import { ShaderBackground } from "./ShaderBackground";

interface HeroSectionProps {
  locale: Locale;
  navigation: SiteCopy["navigation"];
  hero: SiteCopy["hero"];
  onLocaleChange: (locale: Locale) => void;
}

export function HeroSection({
  locale,
  navigation,
  hero,
  onLocaleChange,
}: HeroSectionProps) {
  return (
    <section className="hero-section" id="top">
      <ShaderBackground />
      <div className="hero-logo-atmosphere" aria-hidden="true">
        <div className="hero-logo-atmosphere__mist hero-logo-atmosphere__mist--outer" />
        <div className="hero-logo-atmosphere__mist hero-logo-atmosphere__mist--inner" />
        <img
          src={logoMark}
          alt=""
          className="hero-logo-atmosphere__image hero-logo-atmosphere__image--glow"
        />
        <img
          src={logoMark}
          alt=""
          className="hero-logo-atmosphere__image hero-logo-atmosphere__image--core"
        />
      </div>

      <header className="hero-header">
        <div className="site-frame hero-header__inner">
          <a
            className="brand-mark"
            href="#top"
            aria-label={`${navigation.brand} ${navigation.region}`}
          >
            <img src={logoWhite} alt="" className="brand-mark__logo" />
            <span className="brand-mark__text">
              <span className="brand-mark__name">{navigation.brand}</span>
              <span className="brand-mark__region">{navigation.region}</span>
            </span>
          </a>
          <LanguageToggle
            activeLocale={locale}
            label={navigation.localeSwitchLabel}
            localeNames={navigation.localeNames}
            onChange={onLocaleChange}
          />
        </div>
      </header>

      <div className="site-frame hero-section__body">
        <div className="hero-copy">
          <div className="hero-badge">{hero.badge}</div>

          <div className="hero-headline">
            {hero.headline.map((line, index) => (
              <p
                className={`hero-headline__line${
                  index === hero.headline.length - 1 ? " hero-headline__line--accent" : ""
                }`}
                key={`${locale}-headline-${index}`}
              >
                {line}
              </p>
            ))}
          </div>

          <p className="hero-summary">{hero.summary}</p>

          <div className="hero-metrics" aria-label="Company metrics">
            {hero.metrics.map((metric) => (
              <div className="hero-metrics__item" key={`${metric.value}-${metric.label}`}>
                <span className="hero-metrics__value">{metric.value}</span>
                <span className="hero-metrics__label">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <a
              className="button button--primary"
              href={hero.primaryCtaHref}
              target="_blank"
              rel="noreferrer"
            >
              {hero.primaryCta}
            </a>
            <a
              className="button button--secondary"
              href={hero.secondaryCtaHref}
              target="_blank"
              rel="noreferrer"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
