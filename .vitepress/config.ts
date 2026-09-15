import { defineConfig } from "vitepress";
import timeline from "vitepress-markdown-timeline";
import { withMermaid } from "vitepress-plugin-mermaid";
import { corpContainers, corpSections } from "./markdown/corpMarkdown";
import type { PageData } from "vitepress";
import { loadRecruit, readHomeBasics } from "./recruit/source";
import { jobPostingJsonLd, jsonLdScript } from "./theme/content/recruitJsonLd";
import { getRecruitUi } from "./theme/content/recruitUi";

const siteBase = "/";
const withSiteBase = (path: string) => `${siteBase}${path.replace(/^\//, "")}`;

// 日文页面（首页和内页）的字体，和首页一直在用的是同一个网址
const CORP_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&family=Orbitron:wght@400;500;600;700&display=swap";
const CORP_ZH_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Orbitron:wght@400;500;600;700&display=swap";
const CORP_EN_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Orbitron:wght@400;500;600;700&display=swap";

const SITE_URL = "https://www.uoworld.net";

const localeOf = (relativePath: string) => (relativePath.startsWith("zh/") ? "zh" : relativePath.startsWith("en/") ? "en" : "ja");

/**
 * 招聘页：招聘首页的描述取后台「页面描述」；职位页的标题、描述按职位设置，
 * 日文职位页另外加 Google 求职搜索用的 JobPosting（同一职位只标一份，中英文页面不加）
 */
const recruitPageData = (pageData: PageData) => {
  const layout = pageData.frontmatter.layout;
  if (layout !== "recruit" && layout !== "recruit-job") return;
  const locale = localeOf(pageData.relativePath);
  const recruit = loadRecruit();
  if (layout === "recruit") {
    pageData.description = recruit.page[locale].description || pageData.description;
    return;
  }
  const job = recruit.jobs[locale].find((item) => item.slug === pageData.params?.job);
  if (!job) return;
  pageData.title = job.title;
  pageData.description = job.summary;
  if (locale !== "ja") return;
  const ui = getRecruitUi("ja");
  const home = readHomeBasics("ja");
  const posting = jobPostingJsonLd({
    job,
    labels: {
      duties: ui.jobSections.duties,
      requirements: ui.jobSections.requirements,
      preferred: ui.jobSections.preferred,
      hours: ui.conditions.hours,
      holidays: ui.conditions.holidays,
      salary: ui.conditions.salary,
      benefits: ui.conditions.benefits,
      trialPeriod: ui.conditions.trialPeriod,
      other: ui.conditions.other,
      pr: ui.jobSections.pr,
    },
    organization: { name: home.name, url: `${SITE_URL}/`, logo: `${SITE_URL}/uo-logo-pure.png` },
    address: home.address,
  });
  if (posting) pageData.frontmatter.head = [...(pageData.frontmatter.head ?? []), ["script", { type: "application/ld+json" }, jsonLdScript(posting)]];
};

const config = defineConfig({
  base: siteBase,
  vite: {
    // 唯一超过 500 kB 的是首页 ACCESS 区按需加载的地图程序（约 1.1 MB，压缩传输约 290 KB）
    build: { chunkSizeWarningLimit: 1200 },
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
  srcExclude: ["docs/**"],
  // 站点地图：方便搜索引擎（包括 Google 求职搜索）发现新增的职位页
  sitemap: { hostname: SITE_URL },
  transformPageData: recruitPageData,
  mermaid: {},
  markdown: {
    // Markdown 图片加 loading="lazy"（中英文页面也生效，只影响加载时机，外观不变）
    image: { lazyLoading: true },
    config: (md) => {
      md.use(timeline);
      // 日文内页的正文结构和 ::: 区块，见 .vitepress/markdown/corpMarkdown.ts
      corpContainers(md);
      corpSections(md);
    },
  },
  locales: {
    root: {
      label: "日本語",
      lang: "ja",
      title: "株式会社UO",
      description: "株式会社UOの会社案内、事業分類、市場展開を紹介する情報サイト。",
      // 日文页面用首页的字体。放在语言设置里而不是 transformHead：
      // 站内从中英文页面跳到日文页面时，VitePress 也会按语言补上这些 head
      head: [
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
        ["link", { rel: "stylesheet", href: CORP_FONTS_URL }],
      ],
      themeConfig: {
        logo: "/uo-logo-pure.png",
        // 日文页面已改用自己的布局（.vitepress/theme/layouts/），这里的导航只剩 404 页在用
        nav: [
          { text: "ホーム", link: "/" },
          { text: "会社情報", link: "/about/" },
          { text: "事業案内", link: "/services/" },
          { text: "販売実績", link: "/services/performance/" },
        ],
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
      head: [
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
        ["link", { rel: "stylesheet", href: CORP_ZH_FONTS_URL }],
      ],
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
      head: [
        ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
        ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
        ["link", { rel: "stylesheet", href: CORP_EN_FONTS_URL }],
      ],
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

// vitepress-plugin-mermaid 默认把图表组件直接写进 VitePress 的入口脚本：每个页面都会下载整个 Mermaid，
// 还会预加载 30 多个图表文件。这里去掉这一步，改在主题里按需注册（.vitepress/theme/index.ts）
const site = withMermaid(config);
const mermaidPlugin = (site.vite?.plugins ?? []).find(
  (plugin) => typeof plugin === "object" && plugin !== null && "name" in plugin && plugin.name === "vite-plugin-mermaid",
) as { transform?: unknown } | undefined;
if (!mermaidPlugin?.transform) {
  throw new Error("vitepress-plugin-mermaid no longer injects its component as expected; revisit the lazy Mermaid setup in .vitepress/config.ts");
}
delete mermaidPlugin.transform;

export default site;
