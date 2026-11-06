import { formatStakeLimitRange, type StakeLimitValue } from './stakeLimit';

export default function MarketOddsHeader({
  min,
  max,
  bookmaker = false,
}: {
  min: StakeLimitValue;
  max: StakeLimitValue;
  bookmaker?: boolean;
}) {
  return (
    <div
      className={`grid h-[29px] grid-cols-12 border-x border-b border-[#7e97a7] text-black ${bookmaker ? 'bg-[#faf8d8]' : 'bg-white'}`}
    >
      <div className="col-span-7 flex items-center justify-center gap-[6px] border-[3px] border-white bg-[#bed5d8] px-[5px] text-[9px] lg:invisible lg:col-span-5">
        <span className="text-[#315195]">Min/Max</span>
        {formatStakeLimitRange(min, max)}
      </div>
      <div className="col-span-5 grid grid-cols-2 text-center text-[13px] font-bold lg:col-span-7 lg:grid-cols-6">
        <div className="hidden lg:col-span-2 lg:block" />
        <div className="flex items-center justify-center border-r border-white lg:bg-[#72bbef]">
          Back
        </div>
        <div className="flex items-center justify-center border-r border-white lg:bg-[#faa9ba]">
          Lay
        </div>
        <div className="col-span-2 hidden items-center justify-center gap-[6px] border-[3px] border-white bg-[#bed5d8] text-[9px] lg:flex">
          <span className="text-[#315195]">Min/Max</span>
          {formatStakeLimitRange(min, max)}
        </div>
      </div>
    </div>
  );
}
