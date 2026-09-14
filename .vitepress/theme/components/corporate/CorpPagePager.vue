<script setup lang="ts">
import { withBase } from "vitepress";
import type { PageLink } from "../../content/pageNav";

defineProps<{ prev: PageLink | null; next: PageLink | null; label: string; prevLabel: string; nextLabel: string }>();
</script>

<template>
  <nav v-if="prev || next" class="page-pager" :class="{ 'page-pager--single': !(prev && next) }" :aria-label="label">
    <a v-if="prev" class="page-pager__link" :href="withBase(prev.path)">
      <span class="page-pager__label"><span aria-hidden="true">←</span> {{ prevLabel }}</span>
      <span class="page-pager__title">{{ prev.label }}</span>
    </a>
    <a v-if="next" class="page-pager__link page-pager__link--next" :href="withBase(next.path)">
      <span class="page-pager__label">{{ nextLabel }} <span aria-hidden="true">→</span></span>
      <span class="page-pager__title">{{ next.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.page-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin-top: clamp(3rem, 6vw, 4.5rem);
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

/* 只有一个链接（最后一页只有上一页）时占满一行，不留空格子 */
.page-pager--single {
  grid-template-columns: 1fr;
}

.page-pager__link {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.6rem 1.8rem;
  background: #050809;
  transition: background 0.3s ease;
}

.page-pager__link:hover {
  background: #080e14;
}

.page-pager__link--next {
  align-items: flex-end;
  text-align: right;
}

.page-pager__label {
  font-family: "Orbitron", sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #6fa9de;
}

.page-pager__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}

@media (max-width: 520px) {
  .page-pager {
    grid-template-columns: 1fr;
  }

  .page-pager__link--next {
    align-items: flex-start;
    text-align: left;
  }
}
</style>
