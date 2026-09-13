/** 数字计数动画用：把「16,755」「4.59」「100万」「31位」这类显示文字拆成可以动画的数值。 */
export interface CountValue {
  prefix: string;
  target: number;
  decimals: number;
  grouped: boolean;
  suffix: string;
}

// 前缀和后缀里不能有数字，否则（例如「2015→2018」）不做动画
const COUNT_PATTERN = /^(\D*?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?(\D*)$/;

export function parseCountValue(text: string): CountValue | null {
  const match = COUNT_PATTERN.exec(text.trim());
  if (!match) {
    return null;
  }

  const [, prefix, integer, fraction = "", suffix] = match;
  const decimals = fraction.length;
  const target = Number(`${integer.replace(/,/g, "")}${decimals ? `.${fraction}` : ""}`);

  if (!Number.isFinite(target)) {
    return null;
  }

  return { prefix, target, decimals, grouped: integer.includes(","), suffix };
}

export function formatCountValue(value: CountValue, current: number): string {
  const fixed = value.decimals > 0 ? current.toFixed(value.decimals) : String(Math.round(current));
  const [integer, fraction] = fixed.split(".");
  const integerText = value.grouped ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : integer;

  return `${value.prefix}${integerText}${fraction ? `.${fraction}` : ""}${value.suffix}`;
}
