interface ReportPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  compact?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const defaultPageSizeOptions = [10, 25, 50, 100];

export default function ReportPagination({
  currentPage,
  pageSize,
  totalItems,
  pageSizeOptions = defaultPageSizeOptions,
  compact = false,
  onPageChange,
  onPageSizeChange,
}: ReportPaginationProps) {
  const safePageSize = Math.max(pageSize, 1);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(safeCurrentPage * safePageSize, totalItems);
  const canGoPrevious = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < totalPages;

  return (
    <div className="flex w-full items-center justify-between gap-2 border border-t-0 border-[#b6b9bb] bg-white px-[8px] py-[7px] text-[12px] text-[#050505]">
      <div className="flex min-w-0 items-center gap-[6px]">
        <span className="whitespace-nowrap text-[#666]">
          Showing {startItem} to {endItem} of {totalItems} entries
        </span>
        <select
          className="h-[25px] rounded-[3px] border border-[#aeb3b7] bg-white px-[5px] text-[12px] outline-none"
          value={safePageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex shrink-0 items-center gap-[4px]">
        <button
          type="button"
          className="h-[25px] rounded-[3px] border border-[#bcbcbc] bg-[#efefef] px-[8px] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          Prev
        </button>
        <span className="h-[25px] min-w-[32px] rounded-[3px] border border-[#999] bg-[#d9d9d9] px-[8px] text-center font-semibold leading-[23px]">
          {safeCurrentPage}
        </span>
        <button
          type="button"
          className="h-[25px] rounded-[3px] border border-[#bcbcbc] bg-[#efefef] px-[8px] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canGoNext}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
