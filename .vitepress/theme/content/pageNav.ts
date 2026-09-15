import type { HomeContent } from "./homeContent";

/** 页头导航 5 项的文字（取首页后台的「导航文字」） */
export type NavLabels = Pick<HomeContent["nav"], "company" | "business" | "performance" | "tech" | "recruit">;

export interface NavItem {
  href: string;
  label: string;
  /** 当前所在栏目：文字下面显示蓝线 */
  active: boolean;
  /** 链接指向的正是当前页：加 aria-current="page" */
  current: boolean;
}

export type SectionKey = "about" | "services";
export type HeaderKey = "company" | "business" | "performance";

export interface NavPage {
  path: string;
  /** 页签、上一页/下一页、各页卡片上显示的名称 */
  label: string;
}

export interface NavSection {
  key: SectionKey;
  /** 面包屑和「〇〇の各ページ」里用的栏目名 */
  label: string;
  /** 页面没填 eyebrow 时，标题区显示的英文小标题 */
  eyebrow: string;
  /** 栏目首页 */
  path: string;
  /** 页签分组：组与组之间画一条细竖线 */
  groups: NavPage[][];
}

export interface PageLink extends NavPage {
  /** 在栏目里的编号：01、02… */
  no: string;
}

export interface PageTab extends PageLink {
  current: boolean;
  /** 第二组及以后每组的第一个页签，前面画分隔线 */
  groupStart: boolean;
}

export interface PageNav {
  section: NavSection;
  isSectionTop: boolean;
  headerKey: HeaderKey;
  tabs: PageTab[];
  /** 栏目首页底部的各页卡片：本栏目除首页以外的页面 */
  sectionPages: PageLink[];
  prev: PageLink | null;
  next: PageLink | null;
}

export interface Crumb {
  label: string;
  /** 没有 path 的一项是当前页 */
  path?: string;
}

/** 日文内页清单。顺序就是页签顺序，也是上一页/下一页的顺序（和改版前的侧栏一致） */
export const JA_SECTIONS: NavSection[] = [
  {
    key: "about",
    label: "会社情報",
    eyebrow: "COMPANY",
    path: "/about/",
    groups: [
      [
        { path: "/about/", label: "会社情報トップ" },
        { path: "/about/profile/", label: "会社概要" },
        { path: "/about/message/", label: "代表挨拶" },
      ],
    ],
  },
  {
    key: "services",
    label: "事業案内",
    eyebrow: "BUSINESS",
    path: "/services/",
    groups: [
      [
        { path: "/services/", label: "事業概要" },
        { path: "/services/mobile-accessories/", label: "スマートフォンアクセサリー事業" },
        { path: "/services/domestic-foods/", label: "国内産食品事業" },
        { path: "/services/oem-wholesale/", label: "OEM・卸 / 越境連携" },
      ],
      [
        { path: "/services/products/", label: "主要商品" },
        { path: "/services/performance/", label: "販売実績" },
        { path: "/services/strengths/", label: "選ばれる理由" },
        { path: "/services/future/", label: "今後の展開" },
      ],
    ],
  },
];

const localizedSections = (locale: "ja" | "zh" | "en"): NavSection[] => {
  if (locale === "ja") return JA_SECTIONS;
  const prefix = `/${locale}`;
  const zh: [string, string[]][] = [
    ["公司信息", ["公司信息首页", "公司概要", "代表致辞"]],
    ["业务介绍", ["业务概览", "手机配件业务", "日本国产食品业务", "OEM、批发 / 跨境协同", "主要产品", "销售业绩", "选择我们的理由", "未来发展"]],
  ];
  const en: [string, string[]][] = [
    ["Company", ["Company Overview", "Company Profile", "Message from the Representative"]],
    ["Services", ["Services Overview", "Smartphone Accessories Business", "Domestic Foods Business", "OEM / Wholesale / Cross-border Coordination", "Key Products", "Sales Performance", "Why Customers Choose Us", "Future Development"]],
  ];
  const labels = locale === "zh" ? zh : en;
  const paths = [
    ["/about/", ["/about/", "/about/profile/", "/about/message/"]],
    ["/services/", ["/services/", "/services/mobile-accessories/", "/services/domestic-foods/", "/services/oem-wholesale/", "/services/products/", "/services/performance/", "/services/strengths/", "/services/future/"]],
  ] as const;
  return paths.map(([sectionPath, pagePaths], sectionIndex) => ({
    key: sectionIndex === 0 ? "about" : "services",
    label: labels[sectionIndex][0],
    eyebrow: sectionIndex === 0 ? "COMPANY" : "BUSINESS",
    path: `${prefix}${sectionPath}`,
    groups: [pagePaths.slice(0, sectionIndex === 0 ? 3 : 4).map((path, i) => ({ path: `${prefix}${path}`, label: labels[sectionIndex][1][i] })), ...(sectionIndex === 0 ? [] : [pagePaths.slice(4).map((path, i) => ({ path: `${prefix}${path}`, label: labels[sectionIndex][1][i + 4] }))])],
  }));
};

