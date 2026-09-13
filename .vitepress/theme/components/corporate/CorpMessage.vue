<script setup lang="ts">
import { withBase } from "vitepress";
import type { HomeContent } from "../../content/homeContent";
import CorpArrowLink from "./CorpArrowLink.vue";
import CorpMultiline from "./CorpMultiline.vue";

defineProps<{ message: HomeContent["message"] }>();
</script>

<template>
  <section class="message">
    <div class="message__glow" aria-hidden="true" />
    <div class="message__inner corp-container">
      <div class="rv">
        <p class="corp-eyebrow message__eyebrow"><span class="corp-eyebrow__line" aria-hidden="true" />{{ message.eyebrow }}</p>
        <blockquote class="message__quote"><CorpMultiline :text="message.quote" /></blockquote>
        <p v-for="paragraph in message.paragraphs" :key="paragraph" class="message__paragraph">{{ paragraph }}</p>
        <div class="message__sign">
          <div class="message__signer">
            <span class="message__role">{{ message.role }}</span>
            <span class="message__signature">
              <img :src="withBase(message.signature)" :alt="message.signatureAlt" width="1200" height="297" loading="lazy" decoding="async" />
            </span>
          </div>
          <CorpArrowLink class="message__more" :href="message.linkHref" :label="message.linkLabel" />
        </div>
      </div>
      <figure class="message__figure rv">
        <img
          class="message__image"
          :src="withBase(message.image)"
          :alt="message.imageAlt"
          width="1376"
          height="768"
          loading="lazy"
          decoding="async"
        />
        <figcaption class="message__caption">
          <span class="message__values-title">{{ message.valuesTitle }}</span>
          <span v-for="value in message.values" :key="value" class="message__value">
            <span class="message__value-dot" aria-hidden="true" />
            {{ value }}
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.message {
  position: relative;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  background: #070c11;
  overflow: hidden;
}

.message__glow {
  position: absolute;
  top: -20%;
  left: -6%;
  width: 34rem;
  height: 34rem;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(24, 95, 159, 0.18), transparent 68%);
  filter: blur(55px);
  pointer-events: none;
}

.message__inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
  padding: clamp(4.5rem, 9vw, 8rem) 0;
}

.message .message__eyebrow {
  margin-bottom: 1.4rem;
}

.message__quote {
  margin: 0 0 1.8rem;
  font-size: clamp(1.35rem, 2.4vw, 2.1rem);
  font-weight: 700;
  font-style: italic;
  line-height: 1.65;
  color: #fff;
  text-wrap: balance;
}

.message__paragraph {
  margin: 0 0 1.1rem;
  font-size: 0.93rem;
  font-weight: 300;
  line-height: 2;
  color: rgba(248, 243, 235, 0.8);
  text-wrap: pretty;
}

.message__paragraph:last-of-type {
  margin-bottom: 2rem;
}

.message__sign {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.message__signer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message__role {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: rgba(175, 208, 238, 0.9);
}

.message__signature {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0;
}

.message__signature img {
  display: block;
  max-width: 210px;
  width: 100%;
  height: auto;
}

.message .message__more {
  margin-left: auto;
}

.message__figure {
  margin: 0;
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
  overflow: hidden;
}

.message__image {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0.9;
}

.message__caption {
  padding: 1rem 1.3rem;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
}

.message__values-title {
  display: block;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(175, 208, 238, 0.95);
  margin-bottom: 0.6rem;
}

.message__value {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.32rem 0;
  font-size: 0.78rem;
  font-weight: 300;
  line-height: 1.75;
  color: rgba(248, 243, 235, 0.74);
  text-wrap: pretty;
}

.message__value-dot {
  flex: none;
  width: 4px;
  height: 4px;
  margin-top: 0.5rem;
  background: #6fa9de;
}

@media (max-width: 760px) {
  .message__inner {
    grid-template-columns: 1fr;
  }
}
</style>
