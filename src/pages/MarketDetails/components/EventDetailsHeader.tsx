import dayjs from 'dayjs';

interface EventDetailsHeaderProps {
  eventName?: string;
  startTime?: string;
  inplay?: boolean;
  scorecardOpen: boolean;
  onToggleScorecard: () => void;
  onOpenBets: () => void;
}

export default function EventDetailsHeader({
  eventName,
  startTime,
  inplay,
  scorecardOpen,
  onToggleScorecard,
  onOpenBets,
}: EventDetailsHeaderProps) {
  const validStartTime = startTime && dayjs(startTime).isValid();

  return (
    <div className="flex min-h-[35px] items-center bg-[#212121] px-[5px] py-[5px] font-helvetica text-[12px] leading-[13.2px] text-white lg:text-[15px] lg:leading-[16.5px]">
      <h1 className="m-0 min-w-0 basis-[55%] truncate pr-[5px] font-normal">
        {eventName || 'Event details'}
      </h1>
      <span className="animate-event-status shrink-0 rounded-[3px] bg-yellow-300 px-[5px] py-[2px] text-[10px] font-bold leading-[11px] text-black motion-reduce:animate-none lg:text-[12px] lg:leading-[13.2px]">
        {inplay
          ? 'In Play'
          : validStartTime
            ? dayjs(startTime).format('DD/MM/YYYY HH:mm')
            : 'Upcoming'}
      </span>
      <button
        type="button"
        onClick={onToggleScorecard}
        aria-label="Toggle scorecard"
        aria-expanded={scorecardOpen}
        aria-controls="event-scorecard"
        className="ml-[5px] flex h-[25px] w-[30px] shrink-0 items-center justify-end rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 lg:ml-auto"
      >
        <img src="/icons/scorecard.webp" alt="" className="h-[25px] w-[25px] object-contain brightness-0 invert" />
      </button>
      <button
        type="button"
        onClick={onOpenBets}
        className="ml-auto shrink-0 rounded-[2px] bg-[#243a48] px-[5px] py-[1px] text-[12px] leading-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 lg:hidden"
      >
        BETS
      </button>
    </div>
  );
}
