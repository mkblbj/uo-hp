<script setup lang="ts">
import { withBase } from "vitepress";
import logoMark from "../assets/uo-logo-pure.png";
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
          <img :src="logoMark" alt="" class="brand-mark__logo" />
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
            :key="`${metric.value ?? 'tag'}-${metric.label}`"
            class="hero-metrics__item"
            :class="{
              'hero-metrics__item--tag': !metric.value,
              'hero-metrics__item--new': !metric.value && metric.isNew,
            }"
          >
            <span v-if="metric.value" class="hero-metrics__value">{{ metric.value }}</span>
            <span class="hero-metrics__label">{{ metric.label }}</span>
            <span v-if="!metric.value && metric.isNew" class="hero-metrics__badge">NEW</span>
            <template v-if="!metric.value">
              <div class="hero-metrics__stars" aria-hidden="true">
                <div class="hero-metrics__stars-field" />
              </div>
              <div class="hero-metrics__glow" aria-hidden="true">
                <div class="hero-metrics__circle" />
                <div class="hero-metrics__circle" />
              </div>
            </template>
          </div>
        </div>

        <div class="hero-actions">
          <a class="button button--primary" :href="withBase(props.hero.ctaHref)">
            <span class="button__label">{{ props.hero.cta }}</span>
            <span class="button__clip" aria-hidden="true">
              <span class="button__corner button__corner--left-top" />
              <span class="button__corner button__corner--right-bottom" />
              <span class="button__corner button__corner--right-top" />
              <span class="button__corner button__corner--left-bottom" />
            </span>
            <span class="button__arrow button__arrow--right" aria-hidden="true" />
            <span class="button__arrow button__arrow--left" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
