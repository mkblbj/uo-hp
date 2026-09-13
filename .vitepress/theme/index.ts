import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { defineAsyncComponent } from "vue";
import Layout from "./Layout.vue";
import PerformanceAwardBadges from "./components/PerformanceAwardBadges.vue";
import "./styles/hero.css";
import "./styles/corporate.css";
import "vitepress-markdown-timeline/dist/theme/index.css";

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("PerformanceAwardBadges", PerformanceAwardBadges);
    // 只有带 mermaid 代码块的页面（会社概要）用到，用到时才加载图表库；插件原本的全站注册已在 config.ts 里去掉
    app.component("Mermaid", defineAsyncComponent(() => import("vitepress-plugin-mermaid/Mermaid.vue")));
  },
};

export default theme;
