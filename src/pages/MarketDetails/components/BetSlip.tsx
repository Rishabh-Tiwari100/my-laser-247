import React, { useState } from 'react';
import { Icons } from '@/utils/icons';
import toast from 'react-hot-toast';
import { valueFormatter } from '@/utils';
import { useBetSlip } from '../hooks/useBetSlip';
import NotOutLoader from '@/components/common/NotOutLoader';
import StakeModal from '@/components/common/StakeModal';

const BetSlip = ({ eventId }: { eventId?: string | number | null }) => {
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const {
    tab,
    setTab,
    acceptOddsChange,
    setAcceptOddsChange,
    setIsLiveTvOpen,
    betDetails,
    betPL,
    availableBalance,
    isPlacingBet,
    isLiveTvOpen,
    stakesLoader,
    stakesArr,
    isDemoUser,
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
  const { runnerName, marketName, betOn, rate, stake, min, max, marketType } = betDetails;

  const isOddsChangeButtonDisabled =
    marketName?.toLowerCase() === 'match odds' && marketType?.toLowerCase() === 'normal'
      ? false
      : true;
  return (
    <div className="h-full w-full lg:rounded-lg bg-blue-100 font-inter py-[5px] px-[4px]">
      {/* CARD BODY */}
      <div className="">
        <div className="relative">
          {/* bet-placement loader */}
          {isPlacingBet ? (
            <NotOutLoader size="sm" className={'absolute z-[100] bg-black/50 backdrop-blur-0'} />
          ) : null}

          {/* Top Header - Accept Odds + Available Balance */}
          <div className="px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                onClick={() => setAcceptOddsChange(!acceptOddsChange)}
                className={`w-10 h-6 rounded-full cursor-pointer relative transition-colors ${
                  acceptOddsChange ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                    acceptOddsChange ? 'translate-x-4' : ''
                  }`}
                ></div>
              </div>
              <span className="font-semibold text-sm text-gray-800">Accept any odds</span>
            </div>
            <span className="min-w-0 shrink-0 text-right text-xs font-bold text-gray-700">
              Aval Bal: <span className="text-green-500">{availableBalance}</span>
            </span>
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <div className="flex items-center rounded-sm h-9 bg-white">
              <button
                type="button"
                onClick={() => decreaseOdds()}
                className="h-9 flex items-center justify-center rounded-[4px_0px_0px_4px] w-10 bg-[linear-gradient(-180deg,_#fff_0%,_#eee_89%)] text-[20px] text-center text-black"
              >
                -
              </button>
              <input
                type="text"
                value={rate ?? ''}
                onChange={(e) => handleRateChange(e.target.value)}
                className="h-[30px] text-center text-[15px] w-full focus:outline-none"
              />
              <button
                type="button"
                onClick={() => increaseOdds()}
                className="h-9 flex items-center justify-center rounded-[0px_4px_4px_0px] w-10 bg-[linear-gradient(-180deg,_#fff_0%,_#eee_89%)] text-[20px] text-center text-black"
              >
                +
              </button>
            </div>
            <div className="flex items-center rounded-sm h-9 bg-white">
              <button
                type="button"
                onClick={() => handleStakeChange(String(Math.max(0, Number(stake || 0) - 1)))}
                className="h-9 flex items-center justify-center rounded-[4px_0px_0px_4px] w-10 bg-[linear-gradient(-180deg,_#fff_0%,_#eee_89%)] text-[20px] text-center text-black"
              >
                -
              </button>
              <input
                type="text"
                value={stake ?? ''}
                onChange={(e) => handleStakeChange(e.target.value)}
                className="h-[30px] text-center text-[15px] w-full focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleStakeChange(String(Number(stake || 0) + 1))}
                className="h-9 flex items-center justify-center rounded-[0px_4px_4px_0px] w-10 bg-[linear-gradient(-180deg,_#fff_0%,_#eee_89%)] text-[20px] text-center text-black"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick Stake Amount Buttons */}
          <div className="px-2 py-2">
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
              {stakesLoader ? (
                <div className="col-span-4 h-[30px] text-center text-[12px] leading-[30px] text-[#555] sm:col-span-8">
                  Loading stakes...
                </div>
              ) : Array.isArray(stakesArr) && stakesArr.length ? (
                stakesArr?.map(({ label, value }, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => increaseStake(value ? Number(value) : 0)}
                    className="block h-[30px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-sm border border-[#333] bg-[#eee] px-[2px] text-center text-[12px] leading-[30px] text-[#1e1e1e] sm:text-[13px]"
                  >
                    {value}
                  </button>
                ))
              ) : (
                <div className="col-span-4 h-[30px] text-center text-[12px] leading-[30px] text-[#555] sm:col-span-8">
                  No stake values found
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="px-2 py-2 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => handleStakeChange(String(min ?? 0))}
                className="bg-[#ff0] hover:bg-yellow-400 py-2 font-bold text-sm text-gray-900 transition-colors rounded"
              >
                MIN
              </button>
              <button
                type="button"
                onClick={() => handleStakeChange(String(max ?? 0))}
                className="bg-[#243a48] hover:bg-gray-900 py-2 font-bold text-sm text-white transition-colors rounded"
              >
                MAX
              </button>
              <button
                type="button"
                onClick={() => setIsStakeModalOpen(true)}
                className="bg-[green] hover:bg-green-600 py-2 font-bold text-sm text-white transition-colors rounded"
              >
                Edit Stake
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-[red] hover:bg-red-600 py-2 font-bold text-sm text-white transition-colors rounded"
              >
                CLEAR
              </button>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="grid grid-cols-2 gap-1 p-2 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-400 hover:bg-red-500 text-white py-2 rounded font-bold text-sm transition-colors"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handlePlaceBet}
              disabled={isPlacingBet || (stake && rate ? false : true)}
              className="bg-[#ffe4b5] hover:bg-yellow-200 text-black py-2 rounded font-bold text-sm transition-colors disabled:opacity-50"
            >
              {isPlacingBet ? 'Placing Bet...' : 'PLACE BET'}
            </button>
          </div>
        </div>
      </div>
      {isStakeModalOpen ? (
        <StakeModal
          onClose={() => setIsStakeModalOpen(false)}
          onSaved={async () => {
            await refetchStakes();
          }}
        />
      ) : null}
    </div>
  );
};

export default BetSlip;
