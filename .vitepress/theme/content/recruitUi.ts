import type { Locale } from "./siteCopy";
import type { CategoryKey, EmploymentType } from "./recruitData";

/** 招聘页上的固定文字（后台不编辑）。「{n}」会换成数字 */
export interface RecruitUi {
  eyebrow: string;
  tabsLabel: string;
  tabs: { positions: string; environment: string; flow: string; faq: string; apply: string };
  sections: { positions: string; environment: string; flow: string; faq: string };
  positionsSub: string;
  facts: { positions: string; positionsCount: string; location: string; apply: string; applyMethods: string };
  categories: Record<CategoryKey, { label: string; eyebrow: string }>;
  employment: Record<EmploymentType, { label: string; short: string }>;
  /** 标签里多个雇用形态之间、表格里多个雇用形态之间的连接符 */
  tagJoin: string;
  listJoin: string;
  meta: { salary: string; hours: string };
  more: string;
  benefitsTitle: string;
  step: string;
  faqMarks: { q: string; a: string };
  jobSections: { duties: string; requirements: string; preferred: string; conditions: string; pr: string };
  conditions: {
    employment: string;
    salary: string;
    hours: string;
    holidays: string;
    trialPeriod: string;
    workplace: string;
    benefits: string;
    other: string;
  };
  cta: { apply: string; list: string; access: string; accessLong: string };
  others: { eyebrow: string; title: string };
  apply: {
    eyebrow: string;
    title: string;
    email: string;
    wechat: string;
    mailButton: string;
    subjectLabel: string;
    subjectPrefix: string;
    copy: string;
    copied: string;
    pending: string;
    pendingNote: string;
    qrAlt: string;
  };
}

const ja: RecruitUi = {
  eyebrow: "RECRUIT",
  tabsLabel: "このページの内容",
  tabs: { positions: "募集職種", environment: "働く環境", flow: "選考の流れ", faq: "よくある質問", apply: "応募方法" },
  sections: { positions: "募集職種", environment: "働く環境・福利厚生", flow: "選考の流れ", faq: "よくある質問" },
  positionsSub: "現在 {n} 職種を募集しています。",
  facts: { positions: "OPEN POSITIONS", positionsCount: "職種", location: "LOCATION", apply: "APPLY", applyMethods: "メール ／ WeChat" },
  categories: {
    logistics: { label: "物流・倉庫", eyebrow: "LOGISTICS" },
    operations: { label: "EC運営", eyebrow: "EC OPERATIONS" },
    design: { label: "デザイン", eyebrow: "DESIGN" },
  },
  employment: {
    fulltime: { label: "正社員", short: "正社員" },
    contract: { label: "契約社員", short: "契約" },
    parttime: { label: "パート・アルバイト", short: "パート" },
  },
  tagJoin: "／",
  listJoin: "、",
  meta: { salary: "給与", hours: "勤務時間" },
  more: "詳しく見る",
  benefitsTitle: "福利厚生・待遇",
  step: "STEP",
  faqMarks: { q: "Q", a: "A" },
  jobSections: { duties: "仕事内容", requirements: "応募条件", preferred: "歓迎条件", conditions: "募集要項", pr: "求人PR" },
  conditions: {
    employment: "雇用形態",
    salary: "給与",
    hours: "勤務時間",
    holidays: "休日・休暇",
    trialPeriod: "試用期間",
    workplace: "勤務地",
    benefits: "待遇・福利厚生",
    other: "その他",
  },
  cta: { apply: "この職種に応募する", list: "募集職種一覧へ", access: "アクセス", accessLong: "アクセスを見る" },
  others: { eyebrow: "OTHER POSITIONS", title: "その他の募集職種" },
  apply: {
    eyebrow: "HOW TO APPLY",
    title: "応募方法",
    email: "EMAIL",
    wechat: "WECHAT",
    mailButton: "メールで応募する",
    subjectLabel: "件名",
    subjectPrefix: "【応募】",
    copy: "IDをコピー",
    copied: "コピーしました",
    pending: "準備中",
    pendingNote: "応募窓口は現在準備中です。",
    qrAlt: "WeChat QRコード",
  },
};

