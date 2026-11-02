import React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T = any> {
  key: string;
  label: string;
  className?: string;
  headerClassName?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  rowKey?: (row: T, index: number) => string | number;
  isHeaderRounded?: Boolean;
  isRowRounded?: Boolean;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  defaultPageSize?: number;
  tableClassName?: string;
  theadClassName?: string;
  headerCellClassName?: string;
  tbodyClassName?: string;
  rowBaseClassName?: string;
  cellBaseClassName?: string;
  skeletonRowClassName?: string;
  skeletonCellClassName?: string;
  noDataMessage?: string;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  rowKey,
  isHeaderRounded,
  isRowRounded,
  className,
  rowClassName,
  defaultPageSize = 10,
  tableClassName,
  theadClassName,
  headerCellClassName,
  tbodyClassName,
  rowBaseClassName,
  cellBaseClassName,
  skeletonRowClassName,
  skeletonCellClassName,
  noDataMessage = 'No Data Available',
}: DataTableProps<T>) => {
  const skeletonRows = Array.from({ length: defaultPageSize });

  return (
    <div className={cn('overflow-x-auto border border-primary/30 rounded-md', className)}>
      <table
        className={cn(
          'w-full text-[11.5px] md:text-sm min-w-[550px] md:min-w-[1000px]',
          tableClassName
        )}
      >
        <thead className={cn('bg-primary-dark-blue', theadClassName)}>
          <tr className=" text-white text-left">
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  'px-2.5 py-1 md:py-2 font-semibold border-l border-primary-dark',
                  i === 0 && 'rounded-l-sm border-l-0',
                  col.headerClassName || col.className,
                  isHeaderRounded &&
                    `border-y ${i === 0 && 'border-l rounded-l-lg'} ${i === columns.length - 1 && 'border-r rounded-r-lg'}`,
                  headerCellClassName
                )}
                title={col.label}
              >
                <span className="whitespace-nowrap">{col.label}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={cn('', tbodyClassName)}>
          {isLoading ? (
            skeletonRows.map((_, i) => (
              <tr
                key={i}
                className={cn('animate-pulse border-b border-primary/10', skeletonRowClassName)}
              >
                {columns.map((_, idx) => (
                  <td key={idx} className={cn('px-4 py-3', skeletonCellClassName)}>
                    <div className="h-6 bg-gray-700/30 rounded w-3/4 mx-auto" />
                  </td>
                ))}
              </tr>
            ))
          ) : data && data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row, i) : i}
                className={cn(
                  'border-b border-l-[3px] border-primary bg-primary-light/15 hover:bg-primary-light/25 transition-colors',
                  rowBaseClassName,
                  rowClassName?.(row, i)
                )}
              >
                {columns.map((col, idx) => {
                  const value = row[col.key];
                  const content = col.render ? col.render(value, row, i) : (value ?? '-');

                  return (
                    <td
                      key={idx}
                      className={cn(
                        'px-2.5 py-1 md:py-2 truncate',
                        isRowRounded &&
                          `border-y ${idx === 0 && 'border-l rounded-l-lg'} ${idx === columns.length - 1 && 'border-r rounded-r-lg'}`,
                        col.className,
                        cellBaseClassName
                      )}
                    >
                      {typeof content === 'string' || typeof content === 'number' ? (
                        <span
                          title={String(content)}
                          className="line-clamp-1 inline-flex items-center min-w-[80px]"
                        >
                          {content}
                        </span>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-gray-400 py-4">
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
