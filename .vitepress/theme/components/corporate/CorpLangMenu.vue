<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Locale } from "../../content/siteCopy";
import { LOCALE_MENU } from "../../content/homeUi";
import { navigateToLocale } from "../../utils/localeNavigation";

const props = defineProps<{ activeLocale: Locale; links: Record<Locale, string>; label: string }>();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const options = computed(() =>
  LOCALE_MENU.map((item) => ({ ...item, href: props.links[item.locale], active: item.locale === props.activeLocale })),
);
const activeCode = computed(() => LOCALE_MENU.find((item) => item.locale === props.activeLocale)?.code ?? "JA");

const close = () => {
  open.value = false;
};

const onLocaleClick = (event: MouseEvent, href: string) => {
  close();
  navigateToLocale(event, href);
};

const onPointerDown = (event: PointerEvent) => {
  if (rootRef.value && event.target instanceof Node && !rootRef.value.contains(event.target)) close();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") close();
};

onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div ref="rootRef" class="lang">
    <button
      type="button"
      class="lang__trigger"
      :aria-label="label"
      aria-controls="corp-lang-menu"
      :aria-expanded="open ? 'true' : 'false'"
      @click="open = !open"
    >
      <span class="lang__code">{{ activeCode }}</span>
      <svg class="lang__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    <div v-show="open" id="corp-lang-menu" class="lang__menu">
      <a
        v-for="item in options"
        :key="item.locale"
        class="lang__item"
        :class="{ 'is-active': item.active }"
        :href="item.href"
        :aria-current="item.active ? 'page' : undefined"
        @click="onLocaleClick($event, item.href)"
      >{{ item.name }}</a>
    </div>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
}

.lang__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.72rem;
  border: 1px solid rgba(199, 215, 231, 0.2);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(248, 243, 235, 0.92);
  font-size: 0.78rem;
  line-height: normal;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.lang__trigger:hover {
  border-color: rgba(199, 215, 231, 0.4);
  background: rgba(255, 255, 255, 0.07);
}

.lang__code {
  font-family: "Orbitron", sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.14em;
}

.lang__chevron {
  width: 0.8rem;
  height: 0.8rem;
  opacity: 0.7;
}

.lang__menu {
  position: absolute;
  top: calc(100% + 0.45rem);
  right: 0;
  z-index: 50;
  width: 10rem;
  border: 1px solid rgba(199, 215, 231, 0.16);
  background: rgba(8, 12, 18, 0.97);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
  animation: corp-rise 0.16s ease-out both;
}

.lang__item {
  display: block;
  padding: 0.6rem 0.85rem;
  font-size: 0.82rem;
  color: rgba(248, 243, 235, 0.8);
}

.lang__item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* 放在 :hover 后面：当前语言悬停时保持选中样式（设计稿行为） */
.lang__item.is-active {
  color: #eef6fd;
  background: rgba(24, 95, 159, 0.2);
  font-weight: 600;
}
</style>
