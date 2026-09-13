<script setup lang="ts">
import { computed } from "vue";
import { useShaderBackground } from "../../composables/useShaderBackground";
import type { HomeContent, Pillar } from "../../content/homeContent";

const props = defineProps<{ hero: HomeContent["hero"]; pillars: Pillar[] }>();

const { canvasRef, isSupported } = useShaderBackground();
const pillarCount = computed(() => String(props.pillars.length).padStart(2, "0"));
// 横向滚动条要首尾相接，所以把渠道列表复制一份
const channelLoop = computed(() => [...props.hero.channels, ...props.hero.channels]);
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__bg" aria-hidden="true">
      <canvas ref="canvasRef" class="hero__canvas" :class="{ 'is-active': isSupported }" />
      <div class="hero__shade" />
      <div class="hero__lines" />
      <div class="hero__vignette" />
    </div>

    <div class="hero__grid corp-container">
      <div class="hero__copy">
        <p class="hero__kicker">
          <span class="hero__dot" />
          {{ hero.kicker }}
          <span class="hero__rule" />
          {{ hero.kickerSub }}
        </p>
        <h1 class="hero__title">{{ hero.titleLine }}<br /><span class="hero__accent">{{ hero.titleAccent }}</span></h1>
        <p class="hero__lead">{{ hero.lead }}</p>
        <div class="hero__ctas">
          <a class="hero__cta hero__cta--primary" href="#contact" target="_self">
            {{ hero.primaryCta }}
            <svg class="hero__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <a class="hero__cta hero__cta--ghost" href="#business" target="_self">{{ hero.secondaryCta }}</a>
        </div>
        <div class="hero__stats">
          <div v-for="stat in hero.stats" :key="stat.label" class="hero__stat">
            <span class="hero__stat-value">{{ stat.value }}</span>
            <span class="hero__stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <div class="hero__panel">
        <div class="hero__panel-head">
          <span class="hero__panel-title">{{ hero.panelTitle }}</span>
          <span class="hero__panel-count">{{ pillarCount }}</span>
        </div>
        <a v-for="pillar in pillars" :key="pillar.no" class="hero__pillar" href="#business" target="_self">
          <span class="hero__pillar-no">{{ pillar.no }}</span>
          <span class="hero__pillar-text">
            <span class="hero__pillar-title">{{ pillar.title }}</span>
            <span class="hero__pillar-summary">{{ pillar.summary }}</span>
          </span>
          <svg class="hero__pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </a>
        <div class="hero__channels">
          <div class="hero__channels-title">{{ hero.channelsTitle }}</div>
          <div class="hero__marquee">
            <div class="hero__track corp-track">
              <span
                v-for="(name, index) in channelLoop"
                :key="index"
                class="hero__channel"
                :aria-hidden="index >= hero.channels.length ? 'true' : undefined"
              >{{ name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100svh - 4.3rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 600ms ease;
}

.hero__canvas.is-active {
  opacity: 1;
}

.hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, rgba(3, 5, 7, 0.96) 0%, rgba(3, 5, 7, 0.88) 36%, rgba(3, 5, 7, 0.52) 68%, rgba(3, 5, 7, 0.74) 100%);
}

.hero__lines {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(90deg, rgba(134, 187, 235, 0.05) 1px, transparent 1px);
  background-size: 96px 100%;
}

.hero__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 92% 52% at 50% 100%, rgba(3, 5, 7, 0.94), transparent 66%);
}

.hero__grid {
  position: relative;
  z-index: 2;
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
  padding: clamp(2.5rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3.5rem);
}

.hero__copy {
  min-width: 0;
}

.hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 clamp(1.4rem, 3vw, 2rem);
  font-family: "Orbitron", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  color: rgba(210, 228, 244, 0.92);
  animation: corp-rise 0.6s ease-out both;
}

.hero__dot {
  width: 6px;
  height: 6px;
  background: #4e89bf;
  box-shadow: 0 0 10px #4e89bf;
  animation: corp-blink 2.4s ease-in-out infinite;
}

.hero__rule {
  width: 2.2rem;
  height: 1px;
  background: rgba(120, 175, 225, 0.45);
}

.hero__title {
  margin: 0;
  font-size: clamp(2.4rem, 4.6vw, 4.3rem);
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -0.01em;
  color: #fff;
  text-wrap: balance;
  animation: corp-rise 0.7s ease-out 0.08s both;
}

.hero__accent {
  color: #6fa9de;
}

