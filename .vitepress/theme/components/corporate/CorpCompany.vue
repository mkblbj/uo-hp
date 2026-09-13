<script setup lang="ts">
import { withBase } from "vitepress";
import type { HomeContent } from "../../content/homeContent";
import CorpArrowLink from "./CorpArrowLink.vue";
import CorpSectionHead from "./CorpSectionHead.vue";

defineProps<{ company: HomeContent["company"] }>();
</script>

<template>
  <section id="company" class="company">
    <div class="company__inner corp-container">
      <CorpSectionHead :eyebrow="company.eyebrow" :title="company.title" :intro="company.intro" />
      <div class="company__grid">
        <div class="profile rv">
          <div class="profile__head"><span class="corp-cardlabel">{{ company.profileTitle }}</span></div>
          <div v-for="row in company.profile" :key="row.label" class="profile__row">
            <span class="profile__label">{{ row.label }}</span>
            <span class="profile__value">{{ row.value }}</span>
          </div>
          <div class="profile__foot">
            <CorpArrowLink :href="company.profileLinkHref" :label="company.profileLinkLabel" />
          </div>
        </div>
        <div class="company__media rv">
          <figure class="company__figure">
            <img
              class="company__image"
              :src="withBase(company.structureImage)"
              :alt="company.structureAlt"
              width="1376"
              height="768"
              loading="lazy"
              decoding="async"
            />
            <figcaption class="company__caption">{{ company.structureCaption }}</figcaption>
          </figure>
          <div v-if="company.photos.length" class="company__photos">
            <img
              v-for="photo in company.photos"
              :key="photo.image"
              class="company__photo"
              :src="withBase(photo.image)"
              :alt="photo.alt"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div class="history rv">
        <div class="history__head">
          <span class="corp-cardlabel">{{ company.historyTitle }}</span>
          <span class="history__hint">{{ company.historyHint }}</span>
        </div>
        <div class="history__scroller corp-scroll" tabindex="0" role="region" :aria-label="company.historyTitle">
          <div class="history__track">
            <div v-for="item in company.history" :key="item.year" class="history__item">
              <span class="history__year">{{ item.year }}</span>
              <span class="history__title">{{ item.title }}</span>
              <span class="history__desc">{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.company {
  position: relative;
  background: #030507;
}

.company__inner {
  padding: clamp(4.5rem, 9vw, 8rem) 0;
}

.company__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 2.5rem);
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.profile {
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
}

.profile__head {
  padding: 1rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
}

.profile__row {
  display: grid;
  grid-template-columns: 8.5rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.85rem 1.4rem;
  border-bottom: 1px solid rgba(199, 215, 231, 0.07);
}

.profile__label {
  font-size: 0.79rem;
  letter-spacing: 0.05em;
  color: rgba(175, 208, 238, 0.9);
}

.profile__value {
  font-size: 0.83rem;
  font-weight: 400;
  line-height: 1.7;
  color: rgba(248, 243, 235, 0.9);
  text-wrap: pretty;
}

.profile__foot {
  padding: 1rem 1.4rem 1.2rem;
}

.company__media {
  display: flex;
  flex-direction: column;
  gap: clamp(1.2rem, 2.5vw, 1.8rem);
}

.company__figure {
  margin: 0;
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
  overflow: hidden;
}

.company__image {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0.92;
}

.company__caption {
  padding: 0.8rem 1.2rem;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  font-size: 0.74rem;
  line-height: 1.7;
  color: rgba(248, 243, 235, 0.58);
  text-wrap: pretty;
}

.company__photos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 0.6rem;
}

.company__photo {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.history__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.history__hint {
  font-size: 0.78rem;
  color: rgba(248, 243, 235, 0.72);
}

.history__scroller {
  overflow-x: auto;
  padding-bottom: 0.8rem;
  -webkit-overflow-scrolling: touch;
}

.history__track {
  display: flex;
  gap: 1px;
  width: max-content;
  min-width: 100%;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.history__item {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: 15.5rem;
  flex: none;
  padding: 1.4rem 1.3rem 1.6rem;
  background: #050809;
  transition: background 0.3s ease;
}

.history__item:hover {
  background: #0a1219;
}

.history__year {
  font-family: "Orbitron", sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #6fa9de;
}

.history__title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.04em;
}

.history__desc {
  font-size: 0.77rem;
  font-weight: 300;
  line-height: 1.85;
  color: rgba(248, 243, 235, 0.7);
  text-wrap: pretty;
}

@media (max-width: 1020px) {
  .company__grid {
    grid-template-columns: 1fr;
  }
}
</style>
