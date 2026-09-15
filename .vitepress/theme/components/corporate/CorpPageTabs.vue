<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";
import type { PageTab } from "../../content/pageNav";

const props = defineProps<{ tabs: PageTab[]; label: string }>();
const listRef = ref<HTMLElement | null>(null);

// 手机上页签是横向滚动的：把当前页签的文字滚到和内容左边缘对齐（第一个页签的文字就在这个位置），站内切换页面后也执行
const revealCurrent = () => {
  const list = listRef.value;
  const current = list?.querySelector<HTMLElement>(".is-current");
  if (list && current) list.scrollLeft = Math.max(0, current.offsetLeft + parseFloat(getComputedStyle(current).paddingLeft));
};

onMounted(revealCurrent);
watch(() => props.tabs.find((tab) => tab.current)?.path, revealCurrent, { flush: "post" });
</script>

<template>
  <nav class="page-tabs" :aria-label="label">
    <div ref="listRef" class="page-tabs__list corp-container">
      <template v-for="tab in tabs" :key="tab.path">
        <span v-if="tab.groupStart" class="page-tabs__divider" aria-hidden="true" />
        <a
          class="page-tabs__tab"
          :class="{ 'is-current': tab.current }"
          :href="withBase(tab.path)"
          :target="tab.path.startsWith('#') ? '_self' : undefined"
          :aria-current="tab.current ? 'page' : undefined"
        ><span class="page-tabs__no" aria-hidden="true">{{ tab.no }}</span>{{ tab.label }}</a>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.page-tabs {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
  background: rgba(5, 8, 9, 0.92);
}

.page-tabs__list {
  position: relative;
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scrollbar-width: none;
}

.page-tabs__list::-webkit-scrollbar {
  display: none;
}

.page-tabs__tab {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 1.05rem 1.1rem;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  color: rgba(248, 243, 235, 0.64);
  transition: color 0.2s ease;
}

.page-tabs__tab:first-child {
  padding-left: 0;
}

.page-tabs__tab:hover {
  color: #fff;
}

.page-tabs__no {
  font-family: "Orbitron", sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: rgba(111, 169, 222, 0.55);
}

.page-tabs__tab.is-current {
  color: #fff;
  font-weight: 700;
}

.page-tabs__tab.is-current .page-tabs__no {
  color: #6fa9de;
}

.page-tabs__tab.is-current::after {
  content: "";
  position: absolute;
  left: 1.1rem;
  right: 1.1rem;
  bottom: -1px;
  height: 2px;
  background: #6fa9de;
  box-shadow: 0 0 12px rgba(111, 169, 222, 0.7);
}

.page-tabs__tab.is-current:first-child::after {
  left: 0;
}

.page-tabs__divider {
  flex: none;
  width: 1px;
  margin: 0.9rem 0.5rem;
  background: rgba(199, 215, 231, 0.16);
}

/* 手机：右端渐隐，提示可以左右滑 */
@media (max-width: 760px) {
  .page-tabs__list {
    -webkit-mask-image: linear-gradient(90deg, #000 80%, transparent);
    mask-image: linear-gradient(90deg, #000 80%, transparent);
  }

  /* 渐隐区固定盖住可见区域右侧 20%；列表末尾留同样宽的空白，最后一个页签才能整个滚出渐隐区 */
  .page-tabs__list::after {
    content: "";
    flex: none;
    width: 20%;
  }
}
</style>
