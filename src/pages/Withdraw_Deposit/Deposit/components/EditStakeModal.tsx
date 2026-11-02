import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface EditStakeModalProps {
  open: boolean;
  isSaving?: boolean;
  stakes: number[];
  onClose: () => void;
  onSave: (stakes: number[]) => void | Promise<void>;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function EditStakeModal({
  open,
  isSaving = false,
  stakes,
  onClose,
  onSave,
}: EditStakeModalProps) {
  const [draftStakes, setDraftStakes] = useState(() => stakes.map(String));
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const hasInvalidStake = draftStakes.some((stake) => !stake || Number(stake) <= 0);

  useEffect(() => {
    if (!open) return undefined;

    setDraftStakes(stakes.map(String));
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isSaving) return;
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (!firstFocusableElement || !lastFocusableElement) return;
      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isSaving, onClose, open, stakes]);

  if (!open) return null;

  const updateStake = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setDraftStakes((currentStakes) =>
      currentStakes.map((stake, stakeIndex) => (stakeIndex === index ? value : stake))
    );
  };

  const submitStakes = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasInvalidStake) return;
    onSave(draftStakes.map(Number));
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[5000000000000004] flex items-center justify-center bg-black/50 px-[8px]"
      onMouseDown={(event) => {
        if (!isSaving && event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-[480px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[6px] bg-white font-[Arial,Helvetica,sans-serif] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <header className="flex h-[41px] items-center bg-[#243a48] px-[10px] text-white">
          <h2 id={titleId} className="text-[16px] font-bold leading-none">
            Edit Stake
          </h2>
        </header>

        <form onSubmit={submitStakes} className="px-[9px] pb-[8px] pt-[9px]">
          <div className="grid grid-cols-4 gap-[10px]">
            {draftStakes.map((stake, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={7}
                value={stake}
                onChange={(event) => updateStake(index, event.target.value)}
                aria-label={`Quick deposit stake ${index + 1}`}
                aria-invalid={!stake || Number(stake) <= 0}
                className="h-[33px] min-w-0 rounded-[5px] border border-[#aaa] px-[7px] text-center text-[14px] outline-none focus:border-[#243a48]"
              />
            ))}
          </div>

          <div className="mt-[10px] grid grid-cols-2 gap-[9px]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-[37px] rounded-[3px] border border-[#243a48] bg-white text-[14px] text-[#243a48] hover:bg-[#f3f5f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#12b6cf]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasInvalidStake || isSaving}
              className="h-[37px] rounded-[3px] bg-[#243a48] text-[14px] text-white hover:bg-[#162c3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#12b6cf] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}
