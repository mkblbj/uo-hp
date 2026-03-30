import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "ja",
  title: "株式会社UO",
  description: "株式会社UOの会社案内、事業分類、市場展開を紹介する情報サイト。",
  cleanUrls: true,
  locales: {
    root: {
      label: "日本語",
      lang: "ja",
      title: "株式会社UO",
      description: "株式会社UOの会社案内、事業分類、市場展開を紹介する情報サイト。",
      themeConfig: {
        nav: [
          { text: "ホーム", link: "/" },
          { text: "会社詳細", link: "/about/" },
          { text: "事業分類", link: "/services/" },
        ],
        sidebar: {
          "/about/": [
            {
              text: "会社詳細",
              items: [{ text: "会社紹介", link: "/about/" }],
            },
          ],
          "/services/": [
            {
              text: "事業分類",
              items: [{ text: "事業概要", link: "/services/" }],
            },
          ],
        },
        outline: {
          level: [2, 3],
          label: "このページの内容",
        },
        docFooter: {
          prev: "前のページ",
          next: "次のページ",
        },
        langMenuLabel: "言語を切り替える",
        returnToTopLabel: "トップに戻る",
        sidebarMenuLabel: "ページナビゲーション",
        darkModeSwitchLabel: "テーマ",
        lightModeSwitchTitle: "ライトモードに切り替える",
        darkModeSwitchTitle: "ダークモードに切り替える",
      },
    },
    zh: {
      label: "中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "株式会社UO",
      description: "展示株式会社UO公司介绍、业务分类与市场布局的信息站点。",
      themeConfig: {
        nav: [
          { text: "首页", link: "/zh/" },
          { text: "公司详情", link: "/zh/about/" },
          { text: "业务分类", link: "/zh/services/" },
        ],
        sidebar: {
          "/zh/about/": [
            {
              text: "公司详情",
              items: [{ text: "公司介绍", link: "/zh/about/" }],
            },
          ],
          "/zh/services/": [
            {
              text: "业务分类",
              items: [{ text: "服务概览", link: "/zh/services/" }],
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
        langMenuLabel: "切换语言",
        returnToTopLabel: "回到顶部",
        sidebarMenuLabel: "页面导航",
        darkModeSwitchLabel: "主题",
        lightModeSwitchTitle: "切换到浅色模式",
        darkModeSwitchTitle: "切换到深色模式",
      },
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      title: "UO Co., Ltd.",
      description: "An information site for UO Co., Ltd. covering company details, service categories, and market positioning.",
      themeConfig: {
        nav: [
          { text: "Home", link: "/en/" },
          { text: "Company", link: "/en/about/" },
          { text: "Services", link: "/en/services/" },
        ],
        sidebar: {
          "/en/about/": [
            {
              text: "Company",
              items: [{ text: "Overview", link: "/en/about/" }],
            },
          ],
          "/en/services/": [
            {
              text: "Services",
              items: [{ text: "Overview", link: "/en/services/" }],
            },
          ],
        },
        outline: {
          level: [2, 3],
          label: "On this page",
        },
        docFooter: {
          prev: "Previous page",
          next: "Next page",
        },
        langMenuLabel: "Change language",
        returnToTopLabel: "Return to top",
        sidebarMenuLabel: "Page navigation",
        darkModeSwitchLabel: "Theme",
        lightModeSwitchTitle: "Switch to light theme",
        darkModeSwitchTitle: "Switch to dark theme",
      },
    },
  },
});
