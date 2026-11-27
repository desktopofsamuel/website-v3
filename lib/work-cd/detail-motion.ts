export const DETAIL_MOTION_IDS = ["booklet", "rise", "sleeve", "typeset"] as const;

export type DetailMotionId = (typeof DETAIL_MOTION_IDS)[number];

export const DETAIL_MOTION_STORAGE_KEY = "work-cd-detail-motion";

export const DETAIL_MOTIONS: {
  id: DetailMotionId;
  label: string;
  hint: string;
}[] = [
  {
    id: "booklet",
    label: "Booklet",
    hint: "Liner notes slide in from the case edge",
  },
  {
    id: "rise",
    label: "Rise",
    hint: "Copy lifts off the docked player",
  },
  {
    id: "sleeve",
    label: "Sleeve",
    hint: "Panel wipes out of the disc well",
  },
  {
    id: "typeset",
    label: "Typeset",
    hint: "Lines set in place, like a printed insert",
  },
];

export function isDetailMotionId(value: string): value is DetailMotionId {
  return DETAIL_MOTION_IDS.includes(value as DetailMotionId);
}

export function readDetailMotion(): DetailMotionId {
  if (typeof window === "undefined") return "booklet";
  const stored = window.sessionStorage.getItem(DETAIL_MOTION_STORAGE_KEY);
  return stored && isDetailMotionId(stored) ? stored : "booklet";
}

export function writeDetailMotion(id: DetailMotionId) {
  window.sessionStorage.setItem(DETAIL_MOTION_STORAGE_KEY, id);
}
