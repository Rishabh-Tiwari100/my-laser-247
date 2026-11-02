import React, { useState, useMemo, useCallback } from 'react';
import OddButton from '@/components/common/OddButton';
import { useNavigate } from 'react-router-dom';
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
      className="cursor-pointer border-solid border-b border-gray-300 bg-white hover:bg-stone-100 transition md:py-1 md:px-2.5 last:border-b-slate"
    >
      <div className="flex min-h-[42px] items-center px-2 py-1 md:hidden">
        <div className="min-w-0 flex-1">
          <div className="flex h-[18px] items-center gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`flex size-[17px] shrink-0 items-center justify-center rounded-[2px] ${tag === 'bookmaker' ? 'bg-[#226bc3]' : 'bg-[#0a92a5]'}`}
              >
                <img src={tagIcons[tag]} alt={tag} className="max-h-[15px] max-w-[15px]" />
              </span>
            ))}
            <span className="truncate text-[10px] font-normal text-[#8a969e]">
              {dayjs(time).format('DD/MM/YYYY HH:mm')}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-1 text-xs leading-[17px]">
            <span
              className={`size-[7px] shrink-0 rounded-full border border-gray-400 ${showLiveIndicator ? 'bg-[#508d0e]' : 'bg-[#cbd3d8]'}`}
            />
            <span className="truncate text-[#168bd2]">{eventName}</span>
          </div>
        </div>

        <Icons.pin className="ml-2 size-5 shrink-0 rounded-full border border-[#91a5b0] p-0.5 text-[#91a5b0]" />
      </div>

      <div className="hidden flex-1 grid-cols-12 md:grid">
        {/* Match Info */}
        <div className="col-span-10 md:col-span-7 flex justify-between gap-x-1">
          <div className="flex gap-x-2">
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
              <div className="text-xs text-primary-blue line-clamp-1">{eventName}</div>
              <div className="flex items-center gap-x-2 text-xs font-bold text-gray-500 mt-0.5">
                {showLiveIndicator ? <p className="text-[#508d0e]">In-Play</p> : null}
                <div className="flex gap-x-1">
                  {tags.map((tag) => (
                    <span
                      className={`p-[2px] rounded-[2px] size-[18px] ${tag === 'bookmaker' ? 'bg-[#226bc3]' : 'bg-[#0a92a5]'}`}
                    >
                      <img
                        key={tag}
                        src={tagIcons[tag]}
                        alt={tag}
                        className="w-5 max-w-full h-auto"
                      />
                    </span>
                  ))}
                  <span className="text-[11px] text-[#6c757d] font-thin">
                    {dayjs(time).format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Odds - Desktop */}
        <div className="col-span-4 hidden md:flex justify-center gap-2">
          <OddsRow
            isLeague={isLeague}
            allOdds={allOdds}
            blockedStatus={blockedStatus}
            length={odds.length}
          />
        </div>
        <button
          type="button"
          className="col-span-2 md:col-span-1 flex items-center justify-end pr-[5px]"
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
            className="size-5"
            alt="Pin"
          />
        </button>
      </div>
    </div >
  );
};

export default OuterMarketRow;
