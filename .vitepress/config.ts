import { defineConfig } from "vitepress";
import timeline from "vitepress-markdown-timeline";
import { withMermaid } from "vitepress-plugin-mermaid";

const isProductionBuild = process.env.NODE_ENV === "production";
const siteBase = "/";
const withSiteBase = (path: string) => `${siteBase}${path.replace(/^\//, "")}`;

const config = defineConfig({
  base: siteBase,
  vite: {
    plugins: [
      {
        name: "admin-rewrite",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const r = req as { url?: string };
            if (r.url === "/admin") {
              (res as any).writeHead(301, { Location: "/admin/" });
              (res as any).end();
              return;
            }
            if (r.url === "/admin/") {
              r.url = "/admin/index.html";
            }
            next();
          });
        },
      },
    ],
  },
  lang: "ja",
  title: "株式会社UO",
  description: "株式会社UOの会社案内サイト。",
  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: withSiteBase("/favicon.ico") }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: withSiteBase("/favicon-32x32.png") }],
    ["link", { rel: "icon", type: "image/png", sizes: "16x16", href: withSiteBase("/favicon-16x16.png") }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: withSiteBase("/apple-touch-icon.png") }],
  ],
  cleanUrls: true,
  mermaid: {},
  markdown: {
    config: (md) => {
      md.use(timeline);
    },
  },
  locales: {
    root: {
      label: "日本語",
      lang: "ja",
      title: "株式会社UO",
      description: "株式会社UOの会社案内、事業分類、市場展開を紹介する情報サイト。",
      themeConfig: {
        logo: "/uo-logo-pure.png",
        nav: [
          { text: "ホーム", link: "/" },
          { text: "会社情報", link: "/about/" },
          { text: "事業案内", link: "/services/" },
          { text: "販売実績", link: "/services/performance/" },
        ],
        sidebar: {
          "/about/": [
            {
              text: "会社情報",
              items: [
                { text: "会社情報トップ", link: "/about/" },
                { text: "会社概要", link: "/about/profile/" },
                { text: "代表挨拶", link: "/about/message/" },
              ],
            },
          ],
          "/services/": [
            {
              text: "事業案内",
              items: [
                { text: "事業概要", link: "/services/" },
                { text: "スマートフォンアクセサリー事業", link: "/services/mobile-accessories/" },
                { text: "国内産食品事業", link: "/services/domestic-foods/" },
                { text: "OEM・卸 / 越境連携", link: "/services/oem-wholesale/" },
              ],
            },
            {
              text: "商品と実績",
              items: [
                { text: "主要商品", link: "/services/products/" },
                { text: "販売実績", link: "/services/performance/" },
                { text: "選ばれる理由", link: "/services/strengths/" },
                { text: "今後の展開", link: "/services/future/" },
              ],
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
        logo: "/uo-logo-pure.png",
        nav: [
          { text: "首页", link: "/zh/" },
          { text: "公司信息", link: "/zh/about/" },
          { text: "业务介绍", link: "/zh/services/" },
        ],
        sidebar: {
          "/zh/about/": [
            {
              text: "公司信息",
              items: [
                { text: "公司信息首页", link: "/zh/about/" },
                { text: "公司概要", link: "/zh/about/profile/" },
                { text: "代表致辞", link: "/zh/about/message/" },
              ],
            },
          ],
          "/zh/services/": [
            {
              text: "业务介绍",
              items: [
                { text: "业务概览", link: "/zh/services/" },
                { text: "手机配件业务", link: "/zh/services/mobile-accessories/" },
                { text: "日本国产食品业务", link: "/zh/services/domestic-foods/" },
                { text: "OEM、批发 / 跨境协同", link: "/zh/services/oem-wholesale/" },
              ],
            },
            {
              text: "产品与业绩",
              items: [
                { text: "主要产品", link: "/zh/services/products/" },
                { text: "销售业绩", link: "/zh/services/performance/" },
                { text: "选择我们的理由", link: "/zh/services/strengths/" },
                { text: "未来发展", link: "/zh/services/future/" },
              ],
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
      title: "株式会社UO",
      description: "An information site for UO Co., Ltd. covering company details, service categories, and market positioning.",
      themeConfig: {
        logo: "/uo-logo-pure.png",
        nav: [
          { text: "Home", link: "/en/" },
          { text: "Company", link: "/en/about/" },
          { text: "Services", link: "/en/services/" },
        ],
        sidebar: {
          "/en/about/": [
            {
              text: "Company",
              items: [
                { text: "Overview", link: "/en/about/" },
                { text: "Company Profile", link: "/en/about/profile/" },
                { text: "Message from the Representative", link: "/en/about/message/" },
              ],
            },
          ],
          "/en/services/": [
            {
              text: "Services",
              items: [
                { text: "Overview", link: "/en/services/" },
                { text: "Smartphone Accessories Business", link: "/en/services/mobile-accessories/" },
                { text: "Domestic Foods Business", link: "/en/services/domestic-foods/" },
                { text: "OEM / Wholesale / Cross-border Coordination", link: "/en/services/oem-wholesale/" },
              ],
            },
            {
              text: "Products & Performance",
              items: [
                { text: "Key Products", link: "/en/services/products/" },
                { text: "Sales Performance", link: "/en/services/performance/" },
                { text: "Why Customers Choose Us", link: "/en/services/strengths/" },
                { text: "Future Development", link: "/en/services/future/" },
              ],
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

export default withMermaid(config);
