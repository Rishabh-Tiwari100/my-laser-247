import { useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from '@/utils/icons';

interface DeleteAccountModalProps {
  open: boolean;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteAccountModal({ open, isDeleting, onConfirm, onCancel }: DeleteAccountModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isDeleting) onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isDeleting, onCancel]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[5000000000000005] flex items-center justify-center bg-black/50 px-[8px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onCancel();
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
            Delete
          </h2>
        </header>

        <div className="flex flex-col items-center gap-[10px] px-[16px] py-[22px] text-center">
          <span className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#f1f1f4] text-[#243a48]">
            <Icons.delete className="h-[26px] w-[26px]" />
          </span>
          <h3 className="text-[16px] font-semibold">Delete Account?</h3>
          <p className="text-[13px] text-[#555]">Are you sure you want to, delete this account?</p>
        </div>

        <div className="grid grid-cols-2 gap-[8px] p-[10px] pt-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-[38px] rounded-[4px] bg-[#e94f4f] text-[14px] font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-[38px] rounded-[4px] bg-[#1fb15f] text-[14px] font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Yes'}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}

export default DeleteAccountModal;
