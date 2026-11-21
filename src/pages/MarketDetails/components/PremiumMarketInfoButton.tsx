import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDownCircle, Info } from 'lucide-react';

interface PremiumMarketInfoButtonProps {
  container: HTMLElement | null;
}

const ruleFiles = [
  { label: 'Inplay', file: 'cricket-inplay.pdf', width: 'w-[87px]' },
  { label: 'Pre-Match', file: 'cricket-pre-match.pdf', width: 'w-[102px]' },
];

export default function PremiumMarketInfoButton({ container }: PremiumMarketInfoButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) container?.scrollIntoView?.({ block: 'center' });
        setOpen(nextOpen);
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Premium market information"
          className="flex h-[32px] w-[32px] shrink-0 items-center justify-center border-r border-white bg-[#50b7ea] text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
        >
          <Info size={22} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      {container && (
        <Dialog.Portal container={container}>
          <Dialog.Overlay className="absolute inset-0 z-20 bg-black/50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="absolute left-1/2 top-1/2 z-20 w-[264px] max-w-[calc(100%-16px)] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-[#f2f2f2] px-[32px] py-[20px] font-[Roboto,Helvetica,Arial,sans-serif] text-[#222] shadow-[0_12px_24px_rgba(0,0,0,0.3)] focus:outline-none"
          >
            <Dialog.Title className="mb-[12px] text-center text-[16px] font-bold leading-[20px]">
              Rules
            </Dialog.Title>
            <div className="flex justify-center gap-[10px]">
              {ruleFiles.map(({ label, file, width }) => (
                <Dialog.Close asChild key={file}>
                  <a
                    href={`/files/${file}`}
                    download={file}
                    className={`flex min-h-[84px] shrink-0 flex-col items-center justify-center rounded-[4px] border border-[#007bff] px-[8px] py-[8px] text-center text-[10px] leading-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#007bff] ${width}`}
                    aria-label={`Download ${label} Cricket Rules`}
                  >
                    <ArrowDownCircle
                      size={30}
                      strokeWidth={2.5}
                      className="mb-[2px] text-[#a825ba]"
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                    <span className="whitespace-nowrap">Cricket Rules</span>
                  </a>
                </Dialog.Close>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
