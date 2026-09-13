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

/** Google 地图路线导航链接：有坐标就导航到坐标，没有就按地址搜索 */
export const directionsUrl = (target: LatLng | null, address: string): string => {
  const destination = target ? `${target.lat},${target.lng}` : address;
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination })}`;
};
