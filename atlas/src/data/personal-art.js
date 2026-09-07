// Original illustrative drawings, not depictions of the user's actual buildings.
export const personalArt = [
  { id: "cottage", name: "The porch house" },
  { id: "townhouse", name: "The deco townhouse" },
  { id: "bookshop", name: "The corner bookshop" },
  { id: "pavilion", name: "The garden pavilion" },
];
export function illustrationPath(place) {
  return place.art
    ? `assets/personal/${place.art}.webp`
    : place.asset
      ? `assets/${place.asset}.webp`
      : null;
}
export function suggestPersonalArt(places) {
  return personalArt.reduce((best, art) =>
    places.filter((p) => p.art === art.id).length <
    places.filter((p) => p.art === best.id).length
      ? art
      : best,
  ).id;
}
