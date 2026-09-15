<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { withBase } from "vitepress";
import { mailtoHref, type RecruitPage } from "../../content/recruitData";
import type { RecruitUi } from "../../content/recruitUi";

// subject：邮件标题（职位页是「【応募】职位名」）；showSubject 为 true 时在卡片里显示将要使用的标题
const props = defineProps<{ page: RecruitPage; ui: RecruitUi; subject: string; showSubject?: boolean }>();

const mail = computed(() => (props.page.email ? mailtoHref(props.page.email, props.subject) : ""));
const qr = computed(() => (props.page.wechatQr ? withBase(props.page.wechatQr) : ""));

// 复制按钮只在浏览器支持剪贴板时显示：服务器端生成的 HTML 里没有这个按钮，挂载后再判断
const canCopy = ref(false);
const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  canCopy.value = Boolean(navigator.clipboard?.writeText);
});

const copyId = async () => {
  try {
    await navigator.clipboard.writeText(props.page.wechatId);
    copied.value = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied.value = false), 2000);
  } catch {
    // 复制失败时不提示；微信号是普通文字，仍可以手动选中复制
  }
};
</script>

<template>
  <section id="apply" class="apply">
    <div class="apply__grid-bg" aria-hidden="true" />
    <div class="apply__glow" aria-hidden="true" />
    <div class="apply__inner corp-container">
      <div class="apply__head">
        <p class="apply__eyebrow">{{ ui.apply.eyebrow }}</p>
        <h2 class="apply__title">{{ ui.apply.title }}</h2>
        <p v-if="page.applyBody" class="apply__body">{{ page.applyBody }}</p>
      </div>

      <!-- 邮箱、微信号在后台填好之前显示「準備中」，不放假的联系方式 -->
      <div class="apply__cards">
        <div class="apply__card">
          <span class="apply__label">{{ ui.apply.email }}</span>
          <template v-if="page.email">
            <a class="apply__value" :href="mail">{{ page.email }}</a>
            <span v-if="showSubject && subject" class="apply__subject"><b>{{ ui.apply.subjectLabel }}</b>{{ subject }}</span>
            <p v-if="page.emailNote" class="apply__note">{{ page.emailNote }}</p>
            <a class="apply__btn" :href="mail">
              {{ ui.apply.mailButton }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </template>
          <template v-else>
            <span class="apply__value apply__value--pending">{{ ui.apply.pending }}</span>
            <p class="apply__note">{{ ui.apply.pendingNote }}</p>
          </template>
        </div>

        <div class="apply__card">
          <span class="apply__label">{{ ui.apply.wechat }}</span>
          <div class="wechat">
            <img v-if="qr" class="wechat__qr" :src="qr" :alt="ui.apply.qrAlt" width="240" height="240" loading="lazy" />
            <span v-else-if="!page.wechatId" class="wechat__qr wechat__qr--pending" aria-hidden="true">QR</span>
            <div class="wechat__id">
              <span v-if="page.wechatId" class="apply__value">{{ page.wechatId }}</span>
              <span v-else class="apply__value apply__value--pending">{{ ui.apply.pending }}</span>
              <button v-if="page.wechatId && canCopy" type="button" class="apply__btn apply__btn--ghost" @click="copyId">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="1" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>
                {{ ui.apply.copy }}
              </button>
              <span class="apply__copied" aria-live="polite">{{ copied ? ui.apply.copied : "" }}</span>
            </div>
          </div>
          <p class="apply__note">{{ page.wechatId ? page.wechatNote : ui.apply.pendingNote }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 和首页联系区（CorpContact）同样的底色、网格和光晕 */
.apply {
  position: relative;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  background: #070c11;
  overflow: hidden;
}

.apply__grid-bg {
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

.apply__glow {
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

.apply__inner {
  position: relative;
  z-index: 2;
  padding: clamp(4rem, 8vw, 6.5rem) 0;
}

.apply__head {
  max-width: 48rem;
  margin: 0 auto clamp(2.2rem, 4vw, 3rem);
  text-align: center;
}

.apply__eyebrow {
  margin: 0 0 1.3rem;
  font-family: "Orbitron", sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  color: #6fa9de;
}

.apply__title {
  margin: 0 0 1.3rem;
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  font-weight: 900;
  line-height: 1.35;
  color: #fff;
}

.apply__body {
  margin: 0;
  font-size: clamp(0.93rem, 1.05vw, 1.02rem);
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.78);
  text-wrap: pretty;
}

.apply__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  max-width: 58rem;
  margin: 0 auto;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.apply__card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.9rem 2rem 2.1rem;
  background: rgba(6, 10, 15, 0.94);
}

.apply__label {
  font-family: "Orbitron", sans-serif;
  font-size: 0.64rem;
  letter-spacing: 0.18em;
  color: rgba(175, 208, 238, 0.92);
}

.apply__value {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  overflow-wrap: anywhere;
}

a.apply__value:hover {
  color: #9ec8ec;
}

.apply__value--pending {
  color: rgba(248, 243, 235, 0.5);
}

.apply__subject {
  display: block;
  padding: 0.6rem 0.85rem;
  border: 1px dashed rgba(199, 215, 231, 0.22);
  font-size: 0.78rem;
  line-height: 1.7;
  color: rgba(232, 241, 249, 0.82);
}

.apply__subject b {
  margin-right: 0.5rem;
  font-weight: 500;
  color: rgba(175, 208, 238, 0.9);
}

.apply__note {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.85;
  color: rgba(248, 243, 235, 0.66);
}

.apply__btn {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: auto;
  padding: 1rem 1.7rem;
  border: 0;
  background: #185f9f;
  color: #fff;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 0 0 1px rgba(120, 175, 225, 0.34), 0 20px 50px rgba(24, 95, 159, 0.35);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.apply__btn:hover {
  background: #2277bd;
  transform: translateY(-2px);
  color: #fff;
}

.apply__btn svg {
  width: 0.85rem;
  height: 0.85rem;
}

.apply__btn--ghost {
  margin-top: 0;
  padding: 0.7rem 1.1rem;
  border: 1px solid rgba(199, 215, 231, 0.28);
  background: rgba(255, 255, 255, 0.02);
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: none;
  color: #f0f6fc;
}

.apply__btn--ghost:hover {
  border-color: rgba(199, 215, 231, 0.54);
  background: rgba(255, 255, 255, 0.06);
  color: #f0f6fc;
}

.apply__copied {
  min-height: 1.2em;
  font-size: 0.74rem;
  color: #9ec8ec;
}

.wechat {
  display: flex;
  align-items: center;
  gap: 1.3rem;
}

.wechat__qr {
  flex: none;
  width: 7.2rem;
  height: 7.2rem;
  padding: 0.45rem;
  background: #fff;
  object-fit: contain;
}

/* 二维码还没上传：虚线框占位 */
.wechat__qr--pending {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px dashed rgba(199, 215, 231, 0.3);
  background: rgba(255, 255, 255, 0.02);
  font-family: "Orbitron", sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: rgba(199, 215, 231, 0.45);
}

.wechat__id {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  min-width: 0;
}

@media (max-width: 760px) {
  .apply__cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .apply__card {
    padding: 1.5rem 1.3rem 1.7rem;
  }

  .wechat__qr {
    width: 6rem;
    height: 6rem;
  }
}
</style>
