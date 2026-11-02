import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DepositAttachmentModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function DepositAttachmentModal({ imageUrl, onClose }: DepositAttachmentModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]')
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
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

  return createPortal(
    <div
      className="fixed inset-0 z-[5000000000000002] flex items-center justify-center bg-black/50 px-[8px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="flex w-[498px] max-w-[calc(100vw-16px)] flex-col items-center rounded-[7px] bg-white px-[8px] pb-[16px] pt-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-label="Deposit attachment"
      >
        <div className="flex h-[240px] w-[236px] max-w-full items-center justify-center overflow-hidden rounded-[6px] border border-[#c8c8c8] bg-white">
          {imageUnavailable ? (
            <p className="px-4 text-center text-[13px] text-[#667080]">
              Attachment preview is unavailable.
            </p>
          ) : (
            <img
              src={imageUrl}
              alt="Deposit payment attachment"
              className="h-full w-full object-fill"
              onError={() => setImageUnavailable(true)}
            />
          )}
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          className="mt-[18px] flex h-[40px] w-[100px] items-center justify-center rounded-[4px] bg-[#243a48] text-[16px] font-medium uppercase text-white hover:bg-[#162c3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12b6cf]"
          onClick={onClose}
        >
          Close
        </button>
      </section>
    </div>,
    document.body
  );
}
