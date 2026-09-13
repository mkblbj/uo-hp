<script setup lang="ts">
import { computed, ref } from "vue";
import logoMark from "../../assets/uo-logo-pure.png";
import { useAccessMap } from "../../composables/useAccessMap";
import type { HomeContent } from "../../content/homeContent";
import { directionsUrl, parseLatLng } from "../../utils/accessMap";
import { linkAttrs } from "../../utils/linkAttrs";

const props = defineProps<{ access: HomeContent["access"]; brandName: string }>();

const target = computed(() => parseLatLng(props.access.coordinates));
const routeUrl = computed(() => directionsUrl(target.value, props.access.address));

const section = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const card = ref<HTMLElement | null>(null);
const { status } = useAccessMap({ section, container, card }, () => target.value, { label: props.brandName, logo: logoMark });
</script>

<template>
  <section id="access" ref="section" class="access" aria-labelledby="access-title">
    <div class="access__stage" :class="{ 'is-ready': status === 'ready' }">
      <!-- 地图加载前、加载失败或坐标无效时显示的占位 -->
      <div class="access__placeholder" aria-hidden="true"><span class="access__placeholder-pin" /></div>
      <!-- 地图程序会往这个元素上加自己的 class，所以这里不能用 Vue 的动态 class -->
      <div ref="container" class="access__map" />
    </div>
    <div class="access__overlay">
      <div class="access__inner corp-container">
        <div ref="card" class="access__card rv">
          <p class="corp-eyebrow"><span class="corp-eyebrow__line" aria-hidden="true" />{{ access.eyebrow }}</p>
          <h2 id="access-title" class="access__title">{{ access.title }}</h2>
          <p class="access__name">{{ brandName }}</p>
          <p class="access__address">{{ access.address }}</p>
          <p v-if="access.note" class="access__note">{{ access.note }}</p>
          <div class="access__actions">
            <a v-if="access.mapUrl" class="access__btn access__btn--primary" v-bind="linkAttrs(access.mapUrl)">
              {{ access.mapLabel }}
              <svg class="access__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
            </a>
            <a class="access__btn access__btn--ghost" v-bind="linkAttrs(routeUrl)">
              {{ access.routeLabel }}
              <svg class="access__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 22 2l-9 19-2-8-8-2Z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.access {
  position: relative;
  display: grid;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  background: #030507;
}

/* 地图和卡片叠在同一个格子里：卡片变高时整个区块跟着变高，不会溢出到页脚 */
.access__stage,
.access__overlay {
  grid-area: 1 / 1;
}

.access__stage {
  /* 电脑上地址卡片（25rem）加右侧留白挡住的宽度；占位定位点和手势提示都避开它 */
  --access-card-space: calc(25rem + (100% - min(1440px, 100% - 3rem)) / 2);
  position: relative;
  /* 地图程序里层级很高的元素（手势提示等）只在地图区内叠放，不会盖住地址卡片 */
  isolation: isolate;
  min-height: clamp(28rem, 66vh, 40rem);
  overflow: hidden;
  background: #04080c;
}

