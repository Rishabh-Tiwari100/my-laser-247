import { useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from '@/utils/icons';

interface CancelRequestModalProps {
  open: boolean;
  requestType: 'deposit' | 'withdraw';
  amount?: string;
  isCanceling?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function CancelRequestModal({
  open,
  requestType,
  amount,
  isCanceling,
  onConfirm,
  onCancel,
}: CancelRequestModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isCanceling) {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isCanceling, onCancel]);

  if (!open) return null;

  const requestLabel = requestType === 'deposit' ? 'deposit' : 'withdraw';

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[5000000000000007] flex items-center justify-center bg-black/50 px-[8px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isCanceling) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-[380px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[6px] bg-white font-[Arial,Helvetica,sans-serif] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <header className="flex h-[42px] items-center bg-[#243a48] px-[11px] text-white">
          <h2 id={titleId} className="text-[16px] font-bold leading-none">
            Cancel Request
          </h2>
        </header>

        <div className="flex flex-col items-center gap-[10px] px-[16px] py-[22px] text-center">
          <span className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#f1f1f4] text-[#c22b2b]">
            <Icons.delete className="h-[26px] w-[26px]" />
          </span>
          <h3 className="text-[16px] font-semibold">
            Cancel {requestLabel} request?
          </h3>
          <p className="text-[13px] text-[#555]">
            {amount ? `Amount: ${amount}` : `This ${requestLabel} request is pending.`}
          </p>
          <p className="text-[13px] text-[#555]">
            This action cannot be undone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[8px] p-[10px] pt-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isCanceling}
            className="h-[38px] rounded-[4px] bg-[#e94f4f] text-[14px] font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isCanceling}
            className="h-[38px] rounded-[4px] bg-[#1fb15f] text-[14px] font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            {isCanceling ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}

export default CancelRequestModal;
