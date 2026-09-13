import type { LatLng } from "./accessMap";

export type LngLat = [number, number];

export interface AccessRoute {
  distanceMeters: number;
  minutes: number;
  coordinates: LngLat[];
}

/** 地图上标注的车站或高速出口；有 route 的会画出到办公室的步行路线 */
export interface AccessPlace {
  name: string;
  detail: string;
  kind: "station" | "car";
  position: LngLat;
  route?: AccessRoute;
}

export interface AccessRoutesData {
  source: string;
  places: AccessPlace[];
}

const EARTH_RADIUS = 6371000;
const RADIANS = Math.PI / 180;

/** 两点间沿地球表面的直线距离（米） */
export const distanceMeters = ([lng, lat]: LngLat, to: LatLng): number => {
  const a =
    Math.sin(((to.lat - lat) * RADIANS) / 2) ** 2 +
    Math.cos(lat * RADIANS) * Math.cos(to.lat * RADIANS) * Math.sin(((to.lng - lng) * RADIANS) / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
};

/** 后台改了办公室坐标、路线还没重新生成时，终点对不上的路线就不画，标注照常显示 */
export const placesForOffice = (places: AccessPlace[], office: LatLng, toleranceMeters = 80): AccessPlace[] =>
  places.map(({ route, ...place }) =>
    route && distanceMeters(route.coordinates[route.coordinates.length - 1], office) <= toleranceMeters ? { ...place, route } : place,
  );

/** 一组经纬度的外接矩形：[[西, 南], [东, 北]] */
export const boundsOf = (points: LngLat[]): [LngLat, LngLat] => [
  [Math.min(...points.map(([lng]) => lng)), Math.min(...points.map(([, lat]) => lat))],
  [Math.max(...points.map(([lng]) => lng)), Math.max(...points.map(([, lat]) => lat))],
];
