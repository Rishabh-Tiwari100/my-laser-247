import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  pageSize,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSizeSelector = true,
  onPageChange,
  onPageSizeChange,
}) => {
  const safePageSize = Math.max(pageSize || defaultPageSize, 1);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const visiblePages = useMemo(() => getVisiblePages(), [currentPage, totalPages]);

  // if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-3 gap-4">
      {/* Page Size Selector */}
      {showPageSizeSelector ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            value={safePageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
      ) : (
        <div />
      )}

      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-1 items-center flex-wrap">
          {visiblePages.map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">
                ...
              </span>
            ) : (
              <Button
                key={`page-${page}`}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                className={`h-8 w-8 p-0 ${
                  page === currentPage ? 'bg-primary text-white font-medium' : ''
                }`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
