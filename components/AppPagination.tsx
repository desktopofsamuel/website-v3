import { Link } from "@/components/AppLink";
import { Button } from "@/components/ui/button";

export default function Pagination({
  numPages,
  currentPage,
}: {
  numPages: number;
  currentPage: number;
}) {
  const isFirst = currentPage === 2; /* First page is p2 as p1 is Blog Index */
  const isLast = currentPage === numPages;
  const prevPage = `/blog/page/${currentPage - 1}`;
  const nextPage = `/blog/page/${currentPage + 1}`;

  if (numPages === 1) return <></>;
  return (
    <div className="flex justify-between items-center my-8">
      <Button asChild variant={isFirst ? "disabled" : "default"}>
        <Link href={prevPage} className="no-underline">
          Prev
        </Link>
      </Button>
      <Button asChild variant={isLast ? "disabled" : "default"}>
        <Link href={nextPage} className="no-underline">
          Next
        </Link>
      </Button>
    </div>
  );
}

