// 重新计算首页 ACCESS 地图上的步行路线（车站 → 办公室），结果写入 .vitepress/theme/data/accessRoutes.json。
// 只在办公室搬家、换车站时手动运行一次：pnpm routes:access
// 路网来自 OpenStreetMap（地图上已有署名），路线由 FOSSGIS 的公开 OSRM 服务计算。
import { readFileSync, writeFileSync } from "node:fs";
import { parseLatLng } from "../.vitepress/theme/utils/accessMap.ts";

const OUTPUT = new URL("../.vitepress/theme/data/accessRoutes.json", import.meta.url);
const ja = JSON.parse(readFileSync(new URL("../data/home/ja.json", import.meta.url), "utf8"));
const office = parseLatLng(ja.access.coordinates);
if (!office) throw new Error(`data/home/ja.json access.coordinates is invalid: ${ja.access.coordinates}`);

// 起点：长田两站在地下相通，用它们共用的、离办公室最近的出入口；兵庫駅用车站本身（OSM 里登记的出口在远离办公室的一侧）
const PLACES = [
  { name: "JR兵庫駅", detail: "徒歩約10分", kind: "station", from: { lat: 34.667791, lon: 135.164182 }, walk: true },
  { name: "高速長田駅・長田駅", detail: "徒歩約10分", kind: "station", from: { lat: 34.6670106, lon: 135.1516894 }, walk: true },
  { name: "柳原出口", detail: "阪神高速3号神戸線", kind: "car", from: { lat: 34.66452, lon: 135.163098 }, walk: false },
];

const round = (value) => Math.round(value * 1e6) / 1e6;

const walk = async (from) => {
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${from.lon},${from.lat};${office.lng},${office.lat}?overview=full&geometries=geojson`;
  const response = await fetch(url, { headers: { "User-Agent": "uo-hp-access-map/1.0 (+https://www.uoworld.net/)" } });
  if (!response.ok) throw new Error(`routing request failed: ${response.status}`);
  const best = (await response.json()).routes?.[0];
  if (!best) throw new Error("no route found");
  return {
    distanceMeters: Math.round(best.distance),
    minutes: Math.round(best.duration / 6) / 10,
    coordinates: best.geometry.coordinates.map(([lon, lat]) => [round(lon), round(lat)]),
  };
};

const places = [];
for (const { name, detail, kind, from, walk: walking } of PLACES) {
  const route = walking ? await walk(from) : undefined;
  places.push({ name, detail, kind, position: route ? route.coordinates[0] : [round(from.lon), round(from.lat)], ...(route && { route }) });
  console.log(route ? `${name}: ${route.distanceMeters} m, about ${route.minutes} min` : `${name}: marker only`);
}

const data = {
  source: "© OpenStreetMap contributors; walking routes by FOSSGIS OSRM (https://routing.openstreetmap.de/)",
  places,
};
// 每个坐标对放一行，方便阅读和对比差异
const json = JSON.stringify(data, null, 2).replace(/\[\s+(-?[\d.]+),\s+(-?[\d.]+)\s+\]/g, "[$1, $2]");
writeFileSync(OUTPUT, `${json}\n`);
console.log(`wrote ${OUTPUT.pathname}`);
