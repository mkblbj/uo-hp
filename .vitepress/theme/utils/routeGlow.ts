import type { ExpressionSpecification } from "maplibre-gl";

// 车站 → 办公室路线的颜色和动画（line-gradient 沿路线从 0 = 车站 到 1 = 办公室）
export const ROUTE_TRAIL = "rgba(126, 184, 235, 0.85)";
const ROUTE_LIGHT = "rgba(240, 248, 255, 1)";
const ROUTE_HIDDEN = "rgba(111, 169, 222, 0)";

type Stop = [number, string];
const gradient = (stops: Stop[]): ExpressionSpecification =>
  ["interpolate", ["linear"], ["line-progress"], ...stops.flat()] as ExpressionSpecification;

/** 路线从车站"生长"到进度 p（0-1）：走过的部分是蓝色轨迹，最前端是亮光，前方还没显示 */
export const revealGradient = (p: number) => {
  if (p <= 0.002) return gradient([[0, ROUTE_HIDDEN], [1, ROUTE_HIDDEN]]);
  if (p >= 0.998) return gradient([[0, ROUTE_TRAIL], [1, ROUTE_TRAIL]]);
  const tail = Math.max(p - 0.12, 0.001);
  return gradient([[0, ROUTE_TRAIL], [tail, ROUTE_TRAIL], [p, ROUTE_LIGHT], [p + 0.001, ROUTE_HIDDEN], [1, ROUTE_HIDDEN]]);
};

/** 生长完成后，一段亮光沿路线流向办公室；q（0-1）是这一趟走到哪里 */
export const flowGradient = (q: number) => {
  const center = 0.16 + Math.min(Math.max(q, 0), 1) * 0.8;
  return gradient([[0, ROUTE_TRAIL], [center - 0.14, ROUTE_TRAIL], [center, ROUTE_LIGHT], [center + 0.02, ROUTE_TRAIL], [1, ROUTE_TRAIL]]);
};
