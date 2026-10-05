export interface LatLng {
  lat: number;
  lng: number;
}

const DECIMAL = /^-?\d+(\.\d+)?$/;

/** 解析从 Google 地图右键复制来的「纬度, 经度」（也接受全角逗号）；格式不对或超出范围时返回 null */
export const parseLatLng = (text?: string): LatLng | null => {
  const parts = (text ?? "").split(/[,，]/).map((part) => part.trim());
  if (parts.length !== 2 || !parts.every((part) => DECIMAL.test(part))) return null;
  const [lat, lng] = parts.map(Number);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
};

/** Google 地图路线导航链接：有地点 ID 时导航到登记的公司，否则按坐标或地址定位 */
export const directionsUrl = (target: LatLng | null, address: string, placeId?: string, placeName?: string): string => {
  // Google 地图可能把纯坐标反查为附近建筑；有公司记录时用名称保留公司目的地。
  const destination = placeId && placeName ? placeName : target ? `${target.lat},${target.lng}` : address;
  const params = new URLSearchParams({ api: "1", destination });
  if (placeId) params.set("destination_place_id", placeId);
  return `https://www.google.com/maps/dir/?${params}`;
};

/**
 * 在 Google 地图里打开这个位置：有地点 ID 时打开公司详情，否则按坐标或地址定位。
 * 用官方的通用链接格式（手机上打开 App，电脑上打开网页版）；maps.app.goo.gl 短链接在 iPhone 的 App 里打不开
 */
export const mapSearchUrl = (target: LatLng | null, address: string, placeId?: string): string => {
  const query = target ? `${target.lat},${target.lng}` : address;
  const params = new URLSearchParams({ api: "1", query });
  if (placeId) params.set("query_place_id", placeId);
  return `https://www.google.com/maps/search/?${params}`;
};

/** 交通说明：每行都以「- 」或「・」开头时拆成列表项；否则返回 null，按原文显示 */
export const noteItems = (note?: string): string[] | null => {
  const lines = (note ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length || !lines.every((line) => /^[-・]/.test(line))) return null;
  return lines.map((line) => line.replace(/^[-・]\s*/, ""));
};

/** 页脚「地図を見る」：和地图区的按钮打开同一个位置；没有 access 数据时返回 undefined（不显示） */
export const accessMapUrl = (access?: { coordinates: string; address: string; placeId?: string }): string | undefined =>
  access ? mapSearchUrl(parseLatLng(access.coordinates), access.address, access.placeId) : undefined;