.access__placeholder {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(134, 187, 235, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(134, 187, 235, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
}

.access__placeholder-pin {
  position: absolute;
  top: 50%;
  left: calc((100% - var(--access-card-space)) / 2);
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  background: #6fa9de;
  box-shadow: 0 0 0 5px rgba(24, 95, 159, 0.4), 0 0 28px rgba(111, 169, 222, 0.55);
}

.access__map {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.9s ease;
}

.access__stage.is-ready .access__map {
  opacity: 1;
}

.access__overlay {
  position: relative;
  display: flex;
  align-items: center;
  padding: clamp(2rem, 4vw, 3rem) 0;
  pointer-events: none;
}

.access__inner {
  display: flex;
  justify-content: flex-end;
}

.access__card {
  width: min(25rem, 100%);
  padding: clamp(1.6rem, 2.4vw, 2.2rem);
  border: 1px solid rgba(199, 215, 231, 0.14);
  background: rgba(5, 9, 13, 0.9);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.access__title {
  margin: 0 0 1.5rem;
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
  font-weight: 900;
  line-height: 1.3;
  color: #fff;
}

.access__name {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #eef6fd;
}

.access__address {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.8;
  color: rgba(248, 243, 235, 0.82);
  text-wrap: pretty;
}

.access__note {
  margin: 0.9rem 0 0;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  font-size: 0.8rem;
  line-height: 1.8;
  color: rgba(248, 243, 235, 0.68);
  white-space: pre-line;
}

.access__actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1.7rem;
}

.access__btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.95rem 1.2rem;
  font-size: 0.86rem;
  letter-spacing: 0.06em;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.access__btn:hover {
  transform: translateY(-2px);
}

.access__btn--primary {
  background: #185f9f;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(120, 175, 225, 0.34), 0 16px 40px rgba(24, 95, 159, 0.3);
}

.access__btn--primary:hover {
  background: #2277bd;
  color: #fff;
}

.access__btn--ghost {
  border: 1px solid rgba(199, 215, 231, 0.28);
  background: rgba(255, 255, 255, 0.02);
  color: #f0f6fc;
  font-weight: 500;
}

.access__btn--ghost:hover {
  border-color: rgba(199, 215, 231, 0.54);
  background: rgba(255, 255, 255, 0.06);
  color: #f0f6fc;
}

.access__btn-icon {
  flex: none;
  width: 0.9rem;
  height: 0.9rem;
}

/* 以下元素由地图程序生成，不带 scoped 标记，要用 :deep() */
.access :deep(.access-pin) {
  width: 16px;
  height: 16px;
}

.access :deep(.access-pin__dot),
.access :deep(.access-pin__pulse) {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.access :deep(.access-pin__dot) {
  border: 2px solid #eaf4fd;
  background: #6fa9de;
  box-shadow: 0 0 0 4px rgba(24, 95, 159, 0.55), 0 0 24px rgba(111, 169, 222, 0.8);
}

.access :deep(.access-pin__pulse) {
  border: 1px solid rgba(111, 169, 222, 0.8);
  animation: access-pulse 2.4s ease-out infinite;
}

.access :deep(.access-pin__label) {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transform: translateX(-50%);
  padding: 0.3rem 0.7rem 0.3rem 0.45rem;
  border: 1px solid rgba(111, 169, 222, 0.45);
  background: rgba(5, 9, 13, 0.92);
  font-family: "Noto Sans JP", sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #eef6fd;
  white-space: nowrap;
}

.access :deep(.access-pin__logo) {
  display: block;
  width: 18px;
  height: 18px;
}

@keyframes access-pulse {
  from {
    transform: scale(1);
    opacity: 0.9;
  }

  to {
    transform: scale(3.2);
    opacity: 0;
  }
}

/* 地图区的 overflow: hidden 会裁掉画在外侧的焦点框，改画在内侧 */
.access :deep(.maplibregl-canvas:focus-visible) {
  outline-offset: -3px;
}

.access :deep(.maplibregl-ctrl-group) {
  border: 1px solid rgba(199, 215, 231, 0.18);
  border-radius: 0;
  background: rgba(5, 9, 13, 0.9);
  box-shadow: none;
}

.access :deep(.maplibregl-ctrl-group button + button) {
  border-top-color: rgba(199, 215, 231, 0.14);
}

.access :deep(.maplibregl-ctrl-icon) {
  filter: invert(1) brightness(0.9);
}

.access :deep(.maplibregl-ctrl-attrib) {
  background: rgba(3, 5, 7, 0.75);
  color: rgba(248, 243, 235, 0.62);
}

.access :deep(.maplibregl-ctrl-attrib a) {
  color: rgba(175, 208, 238, 0.9);
}

.access :deep(.maplibregl-ctrl-attrib-button) {
  filter: invert(1);
}

.access :deep(.maplibregl-cooperative-gesture-screen) {
  padding-right: calc(1rem + var(--access-card-space));
  background: rgba(3, 5, 7, 0.6);
  font-family: "Noto Sans JP", sans-serif;
  font-size: 1rem;
  letter-spacing: 0.04em;
}

@media (max-width: 1020px) {
  .access__stage {
    --access-card-space: 0px;
    min-height: clamp(20rem, 62vw, 26rem);
  }

  .access__overlay {
    grid-area: 2 / 1;
    display: block;
    padding: 0 0 clamp(3rem, 8vw, 4.5rem);
  }

  .access__card {
    width: 100%;
  }

  /* 窄屏上署名缩小，尽量一行放下，少挡地图 */
  .access :deep(.maplibregl-ctrl-attrib) {
    font-size: 10px;
    line-height: 16px;
  }
}
</style>
