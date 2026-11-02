import { MouseEvent, useEffect, useState } from 'react';
import {
  FiCheckCircle,
  FiCopy,
  FiDownload,
  FiInfo,
  FiMaximize2,
  FiShare2,
  FiX,
} from 'react-icons/fi';
import type { DepositUpiAccount } from '@/types/account';
import { useClipboard } from '@/hooks';
import HoverTooltip from '@/components/common/HoverTooltip';
import toast from 'react-hot-toast';

interface UpiAccountCardProps {
  active: boolean;
  account: DepositUpiAccount;
  onSelect: () => void;
}

const firstText = (...values: unknown[]) => {
  const value = values.find(
    (candidate) => typeof candidate === 'string' && candidate.trim().length > 0
  );
  return typeof value === 'string' ? value.trim() : '';
};

export const getUpiDisplayName = (account: DepositUpiAccount) =>
  firstText(account.name) || 'UPI ACCOUNT';

export const getUpiId = (account: DepositUpiAccount) => firstText(account.upiId, account.number);

export const getUpiQr = (account: DepositUpiAccount) => firstText(account.qrCode);

const qrImageStyle = {
  imageRendering: 'pixelated',
} as const;

function UpiQrDialog({
  account,
  mode,
  onClose,
}: {
  account: DepositUpiAccount;
  mode: 'preview' | 'share';
  onClose: () => void;
}) {
  const { copy } = useClipboard();
  const displayName = getUpiDisplayName(account);
  const upiId = getUpiId(account);
  const qr = getUpiQr(account);
  const isPreview = mode === 'preview';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} UPI details`,
          text: `UPI ID: ${upiId}`,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await copy(upiId);
  };

  return (
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      {isPreview ? (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="UPI QR code"
          className="max-h-[calc(100svh-32px)] w-full max-w-[560px] overflow-y-auto rounded-[8px] bg-white px-4 py-8 shadow-2xl sm:px-6"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-5">
            {qr ? (
              <img
                src={qr}
                alt={`${displayName} UPI QR code`}
                style={qrImageStyle}
                className="aspect-square h-auto max-h-[min(68svh,480px)] w-full max-w-[min(82vw,480px)] object-contain"
              />
            ) : (
              <div className="flex aspect-square max-h-[min(68svh,480px)] w-full max-w-[min(82vw,480px)] items-center justify-center border border-dashed border-[#999] text-[12px] text-[#667080]">
                QR unavailable
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-w-[100px] rounded-[6px] bg-[#243a48] px-7 py-2 text-[16px] font-medium uppercase text-white transition hover:bg-[#1a2d39]"
            >
              Close
            </button>
          </div>
        </section>
      ) : (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Share UPI QR code"
          className="w-full max-w-[500px] overflow-hidden rounded-[7px] bg-white shadow-2xl"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <header className="flex h-[42px] items-center justify-between bg-[#243a48] px-[11px] text-[15px] font-bold text-white">
            <span>Share</span>
            <button type="button" onClick={onClose} aria-label="Close QR dialog">
              <FiX className="h-[22px] w-[22px]" />
            </button>
          </header>
          <div className="flex min-h-[116px] items-center justify-center px-[10px] py-[18px]">
            {qr ? (
              <img
                src={qr}
                alt={`${displayName} UPI QR code`}
                style={qrImageStyle}
                className="aspect-square h-auto max-h-[min(54svh,260px)] w-full max-w-[min(70vw,260px)] object-contain"
              />
            ) : (
              <div className="flex aspect-square max-h-[min(54svh,260px)] w-full max-w-[min(70vw,260px)] items-center justify-center border border-dashed border-[#999] text-[12px] text-[#667080]">
                QR unavailable
              </div>
            )}
          </div>
          <footer className="grid grid-cols-2 gap-[3px] px-[30px] pb-[10px]">
            <button
              type="button"
              onClick={onClose}
              className="h-[33px] rounded-[4px] border border-[#243a48] text-[12px]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={share}
              className="h-[33px] rounded-[2px] bg-[#243a48] text-[12px] text-white"
            >
              Share
            </button>
          </footer>
        </section>
      )}
    </div>
  );
}

function UpiAccountCard({ active, account, onSelect }: UpiAccountCardProps) {
  const [dialogMode, setDialogMode] = useState<'preview' | 'share' | null>(null);
  const { copy } = useClipboard();
  const displayName = getUpiDisplayName(account);
  const upiId = getUpiId(account);
  const qr = getUpiQr(account);

  const downloadQr = async () => {
    if (!qr) return;

    const downloadFile = (href: string) => {
      const link = document.createElement('a');
      link.href = href;
      link.download = `${displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'upi-qr'}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    try {
      const response = await fetch(qr);
      if (!response.ok) {
        throw new Error(`Failed to fetch QR: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      downloadFile(objectUrl);
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch {
      try {
        downloadFile(qr);
      } catch {
        toast.error('Unable to download the QR code right now.', { id: 'deposit-qr-download' });
      }
    }
  };

  const stopAndRun =
    (callback: () => void) => (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      event.stopPropagation();
      callback();
    };

  return (
    <>
      <article
        className={`relative min-h-[210px] min-w-[240px] flex-1 cursor-pointer overflow-hidden rounded-[4px] border bg-white sm:w-full${
          active ? 'border-[2px] border-[#0d3ead]' : 'border-[#c8c8c8]'
        }`}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <header
          className={`flex h-[32px] items-center justify-between px-[7px] text-[13px] font-bold text-white ${
            active ? 'bg-[#123a9c]' : 'bg-[#557d9e]'
          }`}
        >
          <span className="truncate pr-2">{displayName.toUpperCase()}</span>
          {active && (
            <FiCheckCircle
              className="h-[20px] w-[20px] shrink-0 fill-[#7fc681] text-white"
              aria-label="Selected account"
            />
          )}
        </header>

        <div className="px-[9px] pt-[2px] text-[12px] sm:text-[15px]">
          <div className="grid grid-cols-[96px_minmax(0,1fr)_20px] items-center leading-[25px] sm:grid-cols-[118px_minmax(0,1fr)_22px]">
            <span>Display Name</span>
            <strong className="truncate" title={displayName}>
              :&nbsp; {displayName.toUpperCase()}
            </strong>
            <button
              type="button"
              onClick={stopAndRun(() => copy(displayName))}
              className="flex items-center justify-center"
              aria-label="Copy display name"
            >
              <FiCopy className="h-[16px] w-[16px]" />
            </button>
          </div>
          <div className="grid grid-cols-[96px_minmax(0,1fr)_20px] items-center leading-[25px] sm:grid-cols-[118px_minmax(0,1fr)_22px]">
            <span>UPI ID</span>
            <strong className="truncate" title={upiId}>
              :&nbsp; {upiId || '-'}
            </strong>
            <button
              type="button"
              onClick={stopAndRun(() => copy(upiId))}
              disabled={!upiId}
              className="flex items-center justify-center disabled:opacity-40"
              aria-label="Copy UPI ID"
            >
              <FiCopy className="h-[16px] w-[16px]" />
            </button>
          </div>
        </div>

        <div className="flex justify-center px-[6px] pb-[16px] pt-[12px]">
          {qr ? (
            <img
              src={qr}
              alt={`${displayName} UPI QR code`}
              style={qrImageStyle}
              className="aspect-square h-auto w-[135px] max-w-[calc(100%-48px)] object-contain"
            />
          ) : (
            <div className="flex aspect-square w-[135px] max-w-[calc(100%-48px)] items-center justify-center border border-dashed border-[#999] text-center text-[10px] text-[#667080]">
              QR unavailable
            </div>
          )}
        </div>

        <div className="absolute bottom-[10px] right-[8px] flex flex-col gap-[3px]">
          <button
            type="button"
            onClick={stopAndRun(() => setDialogMode('preview'))}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[5px] bg-[#f5f5f5] shadow"
            aria-label="View full size QR code"
          >
            <FiMaximize2 className="h-[14px] w-[14px]" />
          </button>
          <button
            type="button"
            onClick={stopAndRun(() => setDialogMode('share'))}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[5px] bg-[#f5f5f5] shadow"
            aria-label="Share UPI QR code"
          >
            <FiShare2 className="h-[14px] w-[14px]" />
          </button>
          {qr ? (
            <button
              type="button"
              onClick={stopAndRun(() => {
                void downloadQr();
              })}
              className="flex h-[24px] w-[24px] items-center justify-center rounded-[5px] bg-[#f5f5f5] shadow"
              aria-label="Download UPI QR code"
            >
              <FiDownload className="h-[14px] w-[14px]" />
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-[24px] w-[24px] items-center justify-center rounded-[5px] bg-[#f5f5f5] opacity-40 shadow"
              aria-label="QR code unavailable for download"
            >
              <FiDownload className="h-[14px] w-[14px]" />
            </button>
          )}
          <HoverTooltip
            position="left"
            content="Pay only to this UPI ID and keep your payment receipt."
            width="w-[182px]"
          >
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              className="flex h-[24px] w-[24px] items-center justify-center rounded-[5px] bg-[#f5f5f5] shadow"
              aria-label="UPI payment information"
            >
              <FiInfo className="h-[14px] w-[14px]" />
            </button>
          </HoverTooltip>
        </div>
      </article>

      {dialogMode && (
        <UpiQrDialog account={account} mode={dialogMode} onClose={() => setDialogMode(null)} />
      )}
    </>
  );
}

export default UpiAccountCard;
