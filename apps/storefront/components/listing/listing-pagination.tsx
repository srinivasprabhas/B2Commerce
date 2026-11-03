import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@b2c/ui/components/pagination";

type Params = Record<string, string | string[] | undefined>;

function pageNumbers(current: number, total: number) {
  const out: (number | "ellipsis")[] = [];
  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || Math.abs(page - current) <= 1) out.push(page);
    else if (out.at(-1) !== "ellipsis") out.push("ellipsis");
  }
  return out;
}

function buildUrl(basePath: string, page: number, params: Params) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value && key !== "page") sp.set(key, value);
  }
  if (page > 1) sp.set("page", String(page));
  return sp.size ? `${basePath}?${sp}` : basePath;
}

export function ListingPagination({
  basePath,
  currentPage,
  totalPages,
  params = {},
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  params?: Params;
}) {
  if (totalPages <= 1) return null;
  return (
    <Pagination className="mt-12">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildUrl(basePath, currentPage - 1, params)} />
          </PaginationItem>
        )}
        {pageNumbers(currentPage, totalPages).map((page, i) =>
          page === "ellipsis" ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink href={buildUrl(basePath, page, params)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={buildUrl(basePath, currentPage + 1, params)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
