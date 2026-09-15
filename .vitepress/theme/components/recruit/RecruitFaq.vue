<script setup lang="ts">
defineProps<{ items: { q: string; a: string }[]; marks: { q: string; a: string } }>();
</script>

<template>
  <div class="faq">
    <!-- 原生折叠：不开 JavaScript 也能展开；第一条默认展开 -->
    <details v-for="(item, index) in items" :key="index" class="faq__item" :open="index === 0">
      <summary class="faq__q">
        <span class="faq__mark" aria-hidden="true">{{ marks.q }}</span>
        <span class="faq__text">{{ item.q }}</span>
        <svg class="faq__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </summary>
      <div class="faq__a">
        <span class="faq__mark faq__mark--a" aria-hidden="true">{{ marks.a }}</span>
        <p class="faq__answer">{{ item.a }}</p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.faq {
  border: 1px solid rgba(199, 215, 231, 0.12);
  background: #050809;
}

.faq__item + .faq__item {
  border-top: 1px solid rgba(199, 215, 231, 0.1);
}

.faq__q {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 1.15rem 1.4rem;
  list-style: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.7;
  color: #fff;
}

.faq__q::-webkit-details-marker {
  display: none;
}

.faq__q:hover .faq__text {
  color: #9ec8ec;
}

/* Q / A 用正文字体：Orbitron 的 Q 看起来像一个方框 */
.faq__mark {
  flex: none;
  font-size: 0.85rem;
  font-weight: 700;
  color: #6fa9de;
}

.faq__mark--a {
  color: rgba(175, 208, 238, 0.6);
}

.faq__icon {
  flex: none;
  align-self: center;
  width: 0.9rem;
  height: 0.9rem;
  margin-left: auto;
  color: rgba(199, 215, 231, 0.6);
  transition: transform 0.2s ease;
}

.faq__item[open] .faq__icon {
  transform: rotate(45deg);
}

.faq__a {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0 1.4rem 1.3rem;
}

.faq__answer {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.95;
  color: rgba(248, 243, 235, 0.8);
}
</style>
