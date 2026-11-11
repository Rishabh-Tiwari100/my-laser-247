import { mdiClose } from '@mdi/js';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useGetFancyProfitLossQuery } from '@/store/api/booksetApi';

interface FancyExposureModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eventId?: string | number;
  selectionId?: string | number;
  marketId?: string | number;
}

export default function FancyExposureModal({
  open,
  onClose,
  title,
  eventId,
  selectionId,
  marketId,
}: FancyExposureModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const canFetch = Boolean(open && eventId && selectionId && marketId);
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
  } = useGetFancyProfitLossQuery(
    {
      eventId: Number(eventId),
      selectionId: String(selectionId ?? ''),
      marketId: String(marketId ?? ''),
    },
    { skip: !canFetch }
  );
  const loading = isLoading || isFetching;

  useEffect(() => {
    if (!open) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[5000000000000002] flex items-start justify-center bg-black/50 px-2 pt-[10px] font-[Arial,Helvetica,sans-serif]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-[500px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[5px] border border-black/20 bg-white p-[1px] text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fancy-exposure-title"
      >
        <header className="flex items-center justify-between bg-[#243a48] px-[15px] py-[4px] text-white">
          <h2 id="fancy-exposure-title" className="m-0 text-[14px] font-bold leading-[21px]">
            Book
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex h-[24px] w-[24px] items-center justify-center border-0 bg-transparent p-0 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
            aria-label="Close fancy exposure"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] fill-current" aria-hidden="true">
              <path d={mdiClose} />
            </svg>
          </button>
        </header>

        <div className="max-h-[calc(100dvh-80px)] overflow-y-auto p-[16px]">
          <table
            aria-label={title}
            className="w-full table-fixed border-collapse border-2 border-[#333] text-[13px] font-bold"
          >
            <thead>
              <tr>
                <th className="h-[28px] border border-[#333] bg-[#c8ced3] text-center font-bold">
                  Run
                </th>
                <th className="h-[28px] border border-[#333] bg-[#c8ced3] text-center font-bold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="h-[72px] border border-[#4c4c4c] text-center">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={2}
                    className="h-[72px] border border-[#4c4c4c] text-center text-[13px] text-[#666]"
                  >
                    Unable to load exposure
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => {
                  const profitLoss = Number(item.profit_or_loss ?? 0);
                  return (
                    <tr key={`${item.position}-${index}`}>
                      <td className="h-[26px] border border-[#333] text-center">{item.position}</td>
                      <td
                        className={`h-[26px] border border-[#333] text-center ${
                          profitLoss < 0 ? 'text-[#ef4e46]' : 'text-[#28a745]'
                        }`}
                      >
                        {Number(profitLoss.toFixed(2))}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2} className="h-[72px] border border-[#4c4c4c] text-center">
                    No exposure found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>,
    document.body
  );
}
