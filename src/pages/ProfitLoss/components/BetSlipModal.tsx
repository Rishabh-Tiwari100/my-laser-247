import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { Download, X } from 'lucide-react';
import { useGetMyTransactionsQuery } from '@/store/api/transactionApi';
import type { ProfitLossEventGroup, ProfitLossMarketType } from '../types';
import ReportDateField from './ReportDateField';
import ProfitLossAmount from './ProfitLossAmount';
import {
  downloadCsv,
  filterTransactionsForProfitLossEvent,
  formatBalance,
  formatReportTimestamp,
  toFilenamePart,
  transactionsToLedgerRows,
} from '../profitLossUtils';

interface BetSlipModalProps {
  event: ProfitLossEventGroup;
  initialFromDate: string;
  initialToDate: string;
  marketType: ProfitLossMarketType;
  onClose: () => void;
}

interface ModalFilters {
  fromDate: string;
  toDate: string;
  search: string;
}

const modalControlClassName =
  'h-[34px] w-full min-w-0 rounded-[4px] border border-[#aeb3b7] bg-white px-[7px] font-[Arial,Helvetica,sans-serif] text-[14px] text-[#090909] outline-none placeholder:text-[#667080] focus:border-[#283f50] focus:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]';

const defaultPageSize = 10;

