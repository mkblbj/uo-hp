<script setup lang="ts">
import { computed } from "vue";
import { useLocale } from "../../composables/useLocale";
import { getHomeContent } from "../../content/homeContent";
import { getHomeUi } from "../../content/homeUi";

// 会社概要「基本情報」：和首页「会社情報・沿革 → 基本情報」是同一份数据，只在后台首页改一处。
// 样式沿用正文表格（corporate-prose.css 的 .corp-prose table）；Markdown 区块中间的说明文字是插槽内容，这里不渲染
const { locale } = useLocale();
const rows = computed(() => getHomeContent(locale.value).company.profile);
const head = computed(() => getHomeUi(locale.value).profileHead);
</script>

<template>
  <table class="corp-profile-table">
    <thead>
      <tr>
        <th scope="col">{{ head.label }}</th>
        <th scope="col">{{ head.value }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.label">
        <td>{{ row.label }}</td>
        <td>{{ row.value }}</td>
      </tr>
    </tbody>
  </table>
</template>