const toNo = (index: number) => String(index + 1).padStart(2, "0");

const numbered = (section: NavSection): PageLink[] =>
  section.groups.flat().map((page, index) => ({ ...page, no: toNo(index) }));

/** 全站顺序：会社情報 3 页 → 事業案内 8 页 */
const SITE_ORDER: PageLink[] = JA_SECTIONS.flatMap(numbered);

/** 去掉查询和锚点，把 .html 结尾还原成目录形式，结尾补「/」 */
export const normalizePath = (path: string): string => {
  const pathname = (path.split(/[?#]/, 1)[0] || "/").replace(/(index)?\.html$/, "");
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

/** 是否指向同一页：后台填链接时可能少写结尾斜杠、带 #，字符串直接比较会悄悄失效，统一走 normalizePath 再比较 */
export const isSamePage = (href: string | undefined, currentPath: string | undefined): boolean =>
  Boolean(href) && Boolean(currentPath) && normalizePath(href!) === normalizePath(currentPath!);

/** 按路径算出内页导航；不在清单里的页面（首页、中英文页面等）返回 null */
export const getPageNav = (rawPath: string): PageNav | null => {
  const path = normalizePath(rawPath);
  const locale = path.startsWith("/zh/") ? "zh" : path.startsWith("/en/") ? "en" : "ja";
  const sections = localizedSections(locale);
  const siteOrder = sections.flatMap(numbered);
  const section = sections.find((item) => item.groups.flat().some((page) => page.path === path));
  if (!section) return null;

  const pages = numbered(section);
  // 每组（最后一组除外）结束的位置，就是下一组第一个页签的下标
  let end = 0;
  const groupStarts = new Set(section.groups.slice(0, -1).map((group) => (end += group.length)));
  const order = siteOrder.findIndex((page) => page.path === path);

  return {
    section,
    isSectionTop: path === section.path,
    headerKey: section.key === "about" ? "company" : path.endsWith("/services/performance/") ? "performance" : "business",
    tabs: pages.map((page, index) => ({ ...page, current: page.path === path, groupStart: groupStarts.has(index) })),
    sectionPages: pages.filter((page) => page.path !== section.path),
    prev: siteOrder[order - 1] ?? null,
    next: siteOrder[order + 1] ?? null,
  };
};

/** 面包屑：ホーム / 栏目 / 当前页；栏目首页只有两级 */
export const pageCrumbs = (nav: PageNav, homeLabel: string, title: string): Crumb[] => [
  { label: homeLabel, path: nav.section.path.startsWith("/zh/") ? "/zh/" : nav.section.path.startsWith("/en/") ? "/en/" : "/" },
  ...(nav.isSectionTop ? [] : [{ label: nav.section.label, path: nav.section.path }]),
  { label: title },
];

/** 首页页头：前四项是在首页内滚动的锚点；採用情報链接到本语言的招聘首页 */
export const homeNavItems = (labels: NavLabels, recruitHref = "/recruit/"): NavItem[] => [
  { href: "#company", label: labels.company, active: false, current: false },
  { href: "#business", label: labels.business, active: false, current: false },
  { href: "#performance", label: labels.performance, active: false, current: false },
  { href: "#tech", label: labels.tech, active: false, current: false },
  { href: recruitHref, label: labels.recruit, active: false, current: false },
];

/** 内页页头：前三项链接到内页；技術・AI 没有内页，回到首页的对应区块；採用情報在招聘首页和各职位页高亮 */
export const innerNavItems = (labels: NavLabels, rawPath: string): NavItem[] => {
  const path = normalizePath(rawPath);
  const prefix = path.startsWith("/zh/") ? "/zh" : path.startsWith("/en/") ? "/en" : "";
  const headerKey = getPageNav(path)?.headerKey;
  const recruit = `${prefix}/recruit/`;
  return [
    { href: `${prefix}/about/`, label: labels.company, active: headerKey === "company", current: path === `${prefix}/about/` },
    { href: `${prefix}/services/`, label: labels.business, active: headerKey === "business", current: path === `${prefix}/services/` },
    {
      href: `${prefix}/services/performance/`,
      label: labels.performance,
      active: headerKey === "performance",
      current: path === `${prefix}/services/performance/`,
    },
    { href: `${prefix}/#tech`, label: labels.tech, active: false, current: false },
    { href: recruit, label: labels.recruit, active: path.startsWith(recruit), current: path === recruit },
  ];
};
