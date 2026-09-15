import type { Locale } from "./siteCopy";

/*
 * 招聘数据的整理。后台（Sveltia CMS）把数据存成 data/recruit/jobs/*.json 和 data/recruit/page.json，
 * 三种语言在同一个文件里：顶层是语言代码，三语共用的栏目只存在 ja 下面（i18n single_file）。
 * 这里只整理、不读文件（读文件在 .vitepress/recruit/source.ts），测试和浏览器端都能直接用；
 * 所以这个文件只引用类型，不引用其他本地模块。
 */

export const RECRUIT_LOCALES: Locale[] = ["ja", "zh", "en"];
/** 类别，也是招聘首页上分组的顺序 */
export const CATEGORY_KEYS = ["logistics", "operations", "design"] as const;
export type CategoryKey = (typeof CATEGORY_KEYS)[number];
export const EMPLOYMENT_TYPES = ["fulltime", "contract", "parttime"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

/** 网址名：小写字母和数字，用「-」连接（和后台的格式校验一致） */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ListBlock {
  items: string[];
  note: string;
}

export interface Duties extends ListBlock {
  intro: string;
}

export interface ExtraSection extends ListBlock {
  title: string;
  intro: string;
}

export interface Job {
  slug: string;
  /** 招聘首页上的编号 01、02…：按类别、排序号排好后连续编号 */
  no: string;
  order: number;
  category: CategoryKey;
  employmentTypes: EmploymentType[];
  /** YYYY-MM-DD */
  datePosted: string;
  title: string;
  summary: string;
  tags: string[];
  duties: Duties;
  requirements: ListBlock;
  preferred: ListBlock;
  sections: ExtraSection[];
  salary: string;
  hours: { text: string; items: string[] };
  holidays: string;
  trialPeriod: string;
  workplace: { items: string[] };
  benefits: string[];
  otherConditions: string;
  pr: string;
}

export interface RecruitPage {
  description: string;
  lead: string;
  locationShort: string;
  features: { title: string; body: string }[];
  benefits: string[];
  benefitsNote: string;
  steps: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  applyBody: string;
  emailNote: string;
  wechatNote: string;
  /** 以下三项三语共用（只存在 ja 下）；空着时页面显示「準備中」 */
  email: string;
  wechatId: string;
  wechatQr: string;
}

export interface RecruitData {
  jobs: Record<Locale, Job[]>;
  page: Record<Locale, RecruitPage>;
}

export interface RawFile {
  /** 文件名，只用于提示信息 */
  name: string;
  data: unknown;
}

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj => typeof value === "object" && value !== null && !Array.isArray(value);
const obj = (value: unknown): Obj => (isObj(value) ? value : {});
const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const texts = (value: unknown): string[] => (Array.isArray(value) ? value.map(text).filter(Boolean) : []);
const at = (source: Obj, path: string): unknown => path.split(".").reduce<unknown>((value, key) => obj(value)[key], source);
const items = <T>(value: unknown, read: (item: Obj) => T, keep: (item: T) => boolean): T[] =>
  (Array.isArray(value) ? value : []).map((item) => read(obj(item))).filter(keep);

/**
 * 取某种语言的栏目。这种语言没填、日文填了的时候，用日文补上并记一条提示，
 * 所以就算译文缺了，网站也照样能构建（缺的地方临时显示日文）。
 */
const localizer = (raw: Obj, locale: Locale, where: string, warnings: string[]) => {
  const ja = obj(raw.ja);
  const own = locale === "ja" ? ja : obj(raw[locale]);
  const pick = <T>(field: string, read: (source: Obj) => T, isEmpty: (value: T) => boolean): T => {
    const value = read(own);
    if (locale === "ja" || !isEmpty(value)) return value;
    const fallback = read(ja);
    if (isEmpty(fallback)) return value;
    warnings.push(`${where}: "${field}" has no ${locale} text, using Japanese`);
    return fallback;
  };
  return {
    text: (field: string) => pick(field, (source) => text(at(source, field)), (value) => !value),
    texts: (field: string) => pick(field, (source) => texts(at(source, field)), (value) => value.length === 0),
    list: <T>(field: string, read: (item: Obj) => T, keep: (item: T) => boolean) =>
      pick(field, (source) => items(at(source, field), read, keep), (value) => value.length === 0),
  };
};

const readSection = (item: Obj): ExtraSection => ({ title: text(item.title), intro: text(item.intro), items: texts(item.items), note: text(item.note) });
const hasSection = (section: ExtraSection) => Boolean(section.title || section.intro || section.items.length || section.note);

interface Entry {
  name: string;
  raw: Obj;
  slug: string;
  order: number;
  category: CategoryKey;
  employmentTypes: EmploymentType[];
  datePosted: string;
}

const readOrder = (value: unknown): number => {
  const order = typeof value === "number" ? value : Number.parseInt(text(value), 10);
  return Number.isFinite(order) ? order : 999;
};

const localizeJob = (entry: Entry, locale: Locale, index: number, warnings: string[]): Job => {
  const l = localizer(entry.raw, locale, `jobs/${entry.name}`, warnings);
  return {
    slug: entry.slug,
    no: String(index + 1).padStart(2, "0"),
    order: entry.order,
    category: entry.category,
    employmentTypes: entry.employmentTypes,
    datePosted: entry.datePosted,
    title: l.text("title"),
    summary: l.text("summary"),
    tags: l.texts("tags"),
    duties: { intro: l.text("duties.intro"), items: l.texts("duties.items"), note: l.text("duties.note") },
    requirements: { items: l.texts("requirements.items"), note: l.text("requirements.note") },
    preferred: { items: l.texts("preferred.items"), note: l.text("preferred.note") },
    sections: l.list("sections", readSection, hasSection),
    salary: l.text("salary"),
    hours: { text: l.text("hours.text"), items: l.texts("hours.items") },
    holidays: l.text("holidays"),
    trialPeriod: l.text("trialPeriod"),
    workplace: { items: l.texts("workplace.items") },
    benefits: l.texts("benefits"),
    otherConditions: l.text("otherConditions"),
    pr: l.text("pr"),
  };
};

/**
 * 整理全部职位：去掉不公开的；网址名不合规、没有类别、网址名重复的跳过并提示；
 * 按类别顺序、排序号排好，编号 01～；三种语言各一份，职位和顺序完全相同。
 */
export const normalizeJobs = (files: RawFile[]): { jobs: Record<Locale, Job[]>; warnings: string[] } => {
  const warnings: string[] = [];
  const entries: Entry[] = [];
  for (const file of files) {
    const raw = obj(file.data);
    const shared = obj(raw.ja);
    if (shared.published === false) continue;
    const slug = text(shared.slug);
    const category = CATEGORY_KEYS.find((key) => key === shared.category);
    if (!SLUG_PATTERN.test(slug)) {
      warnings.push(`jobs/${file.name}: invalid slug "${slug}", skipped`);
      continue;
    }
    if (!category) {
      warnings.push(`jobs/${file.name}: unknown category "${String(shared.category)}", skipped`);
      continue;
    }
    const types = Array.isArray(shared.employmentTypes) ? shared.employmentTypes : [];
    const employmentTypes = EMPLOYMENT_TYPES.filter((type) => types.includes(type));
    if (!employmentTypes.length) warnings.push(`jobs/${file.name}: no employment type`);
    const datePosted = /^\d{4}-\d{2}-\d{2}/.exec(text(shared.datePosted))?.[0] ?? "";
    entries.push({ name: file.name, raw, slug, order: readOrder(shared.order), category, employmentTypes, datePosted });
  }

  entries.sort(
    (a, b) =>
      CATEGORY_KEYS.indexOf(a.category) - CATEGORY_KEYS.indexOf(b.category) || a.order - b.order || a.slug.localeCompare(b.slug),
  );
  const seen = new Set<string>();
  const unique = entries.filter((entry) => {
    if (!seen.has(entry.slug)) return seen.add(entry.slug);
    warnings.push(`jobs/${entry.name}: duplicate slug "${entry.slug}", skipped`);
    return false;
  });

  const jobs = Object.fromEntries(
    RECRUIT_LOCALES.map((locale) => [locale, unique.map((entry, index) => localizeJob(entry, locale, index, warnings))]),
  ) as Record<Locale, Job[]>;
  return { jobs, warnings };
};

/** 整理招聘首页的共通内容；邮箱、微信号、二维码三语共用，从 ja 取 */
export const normalizePage = (data: unknown): { page: Record<Locale, RecruitPage>; warnings: string[] } => {
  const warnings: string[] = [];
  const raw = obj(data);
  const shared = obj(raw.ja);
  const page = Object.fromEntries(
    RECRUIT_LOCALES.map((locale) => {
      const l = localizer(raw, locale, "page.json", warnings);
      const value: RecruitPage = {
        description: l.text("description"),
        lead: l.text("lead"),
        locationShort: l.text("locationShort"),
        features: l.list("features", (item) => ({ title: text(item.title), body: text(item.body) }), (item) => Boolean(item.title || item.body)),
        benefits: l.texts("benefits"),
        benefitsNote: l.text("benefitsNote"),
        steps: l.list("steps", (item) => ({ title: text(item.title), body: text(item.body) }), (item) => Boolean(item.title || item.body)),
        faq: l.list("faq", (item) => ({ q: text(item.q), a: text(item.a) }), (item) => Boolean(item.q && item.a)),
        applyBody: l.text("applyBody"),
        emailNote: l.text("emailNote"),
        wechatNote: l.text("wechatNote"),
        email: text(shared.email),
        wechatId: text(shared.wechatId),
        wechatQr: text(shared.wechatQr),
      };
      return [locale, value];
    }),
  ) as Record<Locale, RecruitPage>;
  return { page, warnings };
};

/** 多行文字按空行分段 */
export const paragraphs = (value: string): string[] =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

/** 多行文字的第一行：职位列表和要点条只显示这一行 */
export const firstLine = (value: string): string => value.split("\n", 1)[0].trim();

/** 按类别分组，保持已排好的顺序；没有职位的类别不出现 */
export const groupByCategory = (jobs: Job[]): { category: CategoryKey; jobs: Job[] }[] =>
  CATEGORY_KEYS.map((category) => ({ category, jobs: jobs.filter((job) => job.category === category) })).filter(
    (group) => group.jobs.length > 0,
  );

/** 应聘邮件链接：标题（例如「【応募】职位名」）编码后放进 subject */
export const mailtoHref = (email: string, subject: string): string =>
  `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
