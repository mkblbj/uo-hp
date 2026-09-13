<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import CorpAccess from "../components/corporate/CorpAccess.vue";
import CorpBusiness from "../components/corporate/CorpBusiness.vue";
import CorpCompany from "../components/corporate/CorpCompany.vue";
import CorpContact from "../components/corporate/CorpContact.vue";
import CorpFooter from "../components/corporate/CorpFooter.vue";
import CorpHeader from "../components/corporate/CorpHeader.vue";
import CorpHero from "../components/corporate/CorpHero.vue";
import CorpMessage from "../components/corporate/CorpMessage.vue";
import CorpPerformance from "../components/corporate/CorpPerformance.vue";
import CorpStrengths from "../components/corporate/CorpStrengths.vue";
import CorpTech from "../components/corporate/CorpTech.vue";
import CorpTrust from "../components/corporate/CorpTrust.vue";
import { useCountUp } from "../composables/useCountUp";
import { useLocale } from "../composables/useLocale";
import { useRevealOnScroll } from "../composables/useRevealOnScroll";
import { getHomeContent } from "../content/homeContent";
import { getHomeUi } from "../content/homeUi";
import { mapSearchUrl, parseLatLng } from "../utils/accessMap";

const { locale, localeLinks } = useLocale();
const content = computed(() => getHomeContent(locale.value));
const ui = computed(() => getHomeUi(locale.value));
// 页脚「地図を見る」和地图区的按钮打开同一个位置（按后台的坐标生成）
const footerMapUrl = computed(() => {
  const access = content.value.access;
  return access ? mapSearchUrl(parseLatLng(access.coordinates), access.address) : undefined;
});
const rootRef = ref<HTMLElement | null>(null);

useRevealOnScroll(rootRef);
useCountUp(rootRef);

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// 页内锚点都带 target="_self"，VitePress 路由不会接管，这里自己做平滑滚动
const onAnchorClick = async (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
  const id = link ? decodeURIComponent(link.hash.slice(1)) : "";
  const target = id ? document.getElementById(id) : null;

  if (!link || !target) {
    return;
  }

  event.preventDefault();
  // 等手机菜单之类的收起、页面高度稳定后再滚动，否则落点会偏
  await nextTick();
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

  if (location.hash !== link.hash) {
    history.pushState(null, "", link.hash);
  }

  if (target.hasAttribute("tabindex")) {
    target.focus({ preventScroll: true });
  }
};
</script>

<template>
  <div ref="rootRef" class="corp" @click="onAnchorClick">
    <a class="corp-skip" href="#main" target="_self">{{ ui.skipToContent }}</a>
    <CorpHeader :brand="content.brand" :nav="content.nav" :ui="ui" :locale="locale" :locale-links="localeLinks" />
    <main id="main" tabindex="-1">
      <CorpHero :hero="content.hero" :pillars="content.business.pillars" />
      <CorpTrust :trust="content.trust" />
      <CorpBusiness :business="content.business" :ui="ui" />
      <CorpTech :tech="content.tech" />
      <CorpStrengths :strengths="content.strengths" />
      <CorpPerformance :performance="content.performance" />
      <CorpCompany :company="content.company" />
      <CorpMessage :message="content.message" />
      <CorpContact :contact="content.contact" :ui="ui" />
      <!-- 用部署前打开的旧后台页面保存时，access 可能被丢掉：缺了就不显示地图区，而不是让构建失败 -->
      <CorpAccess v-if="content.access" :access="content.access" :brand-name="content.brand.name" />
    </main>
    <CorpFooter
      :brand="content.brand"
      :footer="content.footer"
      :map-url="footerMapUrl"
      :locale="locale"
      :locale-links="localeLinks"
    />
  </div>
</template>
