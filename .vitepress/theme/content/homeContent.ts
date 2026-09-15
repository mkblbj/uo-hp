import type { Locale } from "./siteCopy";
import ja from "../../../data/home/ja.json" with { type: "json" };
import zh from "../../../data/home/zh.json" with { type: "json" };
import en from "../../../data/home/en.json" with { type: "json" };

export interface LabelValue {
  label: string;
  value: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface Pillar {
  no: string;
  tag: string;
  title: string;
  /** 首屏右侧面板用的一句话简介 */
  summary: string;
  body: string;
  chips: string[];
  href: string;
}

export interface HomeContent {
  brand: { name: string; sub: string };
  nav: { company: string; business: string; performance: string; tech: string; contact: string };
  hero: {
    kicker: string;
    kickerSub: string;
    titleLine: string;
    titleAccent: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    stats: LabelValue[];
    panelTitle: string;
    channelsTitle: string;
    channels: string[];
  };
  trust: { items: LabelValue[]; notes: string[] };
  business: { eyebrow: string; title: string; intro: string; pillars: Pillar[] };
  tech: {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
    linkLabel: string;
    linkHref: string;
    items: { code: string; title: string; desc: string }[];
  };
  strengths: {
    eyebrow: string;
    title: string;
    intro: string;
    reasons: { no: string; title: string; body: string }[];
    coreTitle: string;
    core: { text: string; category: string }[];
  };
  performance: {
    eyebrow: string;
    title: string;
    intro: string;
    resultsTitle: string;
    results: LabelValue[];
    note: string;
    linkLabel: string;
    linkHref: string;
    channelGroups: { platform: string; shops: string[] }[];
    partnersTitle: string;
    partners: { logo: string; name: string; url?: string }[];
  };
  company: {
    eyebrow: string;
    title: string;
    intro: string;
    profileTitle: string;
    profile: LabelValue[];
    profileLinkLabel: string;
    profileLinkHref: string;
    structureImage: string;
    structureAlt: string;
    structureCaption: string;
    photos: { image: string; alt: string }[];
    historyTitle: string;
    historyHint: string;
    history: { year: string; title: string; desc: string }[];
  };
  message: {
    eyebrow: string;
    quote: string;
    paragraphs: string[];
    role: string;
    signature: string;
    signatureAlt: string;
    linkLabel: string;
    linkHref: string;
    image: string;
    imageAlt: string;
    valuesTitle: string;
    values: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    tel?: string;
    email?: string;
    hours?: string;
    formUrl?: string;
    formLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  access: {
    eyebrow: string;
    title: string;
    address: string;
    /** 交通说明（如最近车站），留空则不显示 */
    note?: string;
    /** 「纬度, 经度」，从 Google 地图右键复制；地图定位和 Google 地图、路线两个链接都按它生成 */
    coordinates: string;
    mapLabel: string;
    routeLabel: string;
  };
  footer: {
    info: LabelValue[];
    /** 链接按 access.coordinates 自动生成 */
    mapLabel: string;
    columns: { title: string; links: LinkItem[] }[];
    shopsTitle: string;
    shops: { label: string; url?: string }[];
    copyright: string;
    privacyUrl?: string;
    privacyLabel: string;
  };
}

// 类型标注让 JSON 结构一旦偏离接口，tsc 就会报错
const jaContent: HomeContent = ja;

const contentByLocale: Record<Locale, HomeContent> = { ja: jaContent, zh, en };

/** 首页及内页共享同一语言的公司、业绩、联系与页脚内容。 */
export const getHomeContent = (locale: Locale): HomeContent => contentByLocale[locale];
