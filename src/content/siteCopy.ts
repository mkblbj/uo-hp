export type Locale = "ja" | "zh" | "en";

export interface Metric {
  value: string;
  label: string;
}

export interface SiteCopy {
  metaTitle: string;
  navigation: {
    brand: string;
    region: string;
    localeSwitchLabel: string;
    localeNames: Record<Locale, string>;
  };
  hero: {
    badge: string;
    headline: string[];
    summary: string;
    metrics: Metric[];
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta: string;
    secondaryCtaHref: string;
  };
}

const siteHref = "https://www.uoworld.co.jp/";
const contactHref = "https://www.uoworld.co.jp/contact.html";

export const siteCopy: Record<Locale, SiteCopy> = {
  ja: {
    metaTitle: "株式会社UO | 日本市場に、価値ある流れを。",
    navigation: {
      brand: "株式会社UO",
      region: "神戸、日本",
      localeSwitchLabel: "表示言語を切り替える",
      localeNames: {
        ja: "日本語",
        zh: "中文",
        en: "EN",
      },
    },
    hero: {
      badge: "KOBE, JAPAN | EC OPERATION / OEM / CROSS-BORDER TRADE",
      headline: ["日常使いに、", "非日常の彩りを届けたい。"],
      summary:
        "神戸を拠点に、スマートフォンアクセサリーで培ったEC運営力を基盤に、OEMと日中供給連携で暮らしに近い商品を届けます。",
      metrics: [
        {
          value: "2018",
          label: "設立",
        },
        {
          value: "2.1億円",
          label: "2024売上",
        },
        {
          value: "Kobe",
          label: "Japan Base",
        },
      ],
      primaryCta: "お問い合わせ",
      primaryCtaHref: contactHref,
      secondaryCta: "会社サイト",
      secondaryCtaHref: siteHref,
    },
  },
  zh: {
    metaTitle: "株式会社UO | 立足日本市场，让价值顺畅流动。",
    navigation: {
      brand: "株式会社UO",
      region: "神户，日本",
      localeSwitchLabel: "切换显示语言",
      localeNames: {
        ja: "日本語",
        zh: "中文",
        en: "EN",
      },
    },
    hero: {
      badge: "KOBE, JAPAN | 电商运营 / OEM / 跨境供应链",
      headline: ["让日常用品，", "拥有非日常的价值。"],
      summary:
        "以神户为据点，UO 依托手机配件领域积累的电商运营能力，通过 OEM 与中日供应协同，把贴近日常生活的商品带到日本市场。",
      metrics: [
        {
          value: "2018",
          label: "成立",
        },
        {
          value: "2.1亿日元",
          label: "2024营收",
        },
        {
          value: "Kobe",
          label: "日本据点",
        },
      ],
      primaryCta: "联系我们",
      primaryCtaHref: contactHref,
      secondaryCta: "公司主页",
      secondaryCtaHref: siteHref,
    },
  },
  en: {
    metaTitle: "UO Co., Ltd. | Bringing meaningful flow to the Japanese market.",
    navigation: {
      brand: "株式会社UO",
      region: "Kobe, Japan",
      localeSwitchLabel: "Switch display language",
      localeNames: {
        ja: "日本語",
        zh: "中文",
        en: "EN",
      },
    },
    hero: {
      badge: "KOBE, JAPAN | EC OPERATION / OEM / CROSS-BORDER TRADE",
      headline: ["Give everyday items,", "extraordinary value."],
      summary:
        "Based in Kobe, UO brings everyday products to the Japanese market through e-commerce expertise built in smartphone accessories, supported by OEM production and cross-border supply coordination.",
      metrics: [
        {
          value: "2018",
          label: "Founded",
        },
        {
          value: "JPY 210M",
          label: "2024 Revenue",
        },
        {
          value: "Kobe",
          label: "Japan Base",
        },
      ],
      primaryCta: "Contact Us",
      primaryCtaHref: contactHref,
      secondaryCta: "Company Site",
      secondaryCtaHref: siteHref,
    },
  },
};
