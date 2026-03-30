import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "株式会社UO",
  description: "株式会社UO 的公司介绍、业务分类与市场布局信息站点。",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "公司详情", link: "/about/" },
      { text: "业务分类", link: "/services/" },
      { text: "联系我们", link: "https://www.uoworld.co.jp/contact.html" },
    ],
    sidebar: {
      "/about/": [
        {
          text: "公司详情",
          items: [{ text: "公司介绍", link: "/about/" }],
        },
      ],
      "/services/": [
        {
          text: "业务分类",
          items: [{ text: "服务概览", link: "/services/" }],
        },
      ],
    },
    outline: {
      level: [2, 3],
      label: "本页内容",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "页面导航",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
});
