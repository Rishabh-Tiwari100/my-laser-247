import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Icons } from '@/utils/icons';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;

  className?: string;
  bodyClassName?: string;
  overlayClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  placement?: 'center' | 'top';

  closeText?: string;

  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  open,
  title,
  children,
  onClose,

  className,
  bodyClassName,
  overlayClassName,
  headerClassName,
  titleClassName,
  placement = 'center',

  closeText = 'Close',

  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  if (!open) return null;

  const modalUI = (
    <div
      className={clsx(
        'fixed inset-0 z-[2147483647] flex justify-center bg-black/40 px-4',
        placement === 'top' ? 'items-start' : 'items-center',
        overlayClassName
      )}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={clsx(
          'relative w-full max-w-[420px] overflow-hidden rounded-sm border border-gray-300 bg-white shadow-2xl',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={clsx(
            'relative border-b border-gray-300 bg-gray-100 px-4 py-2 flex items-center justify-between',
            headerClassName
          )}
        >
          <h2
            id="modal-title"
            className={clsx('text-sm font-semibold text-gray-700', titleClassName)}
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 transition bg-gray-500 hover:bg-gray-200"
          >
            <Icons.close className="size-5 text-white" />
          </button>
        </div>

        {/* Body */}
        <div
          className={clsx(
            'max-h-[420px] overflow-y-auto px-4 py-3 text-sm text-gray-700',
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {showCloseButton && (
          <div className="border-t border-gray-300 bg-gray-50 px-4 py-2">
            <button
              type="button"
              onClick={onClose}
              className="mx-auto block min-w-[120px] rounded-sm border border-gray-400 bg-btn-gradient hover:bg-btn-gradient-hover px-4 py-0.5 text-sm text-gray-700 transition"
            >
              {closeText}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalUI, document.body);
}
