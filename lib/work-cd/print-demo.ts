export const PRINT_DEMO_IDS = ["a", "b", "c", "d"] as const;

export type PrintDemoId = (typeof PRINT_DEMO_IDS)[number];

export type PrintDemoMeta = {
  id: PrintDemoId;
  letter: string;
  title: string;
  blurb: string;
  zoom: string;
  usesGlb: boolean;
};

export const PRINT_DEMOS: PrintDemoMeta[] = [
  {
    id: "a",
    letter: "A",
    title: "Planar vector on the lid",
    blurb:
      "Hide the folded booklet. Parent Plane / Circle / Ring + Helvetiker type to the lid, tray, and disc. Photoreal case, geometric prints.",
    zoom: "Type stays sharp at any zoom. Looks like a poster, not a photo.",
    usesGlb: true,
  },
  {
    id: "b",
    letter: "B",
    title: "Bloop image planes",
    blurb:
      "No jewel-case GLB. Front, disc, and back are 2048 canvas textures on simple planes, like Bloop Cover Flow.",
    zoom: "Looks finished until you macro-zoom past the texture.",
    usesGlb: false,
  },
  {
    id: "c",
    letter: "C",
    title: "Vector on the booklet mesh",
    blurb:
      "Keep the 49-vert folded cover and overlay vector prints on it. This is the path that produced inner-page stickers and doubles.",
    zoom: "Geometry is sharp; seating on the cube is the failure.",
    usesGlb: true,
  },
  {
    id: "d",
    letter: "D",
    title: "Planar 2k canvas on the lid",
    blurb:
      "Same seating as A: one-sided cover inside the lid, facing out through the glass. 2048 canvas (Mackinac). How Moby stickers and Bloop covers actually look finished.",
    zoom: "Looks printed under orbit. Pixelates only if you fill the screen with type.",
    usesGlb: true,
  },
];

export function isPrintDemoId(value: string): value is PrintDemoId {
  return (PRINT_DEMO_IDS as readonly string[]).includes(value);
}

export function printDemoById(id: PrintDemoId) {
  const demo = PRINT_DEMOS.find((item) => item.id === id);
  if (!demo) throw new Error(`Unknown print demo ${id}`);
  return demo;
}
