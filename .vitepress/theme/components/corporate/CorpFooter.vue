<script setup lang="ts">
import logoMark from "../../assets/uo-logo-pure.png";
import type { HomeContent } from "../../content/homeContent";
import { LOCALE_MENU } from "../../content/homeUi";
import type { Locale } from "../../content/siteCopy";
import { isExternalUrl, linkAttrs } from "../../utils/linkAttrs";

defineProps<{
  brand: HomeContent["brand"];
  footer: HomeContent["footer"];
  locale: Locale;
  localeLinks: Record<Locale, string>;
}>();
</script>

<template>
  <footer class="footer">
    <div class="footer__inner corp-container">
      <div class="footer__top">
        <div>
          <a class="footer__brand" href="#top" target="_self">
            <img class="footer__logo" :src="logoMark" alt="" width="591" height="591" />
            <span class="footer__brand-text">
              <span class="footer__brand-name">{{ brand.name }}</span>
              <span class="footer__brand-sub">{{ brand.sub }}</span>
            </span>
          </a>
          <div v-for="row in footer.info" :key="row.label" class="footer__info">
            <span class="footer__info-label">{{ row.label }}</span>
            <span class="footer__info-value">{{ row.value }}</span>
          </div>
          <a v-if="footer.mapUrl" class="footer__map" v-bind="linkAttrs(footer.mapUrl)">
            {{ footer.mapLabel }}
            <svg class="footer__map-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </a>
        </div>
        <nav v-for="column in footer.columns" :key="column.title" class="footer__column" :aria-label="column.title">
          <span class="footer__column-title">{{ column.title }}</span>
          <a v-for="link in column.links" :key="link.href" class="footer__link" v-bind="linkAttrs(link.href)">{{ link.label }}</a>
        </nav>
      </div>

      <div class="footer__shops">
        <span class="footer__shops-title">{{ footer.shopsTitle }}</span>
        <div class="footer__shop-list">
          <component
            :is="shop.url ? 'a' : 'span'"
            v-for="shop in footer.shops"
            :key="shop.label"
            class="footer__shop"
            v-bind="linkAttrs(shop.url)"
          >
            {{ shop.label }}
            <svg v-if="isExternalUrl(shop.url)" class="footer__shop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </component>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__legal">
          <span class="footer__copyright">{{ footer.copyright }}</span>
          <a v-if="footer.privacyUrl" class="footer__privacy" v-bind="linkAttrs(footer.privacyUrl)">{{ footer.privacyLabel }}</a>
        </div>
        <div class="footer__locales">
          <a
            v-for="item in LOCALE_MENU"
            :key="item.locale"
            class="footer__locale"
            :class="{ 'is-active': item.locale === locale }"
            :href="localeLinks[item.locale]"
            :aria-current="item.locale === locale ? 'page' : undefined"
          >{{ item.name }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  border-top: 1px solid rgba(199, 215, 231, 0.12);
  background: #030507;
}

.footer__inner {
  padding: clamp(3rem, 6vw, 5rem) 0 clamp(1.5rem, 3vw, 2.5rem);
}

.footer__top {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 1fr));
  gap: clamp(1.8rem, 4vw, 3.5rem);
  margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
}

.footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.3rem;
}

.footer__logo {
  width: 2.6rem;
  height: auto;
}

.footer__brand-text {
  display: inline-flex;
  flex-direction: column;
  gap: 0.22rem;
}

.footer__brand-name {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  color: #eef6fd;
}

.footer__brand-sub {
  font-family: "Orbitron", sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  color: rgba(190, 216, 240, 0.95);
}

.footer__info {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  gap: 0.8rem;
  padding: 0.32rem 0;
}

.footer__info-label {
  font-size: 0.76rem;
  color: rgba(175, 208, 238, 0.88);
}

.footer__info-value {
  font-size: 0.78rem;
  line-height: 1.65;
  color: rgba(248, 243, 235, 0.78);
  text-wrap: pretty;
}

.footer__map {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.8rem;
  font-size: 0.76rem;
  color: #6fa9de;
}

.footer__map:hover {
  color: #9ec8ec;
}

.footer__map-icon {
  width: 0.62rem;
  height: 0.62rem;
}

.footer__column {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.footer__column-title {
  font-family: "Orbitron", sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: rgba(190, 216, 240, 0.95);
  padding-bottom: 0.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
}

.footer__link {
  font-size: 0.81rem;
  line-height: 1.55;
  color: rgba(248, 243, 235, 0.72);
  transition: color 0.2s ease;
}

.footer__link:hover {
  color: #9ec8ec;
}

.footer__shops {
  padding: 1.5rem 0;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
  margin-bottom: 1.5rem;
}

.footer__shops-title {
  display: block;
  font-family: "Orbitron", "Noto Sans JP", sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  color: rgba(190, 216, 240, 0.95);
  margin-bottom: 0.9rem;
}

.footer__shop-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer__shop {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.8rem;
  border: 1px solid rgba(199, 215, 231, 0.16);
  font-size: 0.74rem;
  color: rgba(232, 241, 249, 0.8);
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

a.footer__shop:hover {
  border-color: rgba(120, 175, 225, 0.5);
  color: #fff;
  background: rgba(24, 95, 159, 0.14);
}

.footer__shop-icon {
  width: 0.62rem;
  height: 0.62rem;
  opacity: 0.6;
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.footer__legal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.4rem;
}

.footer__copyright {
  font-size: 0.73rem;
  color: rgba(248, 243, 235, 0.58);
}

.footer__privacy {
  font-size: 0.73rem;
  color: rgba(248, 243, 235, 0.66);
  border-bottom: 1px dashed rgba(199, 215, 231, 0.3);
}

.footer__privacy:hover {
  color: #9ec8ec;
}

.footer__locales {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.footer__locale {
  padding: 0.35rem 0.7rem;
  border: 1px solid rgba(199, 215, 231, 0.14);
  font-size: 0.72rem;
  color: rgba(248, 243, 235, 0.66);
}

.footer__locale:hover {
  color: #fff;
  border-color: rgba(199, 215, 231, 0.3);
}

/* 放在 :hover 后面：当前语言悬停时保持选中样式（设计稿行为） */
.footer__locale.is-active {
  border-color: rgba(120, 175, 225, 0.4);
  background: rgba(24, 95, 159, 0.16);
  color: #eef6fd;
}

@media (max-width: 760px) {
  .footer__top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .footer__top {
    grid-template-columns: 1fr;
  }
}
</style>
