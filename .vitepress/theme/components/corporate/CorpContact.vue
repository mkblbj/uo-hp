<script setup lang="ts">
import { computed } from "vue";
import type { HomeContent } from "../../content/homeContent";
import type { HomeUi } from "../../content/homeUi";
import { isSamePage } from "../../content/pageNav";
import { linkAttrs } from "../../utils/linkAttrs";
import CorpMultiline from "./CorpMultiline.vue";

const props = defineProps<{ contact: HomeContent["contact"]; ui: HomeUi; currentPath?: string }>();

// 内页：次按钮指向当前页时不显示（例如在「OEM・卸 / 越境連携」页）；首页不传 currentPath，照常显示
const showSecondary = computed(() => !isSamePage(props.contact.secondaryHref, props.currentPath));

// 后台填了才显示；电话、邮箱做成可点击链接
const details = computed(() => {
  const { tel, email, hours } = props.contact;
  const labels = props.ui.contactLabels;
  const items: { key: string; label: string; value: string; href?: string }[] = [];
  if (tel) items.push({ key: "tel", label: labels.tel, value: tel, href: `tel:${tel.replace(/[^\d+]/g, "")}` });
  if (email) items.push({ key: "email", label: labels.email, value: email, href: `mailto:${email}` });
  if (hours) items.push({ key: "hours", label: labels.hours, value: hours });
  return items;
});
</script>

<template>
  <section id="contact" class="contact">
    <div class="contact__grid-bg" aria-hidden="true" />
    <div class="contact__glow" aria-hidden="true" />
    <div class="contact__inner corp-container">
      <div class="contact__box rv">
        <p class="contact__eyebrow">{{ contact.eyebrow }}</p>
        <h2 class="contact__title"><CorpMultiline :text="contact.title" /></h2>
        <p class="contact__body">{{ contact.body }}</p>
        <div v-if="contact.formUrl || showSecondary" class="contact__ctas">
          <a v-if="contact.formUrl" class="contact__cta contact__cta--primary" v-bind="linkAttrs(contact.formUrl)">
            {{ contact.formLabel }}
            <svg class="contact__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <a v-if="showSecondary" class="contact__cta contact__cta--ghost" v-bind="linkAttrs(contact.secondaryHref)">{{ contact.secondaryLabel }}</a>
        </div>
        <div v-if="details.length" class="contact__details">
          <div v-for="item in details" :key="item.key" class="contact__detail">
            <span class="contact__detail-label">{{ item.label }}</span>
            <a v-if="item.href" class="contact__detail-value" :href="item.href">{{ item.value }}</a>
            <span v-else class="contact__detail-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  background: #070c11;
  overflow: hidden;
}

.contact__grid-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(134, 187, 235, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(134, 187, 235, 0.04) 1px, transparent 1px);
  background-size: 72px 72px;
  -webkit-mask-image: radial-gradient(ellipse 65% 75% at 50% 50%, #000, transparent 78%);
  mask-image: radial-gradient(ellipse 65% 75% at 50% 50%, #000, transparent 78%);
}

.contact__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(90vw, 60rem);
  height: 26rem;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(24, 95, 159, 0.24), transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}

.contact__inner {
  position: relative;
  z-index: 2;
  padding: clamp(4.5rem, 9vw, 8rem) 0;
}

.contact__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}

.contact__eyebrow {
  margin: 0 0 1.3rem;
  font-family: "Orbitron", sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  color: #6fa9de;
}

.contact__title {
  margin: 0 0 1.3rem;
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  font-weight: 900;
  line-height: 1.35;
  color: #fff;
  text-wrap: balance;
}

.contact__body {
  margin: 0 0 2.2rem;
  font-size: clamp(0.93rem, 1.05vw, 1.02rem);
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.78);
  text-wrap: pretty;
}

.contact__ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
}

.contact__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-width: 13rem;
  padding: 1.1rem 2.1rem;
  font-size: 0.93rem;
  letter-spacing: 0.07em;
}

.contact__cta--primary {
  background: #185f9f;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(120, 175, 225, 0.34), 0 20px 50px rgba(24, 95, 159, 0.35);
  transition: background 0.2s ease, transform 0.2s ease;
}

.contact__cta--primary:hover {
  background: #2277bd;
  transform: translateY(-2px);
  color: #fff;
}

.contact__cta--ghost {
  border: 1px solid rgba(199, 215, 231, 0.28);
  color: #f0f6fc;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.contact__cta--ghost:hover {
  border-color: rgba(199, 215, 231, 0.54);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
  color: #f0f6fc;
}

.contact__cta-icon {
  width: 0.88rem;
  height: 0.88rem;
}

.contact__details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1px;
  width: 100%;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
  text-align: left;
}

.contact__detail {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem 1.3rem 1.35rem;
  background: rgba(6, 10, 15, 0.9);
}

.contact__detail-label {
  font-family: "Orbitron", sans-serif;
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  color: rgba(175, 208, 238, 0.92);
}

.contact__detail-value {
  font-size: 0.92rem;
  color: rgba(248, 243, 235, 0.9);
}

a.contact__detail-value:hover {
  color: #9ec8ec;
}

@media (max-width: 760px) {
  .contact__ctas {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
