import { allWorks } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import { albumForWork, type WorkCaseItem } from "@/lib/work-cd/cases";

export function getWorkCdItems(): WorkCaseItem[] {
  return allWorks
    .filter((work) => work.draft !== true)
    .sort(sortByDate)
    .map((work, index) => ({
      slug: work.slug,
      title: work.title,
      subtitle: work.subtitle,
      description: work.description,
      color: work.color ?? "#1D262E",
      album: albumForWork(work, index),
    }));
}
