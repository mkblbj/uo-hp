<script setup lang="ts">
import { computed, ref } from "vue";
import { useCountUp } from "../../composables/useCountUp";
import { useLocale } from "../../composables/useLocale";
import { getHomeContent } from "../../content/homeContent";
import { parseCountValue } from "../../utils/countValue";

// 販売実績「主な実績」：和首页「販売実績 → 実績」是同一份数据，只在后台首页改一处。
// Markdown 区块中间的说明文字是插槽内容，这里不渲染
const { locale } = useLocale();
const performance = computed(() => getHomeContent(locale.value).performance);
const rootRef = ref<HTMLElement | null>(null);

// 年份（例如「2019年 楽天市場」）从 0 数到 2019 没有意义，不做计数；其余能识别的数字滚动计数，和首页一样
const isYear = (value: string) => /^\d{4}年/.test(value.trim());
const results = computed(() =>
  performance.value.results.map((result) => ({
    ...result,
    count: !isYear(result.value) && parseCountValue(result.value) ? result.value : undefined,
  })),
);
// 项目数是奇数时，注释放进最后一格，正好把 2 列格子补满
const noteInGrid = computed(() => results.value.length % 2 === 1);

// 组件自己挂载计数：站内跳转到这一页时也会重新执行
useCountUp(rootRef);
</script>

<template>
  <div ref="rootRef" class="sales">
    <div class="sales__grid">
      <div v-for="result in results" :key="result.label" class="sales__item">
        <span class="sales__label">{{ result.label }}</span>
        <span class="sales__value" :data-count="result.count">{{ result.value }}</span>
      </div>
      <p v-if="performance.note && noteInGrid" class="sales__item sales__item--note">{{ performance.note }}</p>
    </div>
    <p v-if="performance.note && !noteInGrid" class="sales__note">{{ performance.note }}</p>
  </div>
</template>

<style scoped>
.sales__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: rgba(199, 215, 231, 0.12);
  border: 1px solid rgba(199, 215, 231, 0.12);
}

.sales__item {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0;
  padding: 1.5rem 1.4rem 1.6rem;
  background: #070c11;
}

.sales__label {
  font-size: 0.76rem;
  letter-spacing: 0.05em;
  line-height: 1.5;
  color: rgba(175, 208, 238, 0.9);
}

.sales__value {
  font-family: "Orbitron", var(--corp-font-body);
  font-size: clamp(1.4rem, 2.2vw, 1.95rem);
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
}

.sales__item--note {
  justify-content: center;
  background: #050809;
  font-size: 0.74rem;
  line-height: 1.75;
  color: rgba(248, 243, 235, 0.6);
}

.sales__note {
  margin: 1rem 0 0;
  font-size: 0.74rem;
  line-height: 1.75;
  color: rgba(248, 243, 235, 0.6);
}

@media (max-width: 520px) {
  .sales__grid {
    grid-template-columns: 1fr;
  }
}
</style>
