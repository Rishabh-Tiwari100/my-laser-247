import * as Dialog from '@radix-ui/react-dialog';
import { mdiInformation } from '@mdi/js';
import { cn } from '@/utils';
import { getMarketRules } from './marketRules';

interface MarketInfoButtonProps {
  marketName: string;
  marketType?: string;
  className?: string;
}

export default function MarketInfoButton({
  marketName,
  marketType,
  className,
}: MarketInfoButtonProps) {
  const rules = getMarketRules(marketName, marketType);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={`Information for ${marketName}`}
          className={cn(
            'ml-[5px] inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
            className
          )}
        >
          <svg viewBox="0 0 24 24" className="size-[14px] fill-current" aria-hidden="true">
            <path d={mdiInformation} />
          </svg>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[5000000000000002] bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-[8px] z-[5000000000000003] flex h-[calc(100dvh-16px)] w-[calc(100%-16px)] max-w-[500px] -translate-x-1/2 flex-col overflow-hidden rounded-[3px] bg-white font-helvetica text-[14px] font-normal leading-[21px] text-[#6c757d] shadow-lg focus:outline-none sm:top-[28px] sm:h-[calc(100dvh-56px)]">
          <div className="relative shrink-0 bg-[linear-gradient(180deg,#123696_0%,#13a0dd_61%)] p-[16px] text-white">
            <Dialog.Title className="m-0 text-[22px] font-medium uppercase leading-[33px]">
              Rules
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {rules.title} rules for {marketName}
            </Dialog.Description>
            <Dialog.Close
              aria-label="Close market rules"
              className="absolute right-[10px] top-[16px] px-[6px] py-px text-[14px] font-normal leading-[21px] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">&times;</span>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-[5px] overscroll-contain">
            <div className="mx-[14px] pb-[64px] lg:px-[12px]">
              <h2 className="mb-[10px] text-[19px] font-bold uppercase leading-[20.9px] text-[#343a40]">
                {rules.title}
              </h2>
              <div
                className="[overflow-wrap:break-word] [&_table]:m-0 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#dee2e6] [&_td]:p-[5px] [&_td]:align-top [&_td]:text-[12px] [&_td]:leading-[18px] [&_td]:text-black"
                dangerouslySetInnerHTML={{ __html: rules.content }}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
