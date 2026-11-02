import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import { ChevronLeft, Gamepad2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useGetEventsQuery } from '@/store/api/eventsApi';
import type { Match } from '@/types/event';

type EventSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

const EventSearchModal: React.FC<EventSearchModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setSearchText('');
      setSearch('');
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    if (searchTimerRef.current !== null) {
      window.clearTimeout(searchTimerRef.current);
    }

    const trimmed = searchText.trim();
    searchTimerRef.current = window.setTimeout(() => {
      setSearch(trimmed);
    }, 250);

    return () => {
      if (searchTimerRef.current !== null) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchText, open]);

  const { data, isFetching } = useGetEventsQuery(
    {
      search,
      status: 'ACTIVE',
    },
    {
      skip: !open || search.length < 2,
    }
  );

  const searchEvents = [
    ...(data?.cricket ?? []),
    ...(data?.football ?? []),
    ...(data?.tennis ?? []),
  ];

  const closeAndReset = () => {
    setSearchText('');
    setSearch('');
    onClose();
  };

  const clearSearch = () => {
    setSearchText('');
    setSearch('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelect = (event: Match) => {
    const sport = event.sport.toLowerCase() === 'soccer' ? 'football' : event.sport.toLowerCase();

    closeAndReset();

    navigate(`/sports/${sport}/${event.competitionId}/market-details/${event.eventId}`, {
      state: {
        isPremiumFancy: event.externalId.startsWith('sr'),
      },
    });
  };

  if (!open) return null;

  const currentDay = dayjs();
  const showResults = search.length >= 2;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[2147483647] bg-transparent"
      role="presentation"
      onMouseDown={closeAndReset}
    >
      <div
        className="absolute inset-x-0 top-0"
        role="dialog"
        aria-modal="true"
        aria-label="Search events"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#d9d9d9] bg-white px-2 py-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={closeAndReset}
              aria-label="Back"
              className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111]"
            >
              <ChevronLeft className="h-7 w-7" strokeWidth={2.2} />
            </button>

            <input
              ref={inputRef}
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search Events"
              spellCheck
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Search Events"
              className="h-7 min-w-0 flex-1 border-0 bg-transparent text-[14px] leading-none text-[#111] outline-none placeholder:text-[#8a8a8a] [appearance:none] [&::-webkit-search-cancel-button]:hidden"
            />

            <button
              type="button"
              onClick={searchText ? clearSearch : closeAndReset}
              aria-label={searchText ? 'Clear search' : 'Close search'}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111]"
            >
              <X className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {showResults && (
          <div className="max-h-[calc(100vh-56px)] overflow-y-auto border-t border-[#dadada] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
            {isFetching ? (
              <div className="px-4 py-10 text-center text-[13px] text-[#6b7780]">
                Searching events...
              </div>
            ) : searchEvents.length > 0 ? (
              searchEvents.map((event) => {
                const eventTime = dayjs(event.time);
                let dateLabel: string | null = null;

                if (eventTime.isSame(currentDay.add(1, 'day'), 'day')) {
                  dateLabel = 'Tomorrow';
                } else if (!eventTime.isSame(currentDay, 'day')) {
                  dateLabel = eventTime.format('DD/MM/YYYY');
                }

                return (
                  <button
                    key={event.eventId}
                    type="button"
                    onClick={() => handleSelect(event)}
                    className="flex min-h-[33px] w-full items-stretch border-b border-[#dedede] bg-white text-left last:border-b-0"
                  >
                    <span className="flex w-[71px] shrink-0 flex-col justify-center border-r border-[#d9d9d9] px-1.5 py-[3px] text-[12px] leading-[14px] text-[#464646]">
                      {dateLabel && <span className="text-[#168bd2]">{dateLabel}</span>}
                      <span>{eventTime.format('HH:mm')}</span>
                    </span>

                    <span className="flex min-w-0 flex-1 items-center gap-1.5 px-2.5">
                      <Gamepad2 className="h-[14px] w-[14px] shrink-0 text-[#4a4a4a]" strokeWidth={1.8} />
                      <span className="truncate text-[13px] text-[#4a4a4a]">{event.eventName}</span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center text-[13px] text-[#6b7780]">
                No Data Found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default EventSearchModal;
