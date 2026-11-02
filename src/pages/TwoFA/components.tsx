import { useEffect, useMemo, useRef } from 'react';
import { FaArrowLeft, FaRegCopy } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils';
import { useClipboard } from '@/hooks';

type TwoFaShellProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  panelClassName?: string;
};

export function TwoFaShell({
  title,
  subtitle,
  icon,
  children,
  footer,
  className,
  panelClassName,
}: TwoFaShellProps) {
  const navigate = useNavigate();

  return (
    <div className={cn('w-full font-sans', className)} style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div
        className={cn(
          'relative mx-auto w-full max-w-[768px] overflow-y-auto overflow-x-hidden bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03)]',
          panelClassName
        )}
      >
        <div className="relative mb-[110px] h-[220px] bg-white px-4 pt-5 text-white sm:px-5 lg:px-5 max-[480px]:h-[200px]">
          <div className="absolute bottom-0 left-[-20%] z-0 h-[450px] w-[140%] rounded-[100%] bg-theme-navbar max-[480px]:h-[280px] overflow-hidden" />
          <div className="relative z-10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#484f79] text-white transition hover:bg-[#58608c]"
              aria-label="Go back"
            >
              <FaArrowLeft className="h-4 w-4" />
            </button>
            <div className="text-[16px] font-normal">{title}</div>
          </div>
          {subtitle && <div className="relative z-10 mt-1 max-w-[460px] text-[13px]">{subtitle}</div>}
          <div className="absolute bottom-[-65px] left-1/2 z-10 flex w-[120px] -translate-x-1/2 justify-center">
            {icon}
          </div>
        </div>

        <div className="px-5 pb-20 pt-0">
          {children}
        </div>
        {footer && (
          <div className="fixed bottom-[50px] left-1/2 z-[30] w-full max-w-[768px] -translate-x-1/2 border-0 bg-white px-4 pb-[35px] pt-6 shadow-[0_-1px_54px_rgba(0,0,0,0.1)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function SecurityBadge() {
  return (
    <img src="/icons/2fa-lock.svg" alt="security" className="h-auto w-[120px] object-contain" />
  );
}

export function GoogleBadge() {
  return (
    <img src="/icons/2fa-google.svg" alt="google" className="h-auto w-[120px] object-contain" />
  );
}

type CodeInputsProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CodeInputs({ value, onChange }: CodeInputsProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? '');

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const updateDigit = (index: number, nextValue: string) => {
    const sanitized = nextValue.replace(/\D/g, '').slice(0, 1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitized;
    onChange(nextDigits.join(''));

    if (sanitized && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="grid grid-cols-6 justify-between gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={digit}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digit && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            if (!pasted) return;

            const nextDigits = [...digits];
            pasted.split('').forEach((char, pastedIndex) => {
              nextDigits[pastedIndex] = char;
            });
            onChange(nextDigits.join(''));
            refs.current[Math.min(pasted.length, 5)]?.focus();
          }}
          maxLength={1}
          className="h-[40px] w-full min-w-0 rounded-[6px] border border-[#d5dbe0] bg-[#eef1f4] text-center text-[16px] font-medium text-[#2b3340] outline-none transition focus:border-[#1788ff] focus:bg-white focus:shadow-[0_0_0_1px_rgba(23,136,255,0.12)] sm:h-[42px] sm:w-[42px]"
        />
      ))}
    </div>
  );
}

type QrModalProps = {
  open: boolean;
  onClose: () => void;
  secretKey: string;
  qrCode?: string;
};

const buildQrMatrix = (seed: string, size = 21) => {
  let state = 0;
  for (let index = 0; index < seed.length; index += 1) {
    state = (state * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const isFinderPattern =
        (row < 7 && col < 7) ||
        (row < 7 && col >= size - 7) ||
        (row >= size - 7 && col < 7);

      if (isFinderPattern) {
        const inOuterSquare = row === 0 || col === 0 || row === 6 || col === 6;
        const inInnerSquare = row >= 2 && row <= 4 && col >= 2 && col <= 4;
        const inRing = row === 1 || row === 5 || col === 1 || col === 5;
        return inOuterSquare || inInnerSquare || inRing;
      }

      state = (state * 1664525 + 1013904223) >>> 0;
      return (state & 7) < 3;
    })
  );
};

export function QrModal({ open, onClose, secretKey, qrCode }: QrModalProps) {
  const matrix = useMemo(() => buildQrMatrix(secretKey), [secretKey]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[2147483647] flex items-end justify-start bg-black/45 px-0 pb-0 pt-14"
      aria-label="Close QR modal"
    >
      <div
        className="w-full max-w-[500px] rounded-t-[10px] bg-white p-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#2f86d8]" />
        <div className="mx-auto mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-[8px] border border-[#111] bg-white p-2">
          {qrCode ? (
            <img src={qrCode} alt="Authenticator QR code" className="h-full w-full object-contain" />
          ) : (
            <div className="grid h-full w-full grid-cols-[repeat(21,minmax(0,1fr))] gap-[1px] bg-white">
              {matrix.flatMap((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <span
                    key={`${rowIndex}-${colIndex}`}
                    className={cell ? 'bg-black' : 'bg-white'}
                  />
                ))
              )}
            </div>
          )}
        </div>
        <p className="text-[13px] leading-5 text-[#2f83d2]">
          Use your authenticator app to scan this QR.
        </p>
      </div>
    </div>
  );
}

type CopyKeyFieldProps = {
  value: string;
  disabled?: boolean;
};

export function CopyKeyField({ value, disabled = false }: CopyKeyFieldProps) {
  const { copy, isCopied } = useClipboard(1600);

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1 overflow-hidden rounded-[5px] border border-[#d4dce2] bg-[#eaf0f4] px-4 py-3 text-[14px] text-[#2e3947] shadow-[inset_0_1px_1px_rgba(255,255,255,0.75)]">
        <span className="block truncate">{value}</span>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => copy(value)}
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[7px] bg-[#dcecff] text-[#126bd6] transition hover:bg-[#cae0ff] disabled:cursor-not-allowed disabled:bg-[#edf1f5] disabled:text-[#93a0ad]"
        aria-label="Copy key"
      >
        {isCopied ? <span className="text-[12px] font-semibold">OK</span> : <FaRegCopy className="h-4 w-4" />}
      </button>
    </div>
  );
}

type IconCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function IconCard({ title, description, actionLabel, onAction }: IconCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-[382px] items-center justify-between rounded-[18px] border border-[#cfd6dc] bg-white px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.07)]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef3f8] text-[24px]">
          <span className="bg-[conic-gradient(from_45deg,#ea4335_0_25%,#fbbc05_25%_50%,#34a853_50%_75%,#4285f4_75%_100%)] bg-clip-text text-transparent">
            G
          </span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold text-[#1f2b3a]">{title}</div>
          <div className="truncate text-[12px] text-[#4b5a6c]">{description}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#5e6f81] transition hover:bg-[#f0f4f7] hover:text-[#126bd6]"
        aria-label={actionLabel}
      >
        <MdEdit className="h-5 w-5" />
      </button>
    </div>
  );
}
