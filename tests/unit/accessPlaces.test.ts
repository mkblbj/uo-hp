import test from "node:test";
import assert from "node:assert/strict";
import routes from "../../.vitepress/theme/data/accessRoutes.json" with { type: "json" };
import { getHomeContent } from "../../.vitepress/theme/content/homeContent.ts";
import { parseLatLng } from "../../.vitepress/theme/utils/accessMap.ts";
import { distanceMeters, placesForOffice, type AccessPlace } from "../../.vitepress/theme/utils/accessPlaces.ts";

const OFFICE = { lat: 34.665003, lng: 135.1580635 };

const station = (end: [number, number]): AccessPlace => ({
  name: "駅",
  detail: "徒歩約10分",
  kind: "station",
  position: [135.16, 34.667],
  route: { distanceMeters: 650, minutes: 9, coordinates: [[135.16, 34.667], end] },
});
const exit: AccessPlace = { name: "出口", detail: "阪神高速", kind: "car", position: [135.163, 34.6645] };

test("distances are measured along the Earth's surface", () => {
  // 经度相同、纬度相差 1 度约 111.19 km
  assert.equal(Math.round(distanceMeters([135, 34], { lat: 35, lng: 135 })), 111195);
});

test("routes that still end at the office are kept", () => {
  const [kept] = placesForOffice([station([135.1581, 34.6651])], OFFICE);
  assert.ok(kept.route);
});

test("a route is dropped, but its marker kept, when the office has moved since the routes were generated", () => {
  const places = placesForOffice([station([135.17, 34.67]), exit], OFFICE);
  assert.equal(places.length, 2);
  assert.equal(places[0].route, undefined);
  assert.deepEqual(places[0].position, [135.16, 34.667]);
  assert.deepEqual(places[1], exit);
});

test("the saved walking routes run from each station marker to the office set in the CMS", () => {
  const office = parseLatLng(getHomeContent("ja").access.coordinates);
  assert.ok(office);
  const walks = (routes.places as AccessPlace[]).filter((place) => place.route);
  assert.ok(walks.length > 0, "no walking routes saved");
  for (const place of walks) {
    const coordinates = place.route!.coordinates;
    assert.deepEqual(coordinates[0], place.position, `${place.name}: the route does not start at its marker`);
    const gap = distanceMeters(coordinates[coordinates.length - 1], office);
    assert.ok(gap <= 80, `${place.name}: the route ends ${Math.round(gap)} m from the office, run \`pnpm routes:access\``);
  }
});
