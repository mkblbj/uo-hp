import type { HomeContent } from "./homeContent";

/** 页头导航 4 项的文字（取首页后台的「导航文字」） */
export type NavLabels = Pick<HomeContent["nav"], "company" | "business" | "performance" | "tech">;

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

/** 按路径算出内页导航；不在清单里的页面（首页、中英文页面等）返回 null */
export const getPageNav = (rawPath: string): PageNav | null => {
  const path = normalizePath(rawPath);
  const section = JA_SECTIONS.find((item) => item.groups.flat().some((page) => page.path === path));
  if (!section) return null;

  const pages = numbered(section);
  // 每组（最后一组除外）结束的位置，就是下一组第一个页签的下标
  let end = 0;
  const groupStarts = new Set(section.groups.slice(0, -1).map((group) => (end += group.length)));
  const order = SITE_ORDER.findIndex((page) => page.path === path);

  return {
    section,
    isSectionTop: path === section.path,
    headerKey: section.key === "about" ? "company" : path === "/services/performance/" ? "performance" : "business",
    tabs: pages.map((page, index) => ({ ...page, current: page.path === path, groupStart: groupStarts.has(index) })),
    sectionPages: pages.filter((page) => page.path !== section.path),
    prev: SITE_ORDER[order - 1] ?? null,
    next: SITE_ORDER[order + 1] ?? null,
  };
};

/** 面包屑：ホーム / 栏目 / 当前页；栏目首页只有两级 */
export const pageCrumbs = (nav: PageNav, homeLabel: string, title: string): Crumb[] => [
  { label: homeLabel, path: "/" },
  ...(nav.isSectionTop ? [] : [{ label: nav.section.label, path: nav.section.path }]),
  { label: title },
];

/** 首页页头：在首页内滚动的锚点（和改版前完全一样） */
export const homeNavItems = (labels: NavLabels): NavItem[] => [
  { href: "#company", label: labels.company, active: false, current: false },
  { href: "#business", label: labels.business, active: false, current: false },
  { href: "#performance", label: labels.performance, active: false, current: false },
  { href: "#tech", label: labels.tech, active: false, current: false },
];

/** 内页页头：前三项链接到内页；技術・AI 没有内页，回到首页的对应区块 */
export const innerNavItems = (labels: NavLabels, rawPath: string): NavItem[] => {
  const path = normalizePath(rawPath);
  const headerKey = getPageNav(path)?.headerKey;
  return [
    { href: "/about/", label: labels.company, active: headerKey === "company", current: path === "/about/" },
    { href: "/services/", label: labels.business, active: headerKey === "business", current: path === "/services/" },
    {
      href: "/services/performance/",
      label: labels.performance,
      active: headerKey === "performance",
      current: path === "/services/performance/",
    },
    { href: "/#tech", label: labels.tech, active: false, current: false },
  ];
};
