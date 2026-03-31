export type Locale = "ja" | "zh" | "en";

export interface Metric {
  isNew?: boolean;
  value?: string;
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
    cta: string;
    ctaHref: string;
  };
}

export const siteCopy: Record<Locale, SiteCopy> = {
  ja: {
    metaTitle: "株式会社UO | 日本市場に、価値ある流れを。",
    navigation: {
      brand: "株式会社UO",
      region: "神戸・日本",
      localeSwitchLabel: "表示言語を切り替える",
      localeNames: {
        ja: "日本語",
        zh: "简体中文",
        en: "English",
      },
    },
    hero: {
      badge: "EC運営 / OEM連携 / 越境サプライチェーン",
      headline: ["暮らしに寄り添う", "価値を。"],
      summary:
        "EC運営と商品開発の知見を活かし、日常に新しい彩りを届けます。",
      metrics: [
        {
          label: "EC運営",
        },
        {
          label: "OEM・加工・卸売",
        },
        {
          label: "越境EC",
        },
        {
          label: "食品EC",
          isNew: true,
        },
        {
          label: "AI・IT活用",
          isNew: true,
        },
      ],
      cta: "会社概要を見る",
      ctaHref: "/about/",
    },
  },
  zh: {
    metaTitle: "株式会社UO | 立足日本市场，让价值顺畅流动。",
    navigation: {
      brand: "株式会社UO",
      region: "神户・日本",
      localeSwitchLabel: "切换显示语言",
      localeNames: {
        ja: "日本語",
        zh: "简体中文",
        en: "English",
      },
    },
    hero: {
      badge: "KOBE, JAPAN | 电商运营 / OEM / 跨境供应链",
      headline: ["传递贴近生活的", "价值。"],
      summary:
        "凭借在电商运营与商品开发方面积累的经验，为日常生活带来新的色彩。",
      metrics: [
        {
          label: "电商运营",
        },
        {
          label: "OEM・加工・批发",
        },
        {
          label: "跨境电商",
        },
        {
          label: "食品电商",
          isNew: true,
        },
        {
          label: "AI・IT 应用",
          isNew: true,
        },
      ],
      cta: "查看公司概要",
      ctaHref: "/zh/about/",
    },
  },
  en: {
    metaTitle: "UO Co., Ltd. | Bringing meaningful flow to the Japanese market.",
    navigation: {
      brand: "株式会社UO",
      region: "Kobe・Japan",
      localeSwitchLabel: "Switch display language",
      localeNames: {
        ja: "日本語",
        zh: "简体中文",
        en: "English",
      },
    },
    hero: {
      badge: "KOBE, JAPAN | EC OPERATION / OEM / CROSS-BORDER TRADE",
      headline: ["Bringing value closer", "to everyday life."],
      summary:
        "Drawing on our expertise in e-commerce operations and product development, we bring new color to the everyday.",
      metrics: [
        {
          label: "EC Operations",
        },
        {
          label: "OEM / Processing / Wholesale",
        },
        {
          label: "Cross-Border EC",
        },
        {
          label: "Food EC",
          isNew: true,
        },
        {
          label: "AI / IT Solutions",
          isNew: true,
        },
      ],
      cta: "View Company Overview",
      ctaHref: "/en/about/",
    },
  },
};
