<script setup lang="ts">
import { withBase } from "vitepress";
import logoMark from "../assets/uo-logo-pure.png";
import logoWhite from "../assets/uo-logo-white.png";
import type { Locale, SiteCopy } from "../content/siteCopy";
import LanguageToggle from "./LanguageToggle.vue";
import ShaderBackground from "./ShaderBackground.vue";

interface HeroSectionProps {
  locale: Locale;
  localeLinks: Record<Locale, string>;
  navigation: SiteCopy["navigation"];
  hero: SiteCopy["hero"];
}

const props = defineProps<HeroSectionProps>();
</script>

<template>
  <section class="hero-section" id="top">
    <ShaderBackground />
    <div class="hero-logo-atmosphere" aria-hidden="true">
      <div class="hero-logo-atmosphere__mist hero-logo-atmosphere__mist--outer" />
      <div class="hero-logo-atmosphere__mist hero-logo-atmosphere__mist--inner" />
      <img
        :src="logoMark"
        alt=""
        class="hero-logo-atmosphere__image hero-logo-atmosphere__image--glow"
      />
      <img
        :src="logoMark"
        alt=""
        class="hero-logo-atmosphere__image hero-logo-atmosphere__image--core"
      />
    </div>

    <header class="hero-header">
      <div class="site-frame hero-header__inner">
        <a
          class="brand-mark"
          href="#top"
          :aria-label="`${props.navigation.brand} ${props.navigation.region}`"
        >
          <img :src="logoWhite" alt="" class="brand-mark__logo" />
          <span class="brand-mark__text">
            <span class="brand-mark__name">{{ props.navigation.brand }}</span>
            <span class="brand-mark__region">{{ props.navigation.region }}</span>
          </span>
        </a>
        <LanguageToggle
          :active-locale="props.locale"
          :label="props.navigation.localeSwitchLabel"
          :locale-links="props.localeLinks"
          :locale-names="props.navigation.localeNames"
        />
      </div>
    </header>

    <div class="site-frame hero-section__body">
      <div class="hero-copy">
        <div class="hero-badge">{{ props.hero.badge }}</div>

        <div class="hero-headline">
          <p
            v-for="(line, index) in props.hero.headline"
            :key="`${props.locale}-headline-${index}`"
            class="hero-headline__line"
            :class="{
              'hero-headline__line--accent': index === props.hero.headline.length - 1,
            }"
          >
            {{ line }}
          </p>
        </div>

        <p class="hero-summary">{{ props.hero.summary }}</p>

        <div class="hero-metrics" aria-label="Company metrics">
          <div
            v-for="metric in props.hero.metrics"
            :key="`${metric.value}-${metric.label}`"
            class="hero-metrics__item"
          >
            <span class="hero-metrics__value">{{ metric.value }}</span>
            <span class="hero-metrics__label">{{ metric.label }}</span>
          </div>
        </div>

        <div class="hero-actions">
          <a class="button button--primary" :href="withBase(props.hero.ctaHref)">
            {{ props.hero.cta }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
