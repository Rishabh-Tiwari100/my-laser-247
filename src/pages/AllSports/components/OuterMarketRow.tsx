import React, { useState, useMemo, useCallback } from 'react';
import OddButton from '@/components/common/OddButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn, formatMatchTime, getBlockedStatus } from '@/utils';
import { useIsAuthenticated } from '@/hooks';
import { Icons } from '@/utils/icons';
import { Match, MatchTag } from '@/types/event';
import OddsRow from './OddsRow';
import dayjs from 'dayjs';
import { Gamepad2 } from 'lucide-react';
import { useAddToMultiMarketMutation } from '@/store/api/eventsApi';
import toast from 'react-hot-toast';

interface OuterMarketRowProps {
  match: Match;
  sportName?: 'cricket' | 'football' | 'tennis';
}

const tagIcons: Record<MatchTag, string> = {
  isLive: '/images/badges/live.gif',
  streaming: '/images/badges/liveTv.png',
  fancy: '/icons/fancy.webp',
  bookmaker: '/icons/bookmaker.webp',
  premium: '/icons/premium.svg',
  matchOdds: '/images/badges/matchOdds.png',
  // eCricket: '/images/badges/e-sports/cricket.webp',
  // eFootball: '/images/badges/e-sports/football.webp',
  // eTennis: '/images/badges/e-sports/tennis.webp',
  eCricket: '/images/badges/e-sports/e-sport.png',
  eFootball: '/images/badges/e-sports/e-sport.png',
  eTennis: '/images/badges/e-sports/e-sport.png',
};

const oddsFallback = [
  { price: null, type: 'back' as const },
  { price: null, type: 'lay' as const },
];

