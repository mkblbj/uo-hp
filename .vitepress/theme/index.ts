import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { defineAsyncComponent } from "vue";
import Layout from "./Layout.vue";
import PerformanceAwardBadges from "./components/PerformanceAwardBadges.vue";
import CorpProfileTable from "./components/corporate/CorpProfileTable.vue";
import CorpSalesResults from "./components/corporate/CorpSalesResults.vue";
import { installPageTransitions } from "./utils/pageTransitionClient";
import "./styles/hero.css";
import "./styles/corporate.css";
import "./styles/corporate-prose.css";
import "./styles/page-transition.css";
import "vitepress-markdown-timeline/dist/theme/index.css";

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    // 换页时淡入淡出（浏览器支持才有），见 utils/pageTransitionClient.ts
    installPageTransitions(router);
    app.component("PerformanceAwardBadges", PerformanceAwardBadges);
    // 日文内页 Markdown 里的 ::: company-profile / ::: sales-results 区块会渲染成这两个组件（见 .vitepress/markdown/corpMarkdown.ts）
    app.component("CorpProfileTable", CorpProfileTable);
    app.component("CorpSalesResults", CorpSalesResults);
    // 只有带 mermaid 代码块的页面（中英文会社概要）用到，用到时才加载图表库；插件原本的全站注册已在 config.ts 里去掉
    app.component("Mermaid", defineAsyncComponent(() => import("vitepress-plugin-mermaid/Mermaid.vue")));
  },
};

export default theme;
