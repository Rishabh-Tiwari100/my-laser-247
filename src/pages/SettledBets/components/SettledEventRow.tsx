import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import SettledBetTable from './SettledBetTable';
import type { SettledEventGroup } from '../types';

interface SettledEventRowProps {
  event: SettledEventGroup;
  index: number;
  expanded: boolean;
  isLoading?: boolean;
  betTableVariant?: 'settled' | 'unsettled';
  detailFooter?: ReactNode;
  onToggle: () => void;
}

export default function SettledEventRow({
  event,
  index,
  expanded,
  isLoading = false,
  betTableVariant = 'unsettled',
  detailFooter,
  onToggle,
}: SettledEventRowProps) {
  const headingId = `settled-event-${index}`;
  const detailsId = `${headingId}-bets`;

  return (
    <article className="overflow-hidden rounded-[5px] bg-white shadow-[0_4px_9px_rgba(0,0,0,0.20)]">
      <button
        id={headingId}
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailsId}
        className="group flex min-h-[50px] w-full items-center justify-between gap-[8px] bg-white py-[5px] pl-[10px] pr-[10px] text-left text-[#050505] transition-colors hover:bg-[#fafafa] focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#257da9] lg:min-h-[54px] lg:pl-[15px]"
      >
        <span className="flex min-w-0 items-start gap-[10px]">
          <span className="shrink-0 text-[14px] leading-[17px]">{index + 1}.</span>
          <span className="min-w-0">
            <span className="block break-words text-[14px] leading-[17px]">{event.name}</span>
            <span className="mt-[1px] block text-[12px] font-bold leading-[14px]">
              {event.startsAt}
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-[8px] lg:gap-[16px]">
          <span className="flex h-[28px] min-w-[34px] items-center justify-center rounded-[5px] bg-[#243a48] px-[7px] text-[12px] font-bold text-white">
            {event.betCount ?? event.bets.length}
          </span>
          <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black text-white transition-colors group-hover:bg-[#243a48]">
            {expanded ? (
              <Minus className="h-[12px] w-[12px] stroke-[3]" aria-hidden="true" />
            ) : (
              <Plus className="h-[12px] w-[12px] stroke-[3]" aria-hidden="true" />
            )}
          </span>
        </span>
      </button>

      {expanded && (
        <div id={detailsId}>
          <SettledBetTable
            bets={event.bets}
            labelledBy={headingId}
            emptyMessage={isLoading ? 'Loading Bets...' : 'No Bets Found'}
            variant={betTableVariant}
          />
          {detailFooter}
        </div>
      )}
    </article>
  );
}
