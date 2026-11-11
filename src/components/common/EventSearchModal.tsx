import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { useGetEventsQuery } from '@/store/api/eventsApi';

type EventSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

const EventSearchModal: React.FC<EventSearchModalProps> = ({ open, onClose }) => {
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

  const searchEvents = Object.values(data ?? {}).flat();

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

  if (!open) return null;

  const currentDay = dayjs();
  const showResults = search.length >= 2 && search === searchText.trim();

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[2147483647] bg-[#323a46]/50 font-helvetica"
      role="presentation"
      onMouseDown={closeAndReset}
    >
      <div
        className="absolute inset-x-0 top-0 bg-white font-helvetica text-[14px] leading-[21px] sm:max-w-[500px]"
        role="dialog"
        aria-modal="true"
        aria-label="Search events"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <form
          className="whitespace-nowrap bg-white"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchText.trim());
          }}
        >
          <button
            type="button"
            onClick={closeAndReset}
            aria-label="Back"
            className="inline border-0 bg-transparent p-0 text-[#111]"
          >
            <img
              src="/icons/reference-search/icon-back.svg"
              className="inline h-[40px] w-[40px] align-middle"
              alt=""
            />
          </button>

          <input
            ref={inputRef}
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search Events"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            aria-label="Search Events"
            className="inline-block h-[17.06667vw] w-[70%] rounded-none border-0 bg-white px-[2px] py-px align-baseline text-[14px] font-normal leading-[21px] text-black placeholder:text-[#777] focus:outline focus:outline-2 focus:outline-black [appearance:none] [&::-webkit-search-cancel-button]:hidden"
          />

          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="box-content inline-block w-[8%] border-0 bg-transparent p-[3.5px] text-center leading-[14px] opacity-50 hover:opacity-75 focus-visible:opacity-100"
          >
            <img
              src="/icons/reference-search/icon-close2.svg"
              className="inline h-[16px] w-[16px] align-middle"
              alt=""
            />
          </button>
          <button
            type="submit"
            aria-label="Search"
            className="inline-block w-[8%] border-0 bg-transparent px-[6px] py-px text-center"
          >
            <img
              src="/icons/reference-search/icon-search.svg"
              className="inline h-[16px] w-[16px] align-middle"
              alt=""
            />
          </button>
        </form>

        {showResults && (
          <>
            {isFetching ? (
              <div
                className="bg-white text-center text-[4.53333vw] leading-[1.5] text-[#9b9b9b]"
                role="status"
              >
                Searching events...
              </div>
            ) : searchEvents.length > 0 ? (
              <div
                className="absolute left-0 top-[64px] h-[calc(100dvh_-_300px)] min-h-[120px] w-full overflow-y-auto bg-white p-[4.8px] shadow-[0_0_35px_0_rgba(154,161,171,0.15)]"
                aria-label="Event search results"
              >
                <ul className="mb-[3px] list-none pl-[15px]">
                  {searchEvents.map((event) => {
                    const eventTime = dayjs(event.time);
                    let dateLabel: string | null = null;

                    if (eventTime.isSame(currentDay.add(1, 'day'), 'day')) {
                      dateLabel = 'Tomorrow';
                    } else if (!eventTime.isSame(currentDay, 'day')) {
                      dateLabel = eventTime.format('DD/MM/YYYY');
                    }

                    return (
                      <li
                        key={`${event.sport}-${event.eventId}`}
                        className="mb-[7px] h-[10vw] last:mb-0"
                      >
                        <Link
                          to={`/sports/${event.sport.toLowerCase() === 'soccer' ? 'football' : event.sport.toLowerCase()}/${event.competitionId}/market-details/${event.eventId}`}
                          state={{ isPremiumFancy: event.externalId?.startsWith('sr') ?? false }}
                          onClick={closeAndReset}
                          className="block h-full w-full border-0 bg-transparent p-0 text-left text-[4vw] font-bold leading-[normal] text-[#2789ce]"
                        >
                          <small className="block text-[10px] font-bold leading-[normal]">
                            {dateLabel}
                          </small>
                          <span className="font-normal text-[#777]">
                            {eventTime.format('HH:mm')}
                          </span>{' '}
                          {event.eventName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <dl
                className="m-0 bg-white text-center text-[4.53333vw] leading-[1.5] text-[#9b9b9b]"
                role="status"
              >
                <dt className="font-bold">
                  <img
                    src="/icons/reference-search/icon-info.svg"
                    className="inline h-[24px] w-[24px] align-middle"
                    alt=""
                  />
                </dt>
                <dd className="mb-[8px]">No events found matching ...</dd>
              </dl>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default EventSearchModal;
