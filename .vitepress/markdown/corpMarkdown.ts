import container from "markdown-it-container";
import type { MarkdownRenderer } from "vitepress";

type Token = ReturnType<MarkdownRenderer["parse"]>[number];

/** 日文内页：不在 zh/、en/ 下，也不是首页（index.md） */
export const isJaInnerPage = (relativePath?: string): boolean =>
  typeof relativePath === "string" && relativePath !== "index.md" && !/^(zh|en)\//.test(relativePath);

const INTRO_OPEN = '<div class="corp-intro">\n';
const INTRO_CLOSE = "</div>\n";
const SECTION_BODY_OPEN = '</div></div>\n<div class="corp-sec__body">\n';
const SECTION_CLOSE = "</div>\n</section>\n";
const sectionOpen = (no: string) =>
  `<section class="corp-sec">\n<div class="corp-sec__head"><div class="corp-sec__head-inner"><span class="corp-sec__no" aria-hidden="true">${no}</span>\n`;

/** 只有 HTML 注释的块（例如「生成画像プロンプト」）不算正文，不会单独撑出一个导语区 */
const isCommentOnly = (token: Token) => token.type === "html_block" && /^\s*<!--[\s\S]*-->\s*$/.test(token.content);

/**
 * 日文内页的正文结构：第一个顶层 ## 之前的内容包成导语区；
 * 每个顶层 ## 连同后面的内容包成一节，左边是编号和小节标题，右边是内容。
 * 提示框、列表里面的标题（不是顶层）不拆。
 */
export const corpSections = (md: MarkdownRenderer): void => {
  md.core.ruler.push("corp_sections", (state) => {
    // renderInline（行内渲染，例如 eyebrow、卡片说明文字）也会跑 core 规则；行内模式下不拆结构
    if (state.inlineMode || !isJaInnerPage(state.env?.relativePath)) return;

    const html = (content: string) => {
      const token = new state.Token("html_block", "", 0);
      token.content = content;
      return token;
    };
    const tokens = state.tokens;
    const out: Token[] = [];
    let open: "intro" | "section" | null = null;
    let count = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === "heading_open" && token.tag === "h2" && token.level === 0) {
        if (open === "intro") out.push(html(INTRO_CLOSE));
        if (open === "section") out.push(html(SECTION_CLOSE));
        count += 1;
        // heading_open、inline、heading_close 三个 token 放进标题栏
        out.push(html(sectionOpen(String(count).padStart(2, "0"))), token, tokens[i + 1], tokens[i + 2], html(SECTION_BODY_OPEN));
        i += 2;
        open = "section";
        continue;
      }
      if (open === null && !isCommentOnly(token)) {
        out.push(html(INTRO_OPEN));
        open = "intro";
      }
      out.push(token);
    }

    if (open === "intro") out.push(html(INTRO_CLOSE));
    if (open === "section") out.push(html(SECTION_CLOSE));
    state.tokens = out;
  });
};

const wrap = (open: string, close: string) => ({
  render: (tokens: Token[], idx: number) => (tokens[idx].nesting === 1 ? `${open}\n` : `${close}\n`),
});

// 这两个区块显示首页后台的数据（组件在 theme/index.ts 全局注册）；
// 区块中间写的说明只给后台编辑者看，组件不渲染插槽，所以网站上看不到
const DATA_BLOCKS: Record<string, string> = {
  "company-profile": "CorpProfileTable",
  "sales-results": "CorpSalesResults",
};

/** 日文内页用的 ::: 区块；另外去掉日文内页上没写标题的提示框的默认标题（「TIP」「INFO」等） */
export const corpContainers = (md: MarkdownRenderer): void => {
  md.use(container, "cards", wrap('<div class="corp-cards">', "</div>"));
  md.use(container, "signature", wrap('<div class="corp-signature">', "</div>"));
  for (const [name, component] of Object.entries(DATA_BLOCKS)) {
    md.use(container, name, wrap(`<${component}>`, `</${component}>`));
  }

  for (const type of ["info", "tip", "warning", "danger"]) {
    const rule = `container_${type}_open`;
    const original = md.renderer.rules[rule];
    if (!original) {
      throw new Error(`VitePress no longer registers ${rule}; revisit .vitepress/markdown/corpMarkdown.ts`);
    }
    md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const title = token.info.trim().slice(type.length).trim();
      if (title || !isJaInnerPage(env?.relativePath)) return original(tokens, idx, options, env, self);
      return `<div class="${type} custom-block"${self.renderAttrs(token)}>\n`;
    };
  }
};
