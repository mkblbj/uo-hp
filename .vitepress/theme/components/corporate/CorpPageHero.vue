<script setup lang="ts">
import { withBase } from "vitepress";
import type { Crumb } from "../../content/pageNav";

// compact：标题字号小一档（职位名比较长）。两个插槽给招聘页用：before-title 放标签，默认插槽放导语下面的信息或按钮
defineProps<{ crumbs: Crumb[]; crumbsLabel: string; eyebrow: string; title: string; lead?: string; compact?: boolean }>();
</script>

<template>
  <section class="page-hero">
    <div class="page-hero__lines" aria-hidden="true" />
    <div class="page-hero__glow" aria-hidden="true" />
    <div class="page-hero__inner corp-container">
      <nav class="page-hero__crumbs" :aria-label="crumbsLabel">
        <ol class="page-hero__crumb-list">
          <li v-for="(crumb, index) in crumbs" :key="index">
            <a v-if="crumb.path" :href="withBase(crumb.path)">{{ crumb.label }}</a>
            <span v-else aria-current="page">{{ crumb.label }}</span>
          </li>
        </ol>
      </nav>
      <p v-if="eyebrow" class="corp-eyebrow"><span class="corp-eyebrow__line" aria-hidden="true" />{{ eyebrow }}</p>
      <slot name="before-title" />
      <h1 class="page-hero__title" :class="{ 'page-hero__title--compact': compact }">{{ title }}</h1>
      <p v-if="lead" class="page-hero__lead">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  background: #030507;
}

/* 首页首屏同款竖线纹理 */
.page-hero__lines {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(90deg, rgba(134, 187, 235, 0.05) 1px, transparent 1px);
  background-size: 96px 100%;
  pointer-events: none;
}

.page-hero__glow {
  position: absolute;
  top: -55%;
  right: -8%;
  width: 52rem;
  height: 36rem;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(24, 95, 159, 0.3), transparent 68%);
  filter: blur(60px);
  pointer-events: none;
}

.page-hero__inner {
  position: relative;
  z-index: 2;
  padding: clamp(2.6rem, 5.5vw, 5rem) 0 clamp(2.6rem, 5vw, 4.2rem);
}

.page-hero__crumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 clamp(1.8rem, 3.4vw, 2.8rem);
  padding: 0;
  list-style: none;
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  color: rgba(248, 243, 235, 0.52);
}

.page-hero__crumb-list li + li::before {
  content: "/";
  margin-right: 0.55rem;
  opacity: 0.45;
}

.page-hero__crumb-list a {
  transition: color 0.2s ease;
}

.page-hero__crumb-list a:hover {
  color: #9ec8ec;
}

.page-hero__crumb-list [aria-current] {
  color: rgba(248, 243, 235, 0.85);
}

.page-hero .corp-eyebrow {
  margin-bottom: 1.2rem;
}

.page-hero__title {
  margin: 0 0 1.1rem;
  font-size: clamp(2.3rem, 4.6vw, 3.9rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.03em;
  color: #fff;
  text-wrap: balance;
}

.page-hero__title--compact {
  max-width: 22em;
  font-size: clamp(1.75rem, 3.4vw, 2.9rem);
  line-height: 1.35;
}

.page-hero__lead {
  margin: 0;
  max-width: 44rem;
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.74);
  text-wrap: pretty;
}
</style>
