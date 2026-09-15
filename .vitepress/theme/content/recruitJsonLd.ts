import type { EmploymentType, Job } from "./recruitData";

/*
 * Google 求职搜索用的 JobPosting 结构化数据（只放在日文职位页）。
 * 需要的文字、公司信息都从参数传进来；这个文件只引用类型，测试可以直接导入。
 */

export interface JobPostingInput {
  job: Job;
  /** 说明里各小节的标题（日文） */
  labels: {
    duties: string;
    requirements: string;
    preferred: string;
    hours: string;
    holidays: string;
    salary: string;
    benefits: string;
    trialPeriod: string;
    other: string;
    pr: string;
  };
  organization: { name: string; url: string; logo: string };
  /** 首页 ACCESS 的地址 */
  address: string;
}

const EMPLOYMENT_TYPE: Record<EmploymentType, string> = {
  fulltime: "FULL_TIME",
  parttime: "PART_TIME",
  contract: "TEMPORARY",
};

export interface PostalAddress {
  postalCode?: string;
  addressRegion?: string;
  addressLocality?: string;
  streetAddress: string;
}

/** 把「〒653-0015 兵庫県神戸市長田区菅原通2-23 No.88ビル2F」拆成邮编、都道府県、市区町村和街道；拆不开的部分都放进街道 */
export const parseJpAddress = (address: string): PostalAddress => {
  const full = address.replace(/\s+/g, " ").trim();
  let rest = full;
  const postal = /^〒?\s*(\d{3}-?\d{4})\s*/.exec(rest);
  if (postal) rest = rest.slice(postal[0].length);
  const region = /^(東京都|北海道|京都府|大阪府|.{2,3}県)/.exec(rest)?.[1];
  if (region) rest = rest.slice(region.length);
  const locality = region ? /^(.+?郡.+?[町村]|.+?市.+?区|.+?[市区町村])/.exec(rest)?.[1] : undefined;
  if (locality) rest = rest.slice(locality.length);
  return {
    ...(postal ? { postalCode: postal[1] } : {}),
    ...(region ? { addressRegion: region } : {}),
    ...(locality ? { addressLocality: locality } : {}),
    streetAddress: rest.trim() || full,
  };
};

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const paras = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
const list = (values: string[]) => (values.length ? `<ul>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>` : "");
const block = (title: string, body: string) => (body ? `<h3>${escapeHtml(title)}</h3>${body}` : "");

/** 职位说明的 HTML：Google 要求 description 是完整的职位介绍 */
const describe = ({ job, labels }: JobPostingInput): string =>
  [
    paras(job.summary),
    block(labels.duties, paras(job.duties.intro) + list(job.duties.items) + paras(job.duties.note)),
    block(labels.requirements, list(job.requirements.items) + paras(job.requirements.note)),
    block(labels.preferred, list(job.preferred.items) + paras(job.preferred.note)),
    ...job.sections.map((section) => block(section.title, paras(section.intro) + list(section.items) + paras(section.note))),
    block(labels.hours, paras(job.hours.text) + list(job.hours.items)),
    block(labels.holidays, paras(job.holidays)),
    block(labels.salary, paras(job.salary)),
    block(labels.benefits, list(job.benefits)),
    block(labels.trialPeriod, paras(job.trialPeriod)),
    block(labels.other, paras(job.otherConditions)),
    block(labels.pr, paras(job.pr)),
  ].join("");

/** 生成 JobPosting；职位名或刊登日期缺了就返回 null（Google 的必填项，缺了不如不放） */
export const jobPostingJsonLd = (input: JobPostingInput): Record<string, unknown> | null => {
  const { job, organization, address } = input;
  if (!job.title || !job.datePosted) return null;
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: describe(input),
    datePosted: job.datePosted,
    ...(job.employmentTypes.length ? { employmentType: job.employmentTypes.map((type) => EMPLOYMENT_TYPE[type]) } : {}),
    hiringOrganization: { "@type": "Organization", name: organization.name, sameAs: organization.url, logo: organization.logo },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", ...parseJpAddress(address), addressCountry: "JP" } },
  };
};

/** 放进 <script type="application/ld+json"> 的文字：把「<」转义，避免内容里的「</script>」提前结束标签 */
export const jsonLdScript = (value: Record<string, unknown>): string => JSON.stringify(value).replace(/</g, "\\u003c");
