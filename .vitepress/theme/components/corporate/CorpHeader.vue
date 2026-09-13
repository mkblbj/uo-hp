<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import logoMark from "../../assets/uo-logo-pure.png";
import type { HomeContent } from "../../content/homeContent";
import type { HomeUi } from "../../content/homeUi";
import type { Locale } from "../../content/siteCopy";
import CorpLangMenu from "./CorpLangMenu.vue";

const props = defineProps<{
  brand: HomeContent["brand"];
  nav: HomeContent["nav"];
  ui: HomeUi;
  locale: Locale;
  localeLinks: Record<Locale, string>;
}>();

const menuOpen = ref(false);

const navItems = computed(() => [
  { href: "#company", label: props.nav.company },
  { href: "#business", label: props.nav.business },
  { href: "#performance", label: props.nav.performance },
  { href: "#tech", label: props.nav.tech },
]);

const closeMenu = () => {
  menuOpen.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeMenu();
};

onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
  <header class="header">
    <div class="header__bar corp-container" data-corp-bar>
      <a class="header__brand" href="#top" target="_self">
        <img class="header__logo" :src="logoMark" alt="" width="591" height="591" />
        <span class="header__brand-text">
          <span class="header__brand-name">{{ brand.name }}</span>
          <span class="header__brand-sub">{{ brand.sub }}</span>
        </span>
      </a>

      <nav class="header__nav" :aria-label="ui.mainNavLabel">
        <a v-for="item in navItems" :key="item.href" class="header__nav-link" :href="item.href" target="_self">{{ item.label }}</a>
      </nav>

      <div class="header__actions">
        <CorpLangMenu :active-locale="locale" :links="localeLinks" :label="ui.langLabel" />
        <a class="header__cta" href="#contact" target="_self">
          {{ nav.contact }}
          <svg class="header__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
        <button
          type="button"
          class="header__burger"
          :aria-label="ui.menuLabel"
          aria-controls="corp-mobile-nav"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          @click="menuOpen = !menuOpen"
        >
          <svg class="header__burger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </div>

    <nav v-show="menuOpen" id="corp-mobile-nav" class="header__mobile" :aria-label="ui.menuLabel">
      <div class="header__mobile-inner corp-container">
        <a v-for="item in navItems" :key="item.href" class="header__mobile-link" :href="item.href" target="_self" @click="closeMenu">{{ item.label }}</a>
        <a class="header__mobile-link header__mobile-link--cta" href="#contact" target="_self" @click="closeMenu">{{ nav.contact }}</a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
  background: rgba(3, 5, 7, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.95rem 0;
}

.header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  flex: none;
}

.header__logo {
  width: 2.3rem;
  height: auto;
  filter: drop-shadow(0 0 16px rgba(24, 95, 159, 0.4));
}

.header__brand-text {
  display: inline-flex;
  flex-direction: column;
  gap: 0.2rem;
}

.header__brand-name {
  font-size: 0.97rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.09em;
  color: #eef6fd;
}

.header__brand-sub {
  font-family: "Orbitron", sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  line-height: 1;
  color: rgba(190, 216, 240, 0.95);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.header__nav-link {
  padding: 0.55rem 0.9rem;
  color: rgba(248, 243, 235, 0.82);
  transition: color 0.2s ease, background 0.2s ease;
}

.header__nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: none;
}

.header__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.62rem 1.15rem;
  background: #185f9f;
  color: #fff;
  font-size: 0.83rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 0 0 1px rgba(120, 175, 225, 0.32);
  transition: background 0.2s ease, transform 0.2s ease;
}

.header__cta:hover {
  background: #2277bd;
  transform: translateY(-1px);
  color: #fff;
}

.header__cta-icon {
  width: 0.76rem;
  height: 0.76rem;
}

.header__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
  border: 1px solid rgba(199, 215, 231, 0.2);
  background: rgba(255, 255, 255, 0.03);
  color: #f8f3eb;
  cursor: pointer;
}

.header__burger-icon {
  width: 1.05rem;
  height: 1.05rem;
}

.header__mobile {
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  background: rgba(4, 7, 10, 0.98);
  animation: corp-rise 0.2s ease-out both;
}

.header__mobile-inner {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0 1rem;
}

.header__mobile-link {
  padding: 0.85rem 0.2rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.08);
  font-size: 0.92rem;
  color: rgba(248, 243, 235, 0.88);
}

/* 设计稿里手机菜单的最后一项没有下边线；CTA 项默认隐藏，所以倒数第 2 项才是可见的最后一项 */
.header__mobile-link:nth-last-child(2) {
  border-bottom: none;
}

.header__mobile-link--cta {
  display: none;
}

@media (max-width: 1180px) {
  .header__nav {
    gap: 0;
    font-size: 0.8rem;
  }

  .header__nav-link {
    padding: 0.5rem 0.58rem;
  }
}

@media (max-width: 880px) {
  .header__nav {
    display: none;
  }

  .header__burger {
    display: inline-flex;
  }
}

@media (min-width: 881px) {
  .header__mobile {
    display: none;
  }
}

/* 修复：窄屏时页头 CTA 收进菜单，避免菜单按钮被挤出屏幕 */
@media (max-width: 520px) {
  .header__cta {
    display: none;
  }

  .header__mobile-link:nth-last-child(2) {
    border-bottom: 1px solid rgba(199, 215, 231, 0.08);
  }

  .header__mobile-link--cta {
    display: block;
    border-bottom: none;
    font-weight: 700;
    color: #9ec8ec;
  }
}

@media (max-width: 374px) {
  .header__bar {
    gap: 0.75rem;
  }

  .header__actions {
    gap: 0.4rem;
  }
}
</style>