const zh: RecruitUi = {
  eyebrow: "RECRUIT",
  tabsLabel: "本页内容",
  tabs: { positions: "招聘职位", environment: "工作环境", flow: "选拔流程", faq: "常见问题", apply: "应聘方式" },
  sections: { positions: "招聘职位", environment: "工作环境与福利", flow: "选拔流程", faq: "常见问题" },
  positionsSub: "目前共招聘 {n} 个职位。",
  facts: { positions: "OPEN POSITIONS", positionsCount: "个职位", location: "LOCATION", apply: "APPLY", applyMethods: "邮件 ／ 微信" },
  categories: {
    logistics: { label: "物流・仓储", eyebrow: "LOGISTICS" },
    operations: { label: "电商运营", eyebrow: "EC OPERATIONS" },
    design: { label: "设计", eyebrow: "DESIGN" },
  },
  employment: {
    fulltime: { label: "正式员工", short: "正式员工" },
    contract: { label: "合同制员工", short: "合同制" },
    parttime: { label: "兼职", short: "兼职" },
  },
  tagJoin: "／",
  listJoin: "、",
  meta: { salary: "薪资", hours: "工作时间" },
  more: "查看详情",
  benefitsTitle: "福利・待遇",
  step: "STEP",
  faqMarks: { q: "Q", a: "A" },
  jobSections: { duties: "工作内容", requirements: "应聘条件", preferred: "优先条件", conditions: "招聘要项", pr: "职位亮点" },
  conditions: {
    employment: "雇佣形式",
    salary: "薪资",
    hours: "工作时间",
    holidays: "休息日・假期",
    trialPeriod: "试用期",
    workplace: "工作地点",
    benefits: "待遇・福利",
    other: "其他",
  },
  cta: { apply: "应聘此职位", list: "返回职位列表", access: "交通", accessLong: "查看交通方式" },
  others: { eyebrow: "OTHER POSITIONS", title: "其他招聘职位" },
  apply: {
    eyebrow: "HOW TO APPLY",
    title: "应聘方式",
    email: "EMAIL",
    wechat: "WECHAT",
    mailButton: "通过邮件应聘",
    subjectLabel: "邮件标题",
    subjectPrefix: "【应聘】",
    copy: "复制微信号",
    copied: "已复制",
    pending: "准备中",
    pendingNote: "应聘渠道正在准备中。",
    qrAlt: "微信二维码",
  },
};

const en: RecruitUi = {
  eyebrow: "RECRUIT",
  tabsLabel: "On this page",
  tabs: { positions: "Positions", environment: "Work Environment", flow: "Selection Process", faq: "FAQ", apply: "How to Apply" },
  sections: { positions: "Open Positions", environment: "Work Environment & Benefits", flow: "Selection Process", faq: "FAQ" },
  positionsSub: "We are currently hiring for {n} positions.",
  facts: { positions: "OPEN POSITIONS", positionsCount: "positions", location: "LOCATION", apply: "APPLY", applyMethods: "Email / WeChat" },
  categories: {
    logistics: { label: "Logistics & Warehouse", eyebrow: "LOGISTICS" },
    operations: { label: "E-commerce Operations", eyebrow: "EC OPERATIONS" },
    design: { label: "Design", eyebrow: "DESIGN" },
  },
  employment: {
    fulltime: { label: "Full-time", short: "Full-time" },
    contract: { label: "Contract", short: "Contract" },
    parttime: { label: "Part-time", short: "Part-time" },
  },
  tagJoin: " / ",
  listJoin: ", ",
  meta: { salary: "Salary", hours: "Hours" },
  more: "Learn more",
  benefitsTitle: "Benefits",
  step: "STEP",
  faqMarks: { q: "Q", a: "A" },
  jobSections: {
    duties: "Job Description",
    requirements: "Requirements",
    preferred: "Preferred Qualifications",
    conditions: "Employment Details",
    pr: "Why Join Us",
  },
  conditions: {
    employment: "Employment type",
    salary: "Salary",
    hours: "Working hours",
    holidays: "Holidays & leave",
    trialPeriod: "Probation period",
    workplace: "Work location",
    benefits: "Benefits",
    other: "Other",
  },
  cta: { apply: "Apply for This Position", list: "All Positions", access: "Access", accessLong: "View access" },
  others: { eyebrow: "OTHER POSITIONS", title: "Other Positions" },
  apply: {
    eyebrow: "HOW TO APPLY",
    title: "How to Apply",
    email: "EMAIL",
    wechat: "WECHAT",
    mailButton: "Apply by Email",
    subjectLabel: "Subject",
    subjectPrefix: "Application: ",
    copy: "Copy ID",
    copied: "Copied",
    pending: "Coming soon",
    pendingNote: "Application details are coming soon.",
    qrAlt: "WeChat QR code",
  },
};

const uiByLocale: Record<Locale, RecruitUi> = { ja, zh, en };

export const getRecruitUi = (locale: Locale): RecruitUi => uiByLocale[locale];

/** 标签上的雇用形态：只有一种时用全称，多种时用简称连起来（例如「正社員／パート」） */
export const employmentTag = (types: EmploymentType[], ui: RecruitUi): string =>
  types.length === 1 ? ui.employment[types[0]].label : types.map((type) => ui.employment[type].short).join(ui.tagJoin);

/** 要点条和募集要項表格里的雇用形态：一律用全称 */
export const employmentFull = (types: EmploymentType[], ui: RecruitUi): string =>
  types.map((type) => ui.employment[type].label).join(ui.listJoin);

export const fillCount = (template: string, count: number): string => template.replace("{n}", String(count));