export default function BetSlipModal({
  event,
  initialFromDate,
  initialToDate,
  marketType,
  onClose,
}: BetSlipModalProps) {
  const initialFilters: ModalFilters = {
    fromDate: initialFromDate,
    toDate: initialToDate,
    search: '',
  };
  const [draftFilters, setDraftFilters] = useState<ModalFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ModalFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const eventIdParts = event.id.split(':');
  const eventId = eventIdParts[eventIdParts.length - 1];

  const fromDate = dayjs(appliedFilters.fromDate);
  const toDate = dayjs(appliedFilters.toDate);
  const { data, isFetching, isError } = useGetMyTransactionsQuery({
    page: currentPage,
    limit: defaultPageSize,
    ...(eventId && { eventId }),
    ...(fromDate.isValid() && { fromDate: fromDate.startOf('day').toISOString() }),
    ...(toDate.isValid() && { toDate: toDate.endOf('day').toISOString() }),
    ...(appliedFilters.search.trim() && { search: appliedFilters.search.trim() }),
  });

  const rows = useMemo(() => {
    const matchingTransactions = filterTransactionsForProfitLossEvent(
      data?.data ?? [],
      event,
      marketType
    );
    return transactionsToLedgerRows(matchingTransactions);
  }, [data?.data, event, marketType]);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') {
        onClose();
        return;
      }
      if (keyboardEvent.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (keyboardEvent.shiftKey && document.activeElement === firstFocusableElement) {
        keyboardEvent.preventDefault();
        lastFocusableElement?.focus();
      } else if (!keyboardEvent.shiftKey && document.activeElement === lastFocusableElement) {
        keyboardEvent.preventDefault();
        firstFocusableElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  const updateFilter = <Key extends keyof ModalFilters>(key: Key, value: ModalFilters[Key]) => {
    setDraftFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  };

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setCurrentPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const handleDownload = () => {
    downloadCsv(`bet-slip-${toFilenamePart(event.name)}.csv`, [
      ['Date', 'Description', 'P & L', 'Balance', 'Remark'],
      ...rows.map((row) => [
        formatReportTimestamp(row.timestamp),
        row.description,
        row.profitLoss,
        row.balance ?? '',
        row.remark || '-',
      ]),
    ]);
  };

  const totalRows = rows.length;
  const totalPages = Math.max(1, data?.pagination?.totalPage ?? 1);
  const firstEntry = totalRows === 0 ? 0 : 1;
  const lastEntry = totalRows;

  return createPortal(
    <div
      className="fixed inset-0 z-[5000000000000002] flex items-start justify-center bg-black/50 px-2 pt-[29px] max-md:pt-4"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <section
        ref={modalRef}
        className="w-[498px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[7px] bg-white font-[Arial,Helvetica,sans-serif] text-[12px] text-[#050505] shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profit-loss-bet-slip-title"
      >
        <header className="flex h-[41px] items-center justify-between bg-[#243a48] pl-[10px] pr-[7px] text-white">
          <h2 id="profit-loss-bet-slip-title" className="m-0 text-[14px] font-bold">
            Bet Slip
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex h-[30px] w-[22px] items-center justify-center border-0 bg-transparent p-0 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
            aria-label="Close bet slip"
            onClick={onClose}
          >
            <X className="h-[20px] w-[20px] stroke-[2]" aria-hidden="true" />
          </button>
        </header>

        <form className="px-[8px] pb-[8px] pt-[7px]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-[5px] gap-y-[6px]">
            <ReportDateField
              label="From"
              value={draftFilters.fromDate}
              max={draftFilters.toDate}
              onChange={(value) => updateFilter('fromDate', value)}
              compactLabel
            />
            <ReportDateField
              label="To"
              value={draftFilters.toDate}
              min={draftFilters.fromDate}
              onChange={(value) => updateFilter('toDate', value)}
              compactLabel
            />
          </div>

          <div className="mt-[5px] grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_36px] gap-[5px] max-[430px]:grid-cols-[minmax(0,1fr)_36px]">
            <input
              className={`${modalControlClassName} max-[430px]:col-span-2`}
              type="search"
              value={draftFilters.search}
              placeholder="Search"
              aria-label="Search bets"
              onChange={(inputEvent) => updateFilter('search', inputEvent.target.value)}
            />
            <button
              type="submit"
              className="flex h-[35px] items-center justify-center rounded-[4px] bg-[#222] text-[14px] font-bold text-white hover:bg-[#111]"
            >
              Submit
            </button>
            <button
              type="button"
              className="flex h-[35px] items-center justify-center rounded-[4px] bg-[#222] text-white hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Download bet slip"
              title="Download bet slip"
              disabled={rows.length === 0}
              onClick={handleDownload}
            >
              <Download className="h-[18px] w-[18px] stroke-[3]" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="mx-[8px] mb-[9px]">
          <div
            className="max-h-[275px] overflow-auto focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[#243a48]"
            role="region"
            aria-label={`Bets for ${event.name}`}
            aria-busy={isFetching}
            tabIndex={0}
          >
            <table className="w-max min-w-full table-auto border-collapse text-[12px]">
              <thead>
                <tr>
                  {['DATE', 'DESCRIPTION', 'P & L', 'BALANCE', 'REMARK'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="h-[28px] whitespace-nowrap border border-[#aeb0b2] bg-[#e7e7e7] px-[5px] py-0 text-center font-bold leading-[27px]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isError ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-[62px] border border-[#aeb0b2] text-center text-[#666]"
                    >
                      Unable to load bets
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td className="h-[29px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-left leading-[28px]">
                        {formatReportTimestamp(row.timestamp)}
                      </td>
                      <td
                        className="h-[29px] min-w-0 break-words border border-[#aeb0b2] px-[5px] py-[6px] text-left leading-[18px]"
                        title={row.description}
                      >
                        {row.description}
                      </td>
                      <td className="h-[29px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[28px]">
                        <ProfitLossAmount value={row.profitLoss} className="font-normal" />
                      </td>
                      <td className="h-[29px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[28px] text-[#00a000]">
                        {formatBalance(row.balance)}
                      </td>
                      <td className="h-[29px] whitespace-nowrap border border-[#aeb0b2] px-[5px] py-0 text-center leading-[28px]">
                        {row.remark || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-[62px] border border-[#aeb0b2] text-center text-[#666]"
                    >
                      No bets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-[8px] flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e2e2] pt-[8px] text-[12px] text-[#333]">
            <span>
              Showing {firstEntry} to {lastEntry} of {totalRows} entries
            </span>
            <div className="flex items-center gap-[4px]">
              <button
                type="button"
                className="h-[24px] min-w-[24px] rounded border border-[#d3d3d3] bg-white px-[6px] text-[11px] font-bold text-[#050505] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage <= 1}
              >
                «
              </button>
              <span className="min-w-[28px] rounded border border-[#243a48] bg-[#243a48] px-[6px] text-center text-[11px] font-bold text-white">
                {currentPage}
              </span>
              <button
                type="button"
                className="h-[24px] min-w-[24px] rounded border border-[#d3d3d3] bg-white px-[6px] text-[11px] font-bold text-[#050505] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage >= totalPages}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