const OuterMarketRow: React.FC<OuterMarketRowProps> = ({ match, sportName = '' }) => {
  const navigate = useNavigate();
  const isDashboard = useLocation().pathname === '/dashboard';
  const isAuthenticated = useIsAuthenticated();
  const {
    eventName,
    inplay,
    tags,
    time = '',
    odds,
    eventId,
    runners,
    status: marketStatus,
    externalId,
    competitionId,
  } = match;
  const isSrl = externalId.startsWith('sr');

  const handleNavigate = useCallback(() => {
    navigate(`/sports/${sportName}/${competitionId}/market-details/${eventId}`, {
      state: {
        isPremiumFancy: isSrl,
      },
    });
  }, [isAuthenticated, navigate, sportName, eventId]);

  const allOdds = odds.length ? odds : oddsFallback.concat(oddsFallback, oddsFallback);
  // const isLive = useMemo(() => Date.now() >= new Date(time).getTime(), [time]);

  // const showLiveIndicator = inplay || isLive;
  const showLiveIndicator = inplay;
  const availableEsportbadge = tags.find((tag) => tag.startsWith('e'));

  const blockedStatus = getBlockedStatus('', marketStatus);
  const isLeague = match?.eventName?.trim() === match?.competitionName?.trim();

  const [addToMultiMarket] = useAddToMultiMarketMutation();

  const onTogglePin = (isPinned: boolean) => {
    try {
      if (!eventId) {
        toast.error('Event ID is missing');
        return;
      }
      const status = isPinned ? 'UNFAVORITE' : 'FAVORITE';
      addToMultiMarket({ eventId: Number(eventId), status }).unwrap();
      toast.success(isPinned ? 'Event removed successfully.' : 'Event added successfully.');
    } catch (error: any) {
      console.log('error: ', error);
      toast.error(`Failed to ${isPinned ? 'remove' : 'add'} the event`);
    }
  }
  const isPinned = Boolean(match?.isFavourite);

  return (
    <div
      onClick={handleNavigate}
      className={cn('cursor-pointer border-solid border-b border-gray-300 bg-white hover:bg-stone-100 transition md:py-1 md:px-2.5 last:border-b-slate', isDashboard && 'border-[#ededed] min-h-[47px] p-0 md:p-0 lg:min-h-[46px] lg:px-[8px] lg:py-[5px]')}
    >
      <div className={cn('flex min-h-[42px] items-center px-2 py-1 md:hidden', isDashboard && 'min-h-[47px] px-[7px] py-[3px] md:flex lg:hidden')}>
        <div className="min-w-0 flex-1">
          <div className={cn('flex h-[18px] items-center gap-1', isDashboard && 'max-lg:pl-[10px] max-lg:gap-[3px]')}>
            {showLiveIndicator && <span className={cn('hidden font-bold text-[#508d0e]', isDashboard && 'max-lg:inline max-lg:text-[13px]')}>In-Play</span>}
            {tags.map((tag) => (
              <span
                key={tag}
                className={`flex size-[17px] shrink-0 items-center justify-center rounded-[2px] ${tag === 'bookmaker' ? 'bg-[#226bc3]' : 'bg-[#0a92a5]'}`}
              >
                <img src={tagIcons[tag]} alt={tag} className="max-h-[15px] max-w-[15px]" />
              </span>
            ))}
            <span className={cn('truncate text-[10px] font-normal text-[#8a969e]', isDashboard && 'max-lg:text-[9px] max-lg:text-[#f00]')}>
              {dayjs(time).format('DD/MM/YYYY HH:mm')}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-1 text-xs leading-[17px]">
            <span
              className={`size-[7px] shrink-0 rounded-full border border-gray-400 ${showLiveIndicator ? 'bg-[#508d0e]' : 'bg-[#cbd3d8]'}`}
            />
            <span className={cn('truncate text-[#168bd2]', isDashboard && 'max-lg:text-[14px] max-lg:font-semibold')}>{eventName}</span>
          </div>
        </div>

        <Icons.pin className="ml-2 size-5 shrink-0 rounded-full border border-[#91a5b0] p-0.5 text-[#91a5b0]" />
      </div>

      <div className={cn('hidden flex-1 grid-cols-12 md:grid', isDashboard && 'max-lg:hidden')}>
        {/* Match Info */}
        <div className="col-span-10 md:col-span-7 flex justify-between gap-x-1">
          <div className={cn("flex gap-x-2", isDashboard && "lg:gap-0")}>
            {showLiveIndicator ? (
              <div className="mt-1 self-start rounded-full inline-flex items-start p-1 md:p-0.5">
                <span className="p-[3.5px] rounded-full bg-[#508d0e] border border-gray-400" />
              </div>
            ) : (
              <div className="mt-1 self-start rounded-full inline-flex items-start p-1 md:p-0.5">
                <span className="p-[3.5px] rounded-full border border-gray-400" />
              </div>
            )}

            <div>
              <div className={cn('text-xs text-primary-blue line-clamp-1', isDashboard && 'text-[13px] text-[#168bd2] font-semibold')}>{eventName}</div>
              <div className={cn("flex items-center gap-x-2 text-xs font-bold text-gray-500 mt-0.5", isDashboard && "lg:gap-[5px] lg:text-[13px]")}>
                {showLiveIndicator ? <p className="text-[#508d0e]">In-Play</p> : null}
                <div className="flex gap-x-1">
                  {tags.map((tag) => (
                    <span
                      className={`p-[2px] rounded-[2px] size-[18px] ${isDashboard ? 'lg:text-[10px]' : ''} ${tag === 'bookmaker' ? 'bg-[#226bc3]' : 'bg-[#0a92a5]'}`}
                    >
                      <img
                        key={tag}
                        src={tagIcons[tag]}
                        alt={tag}
                        className="w-5 max-w-full h-auto"
                      />
                    </span>
                  ))}
                  <span className={cn("text-[11px] text-[#6c757d] font-thin", isDashboard && "lg:text-[10px]")}>
                    {dayjs(time).format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Odds - Desktop */}
        <div className={cn('col-span-4 hidden md:flex justify-center gap-2', isDashboard && 'lg:gap-[3px]')}>
          <OddsRow
            isLeague={isLeague}
            allOdds={allOdds}
            blockedStatus={blockedStatus}
            length={odds.length}
          />
        </div>
        <button
          type="button"
          className={cn("col-span-2 md:col-span-1 flex items-center justify-end pr-[5px]", isDashboard && "lg:justify-center")}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isLeague) {
              toast.error('You cannot pin a league');
              return;
            }
            onTogglePin(isPinned);
          }}
        >
          <img
            src={isPinned ? "/icons/pin-green.svg" : "/icons/pin-white.svg"}
            className={cn("size-5", isDashboard && "lg:size-[22px]")}
            alt="Pin"
          />
        </button>
      </div>
    </div >
  );
};

export default OuterMarketRow;
