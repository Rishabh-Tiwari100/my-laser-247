import { useState } from 'react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import { cn } from '@/lib/utils';
import { useBetSlip } from '../hooks/useBetSlip';
import NotOutLoader from '@/components/common/NotOutLoader';
import StakeModal from '@/components/common/StakeModal';
import { formatStakeLimit } from './stakeLimit';

const BetSlip = ({ eventId }: { eventId?: string | number | null }) => {
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const {
    betDetails,
    isPlacingBet,
    stakesLoader,
    stakesArr,
    handleStakeChange,
    handleRateChange,
    handlePlaceBet,
    handleClear,
    handleReset,
    increaseStake,
    increaseOdds,
    decreaseOdds,
    refetchStakes,
  } = useBetSlip(eventId);
  const { marketName, betOn, rate, stake, min, max, marketType } = betDetails;
  const isLay = betOn === 'LAY';
  const canAdjustOdds =
    (marketName?.toLowerCase() === 'match odds' && marketType === 'NORMAL') ||
    /khad/i.test(marketName ?? '');
  const cancelClassName =
    'h-[38px] w-full rounded-[4px] border border-[#333] bg-[#ff6a6a] p-0 text-center text-[14px] font-bold uppercase leading-[30px] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-black';
  const placeClassName =
    'h-[38px] w-full rounded-[5px] border-2 border-black bg-[#00a105] p-0 text-center text-[14px] font-bold uppercase leading-[30px] text-white disabled:cursor-not-allowed disabled:border-[#aaa] disabled:bg-[#a4a4a4] disabled:text-[#e6dfcd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black';
  const stepClassName =
    'flex h-[40px] w-[40px] shrink-0 items-center justify-center bg-[linear-gradient(-180deg,#fff_0%,#eee_89%)] p-0 text-black first:rounded-l-[3px] last:rounded-r-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#243a48]';
  const inputClassName =
    'h-[40px] min-w-0 flex-1 border-0 bg-white p-0 text-center text-[15px] font-bold leading-normal text-black outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#243a48] max-lg:h-[41px]';
  const placeDisabled = isPlacingBet || !stake || !rate;

  return (
    <section
      aria-label={`${isLay ? 'Lay' : 'Back'} betslip`}
      className={cn(
        'relative w-full min-w-0 font-helvetica text-black',
        isLay ? 'bg-[#faeff2]' : 'bg-[#d4e8f8]'
      )}
    >
      {isPlacingBet ? (
        <NotOutLoader size="sm" className="absolute z-[100] bg-black/50 backdrop-blur-0" />
      ) : null}
      <div
        className={cn(
          'flex justify-end py-[2px] lg:py-[4px]',
          isLay ? 'bg-[#f3dce2]' : 'bg-[#beddf4]'
        )}
      >
        <div className="flex w-full min-w-0 items-center lg:px-[12px] 2xl:w-2/3">
          <div className="hidden w-1/6 lg:block">
            <button type="button" onClick={handleReset} className={cancelClassName}>
              Cancel
            </button>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-2 lg:w-7/12 lg:flex-none lg:grid-cols-12">
            <div className="flex min-w-0 px-[4px] lg:col-span-7">
              {canAdjustOdds ? (
                <button
                  type="button"
                  aria-label="Decrease odds"
                  onClick={decreaseOdds}
                  className={stepClassName}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[20px] w-[20px] fill-current"
                    aria-hidden="true"
                  >
                    <path d={mdiMinus} />
                  </svg>
                </button>
              ) : null}
              <input
                type="text"
                inputMode="decimal"
                aria-label="Odds"
                value={rate ?? ''}
                onChange={(event) => handleRateChange(event.target.value)}
                className={cn(inputClassName, !canAdjustOdds && 'rounded-[3px]')}
              />
              {canAdjustOdds ? (
                <button
                  type="button"
                  aria-label="Increase odds"
                  onClick={increaseOdds}
                  className={stepClassName}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[20px] w-[20px] fill-current"
                    aria-hidden="true"
                  >
                    <path d={mdiPlus} />
                  </svg>
                </button>
              ) : null}
            </div>
            <div className="flex min-w-0 px-[4px] lg:col-span-5">
              <button
                type="button"
                aria-label="Decrease stake"
                onClick={() => handleStakeChange(String(Math.max(0, Number(stake || 0) - 1)))}
                className={cn(stepClassName, 'lg:hidden')}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[20px] w-[20px] fill-current"
                  aria-hidden="true"
                >
                  <path d={mdiMinus} />
                </svg>
              </button>
              <input
                type="text"
                inputMode="numeric"
                aria-label="Stake"
                placeholder={`Min: ${min ?? '000'}`}
                value={stake ?? ''}
                onChange={(event) => handleStakeChange(event.target.value)}
                className={cn(inputClassName, 'lg:rounded-[3px]')}
              />
              <button
                type="button"
                aria-label="Increase stake"
                onClick={() => handleStakeChange(String(Number(stake || 0) + 1))}
                className={cn(stepClassName, 'lg:hidden')}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[20px] w-[20px] fill-current"
                  aria-hidden="true"
                >
                  <path d={mdiPlus} />
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden w-1/4 px-[12px] lg:block">
            <button
              type="button"
              onClick={handlePlaceBet}
              disabled={placeDisabled}
              className={placeClassName}
            >
              {isPlacingBet ? 'Placing Bet...' : 'Place Bet'}
            </button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          'border-t py-[1px] lg:py-[4px]',
          isLay ? 'border-[#dfa3b3]' : 'border-[#7dbbe9]'
        )}
      >
        <div className="grid grid-cols-4 gap-[3px] px-[3px] pt-[5px] lg:grid-cols-8 lg:gap-[2px] lg:px-[12px] lg:pt-0">
          {stakesLoader ? (
            <div className="col-span-full h-[30px] text-center text-[12px] leading-[30px] text-[#555]">
              Loading stakes...
            </div>
          ) : stakesArr.length ? (
            stakesArr.map(({ label, value }, index) => (
              <button
                key={index}
                type="button"
                onClick={() => increaseStake(Number(value))}
                className="h-[30px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-[2px] border-0 bg-white p-0 text-center text-[13px] font-medium leading-[30px] text-black hover:bg-[#ff0] focus-visible:bg-[#ff0] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#333] lg:h-[31px] lg:rounded-[4px] lg:border lg:border-[#333] lg:bg-[#eee] lg:font-normal lg:leading-[29px]"
              >
                {label || value}
              </button>
            ))
          ) : (
            <div className="col-span-full h-[30px] text-center text-[12px] leading-[30px] text-[#555]">
              No stake values found
            </div>
          )}
        </div>
        <div className="mt-[5px] grid grid-cols-4 gap-[3px] px-[3px] pb-[3px] text-[13px] font-bold leading-[30px]">
          <button
            type="button"
            onClick={() => handleStakeChange(String(min ?? 0))}
            className="h-[30px] min-w-0 rounded-[2px] bg-[#ff0] p-0"
          >
            MIN
          </button>
          <button
            type="button"
            onClick={() => handleStakeChange(String(max ?? 0))}
            className="h-[30px] min-w-0 rounded-[2px] bg-[#243a48] p-0 text-white"
          >
            MAX
          </button>
          <button
            type="button"
            onClick={() => setIsStakeModalOpen(true)}
            className="h-[30px] min-w-0 rounded-[2px] bg-[#008000] p-0 text-white"
          >
            Edit Stake
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="h-[30px] min-w-0 rounded-[2px] bg-[#f00] p-0 text-white"
          >
            CLEAR
          </button>
        </div>
      </div>
      {marketType === 'FANCY' ? (
        <div className="px-[12px] py-[1px] text-[12px] leading-[18px] text-[#ef4e46]">
          min:{formatStakeLimit(min)} max:{formatStakeLimit(max)}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-[4px] py-[1px] lg:hidden">
        <button type="button" onClick={handleReset} className={cancelClassName}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePlaceBet}
          disabled={placeDisabled}
          className={placeClassName}
        >
          {isPlacingBet ? 'Placing Bet...' : 'Place Bet'}
        </button>
      </div>
      {isStakeModalOpen ? (
        <StakeModal
          onClose={() => setIsStakeModalOpen(false)}
          onSaved={async () => {
            await refetchStakes();
          }}
        />
      ) : null}
    </section>
  );
};

export default BetSlip;