.hero__lead {
  max-width: 34rem;
  margin: clamp(1.3rem, 2.4vw, 1.8rem) 0 0;
  font-size: clamp(0.98rem, 1.1vw, 1.08rem);
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.88);
  text-wrap: pretty;
  animation: corp-rise 0.7s ease-out 0.16s both;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: clamp(1.8rem, 3.5vw, 2.5rem);
  animation: corp-rise 0.7s ease-out 0.24s both;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem 1.9rem;
  font-size: 0.9rem;
  letter-spacing: 0.07em;
}

.hero__cta--primary {
  background: #185f9f;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(120, 175, 225, 0.34), 0 18px 44px rgba(24, 95, 159, 0.32);
  transition: background 0.2s ease, transform 0.2s ease;
}

.hero__cta--primary:hover {
  background: #2277bd;
  transform: translateY(-2px);
  color: #fff;
}

.hero__cta--ghost {
  border: 1px solid rgba(199, 215, 231, 0.26);
  color: #f0f6fc;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.hero__cta--ghost:hover {
  border-color: rgba(199, 215, 231, 0.52);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
  color: #f0f6fc;
}

.hero__cta-icon {
  width: 0.88rem;
  height: 0.88rem;
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: clamp(2.2rem, 4.5vw, 3.2rem);
  background: rgba(199, 215, 231, 0.13);
  border: 1px solid rgba(199, 215, 231, 0.13);
  animation: corp-rise 0.7s ease-out 0.32s both;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.1rem 1.1rem 1.2rem;
  background: rgba(6, 10, 15, 0.86);
}

.hero__stat-value {
  font-family: "Orbitron", sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  font-weight: 700;
  line-height: 1;
  color: #fff;
}

.hero__stat-label {
  font-size: 0.73rem;
  letter-spacing: 0.06em;
  line-height: 1.5;
  color: rgba(248, 243, 235, 0.66);
}

.hero__panel {
  min-width: 0;
  border: 1px solid rgba(199, 215, 231, 0.15);
  background: linear-gradient(165deg, rgba(10, 17, 25, 0.9), rgba(5, 8, 12, 0.85));
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  animation: corp-rise 0.8s ease-out 0.4s both;
}

.hero__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.13);
  background: rgba(24, 95, 159, 0.12);
}

.hero__panel-title {
  font-family: "Orbitron", sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  color: rgba(226, 238, 249, 0.96);
}

.hero__panel-count {
  font-family: "Orbitron", sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  color: rgba(190, 216, 240, 0.95);
}

.hero__pillar {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) 1rem;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.09);
  transition: background 0.22s ease;
}

.hero__pillar:hover {
  background: rgba(24, 95, 159, 0.16);
  color: inherit;
}

.hero__pillar-no {
  font-family: "Orbitron", sans-serif;
  font-size: 0.76rem;
  font-weight: 600;
  color: #6fa9de;
}

.hero__pillar-text {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  min-width: 0;
}

.hero__pillar-title {
  font-size: 0.91rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #fff;
  line-height: 1.35;
}

.hero__pillar-summary {
  font-size: 0.75rem;
  line-height: 1.6;
  color: rgba(248, 243, 235, 0.66);
  text-wrap: pretty;
}

.hero__pillar-icon {
  width: 0.88rem;
  height: 0.88rem;
  color: rgba(160, 196, 228, 0.55);
}

.hero__channels {
  padding: 0.9rem 1.2rem 1.05rem;
  overflow: hidden;
}

.hero__channels-title {
  font-family: "Orbitron", sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  color: rgba(190, 216, 240, 0.95);
  margin-bottom: 0.6rem;
}

.hero__marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

.hero__track {
  display: flex;
  width: max-content;
  gap: 0.45rem;
  animation: corp-marquee 28s linear infinite;
}

.hero__channel {
  flex: none;
  padding: 0.38rem 0.7rem;
  border: 1px solid rgba(199, 215, 231, 0.17);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: rgba(232, 241, 249, 0.82);
  white-space: nowrap;
}

@media (max-width: 1020px) {
  .hero__grid {
    gap: 2rem;
  }

  .hero__title {
    font-size: clamp(2.1rem, 5vw, 3.2rem);
  }
}

@media (max-width: 760px) {
  .hero__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .hero__ctas {
    flex-direction: column;
    align-items: stretch;
  }
}

/* 修复（spec §5-2）：设计稿在 ≤521px、761–1181px 时「2015→2018」会溢出格子，这些宽度下改为上 2 格、下 1 格 */
@media (max-width: 560px), (min-width: 761px) and (max-width: 1240px) {
  .hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero__stat:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
}
</style>
