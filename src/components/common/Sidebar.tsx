import React, { useId, useState } from 'react';
import { mdiChevronRightBoxOutline } from '@mdi/js';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils';
import { sidebarSports } from '@/hooks/useSidebar';
import { useGetCompetitionByIdQuery } from '@/store/api/sidebarApi';
import { useGetEventsQuery } from '@/store/api/eventsApi';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reserveDesktopSpace?: boolean;
}

const normalizeSport = (sport: string) =>
  sport.toLowerCase() === 'football' ? 'soccer' : sport.toLowerCase();

const sportPath = (sport: string) =>
  normalizeSport(sport) === 'soccer' ? 'football' : sport.toLowerCase();

function MenuArrow({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={cn(
        'absolute right-[10px] inline-block h-[24px] w-[17.6px] text-[17.6px] leading-[24px] text-[#243a48] transition-transform duration-150 motion-reduce:transition-none',
        expanded && 'rotate-90'
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="block h-full w-full fill-current">
        <path d={mdiChevronRightBoxOutline} />
      </svg>
    </span>
  );
}

function MenuChildren({
  id,
  expanded,
  children,
}: {
  id: string;
  expanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      aria-hidden={!expanded}
      className={cn(
        'grid transition-[grid-template-rows,visibility] [transition-duration:350ms] [transition-timing-function:ease] motion-reduce:transition-none',
        expanded ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function CompetitionBranch({
  competition,
  sport,
  sportExpanded,
  onSelectEvent,
}: {
  competition: { id: number; name: string; sport: string };
  sport: string;
  sportExpanded: boolean;
  onSelectEvent: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const { data, isFetching, isError, refetch } = useGetEventsQuery(
    { sportName: sport, competitionId: competition.id, status: 'ACTIVE' },
    { skip: !expanded || !sportExpanded }
  );
  const events = Object.values(data ?? {}).flat();

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((open) => !open)}
        className="relative block w-full overflow-visible whitespace-normal border-b border-white py-[4.8px] pl-[15px] pr-[1.6px] text-left text-[12px] font-normal capitalize leading-[18px] text-black focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#243a48]"
      >
        <span className="whitespace-normal break-normal pr-[36px] [overflow-wrap:normal] [text-overflow:clip]">
          {competition.name}
        </span>
        <MenuArrow expanded={expanded} />
      </button>
      <MenuChildren id={contentId} expanded={expanded && sportExpanded}>
        <ul className="m-0 list-none bg-[#ddd] p-0">
          {isFetching && !data ? (
            <li role="status" className="py-[4.8px] pl-[20px] text-[12px] leading-[18px]">
              Loading events...
            </li>
          ) : isError ? (
            <li className="py-[4.8px] pl-[20px] text-[12px] leading-[18px]">
              Unable to load events.{' '}
              <button type="button" onClick={() => refetch()} className="underline">
                Retry
              </button>
            </li>
          ) : events.length === 0 ? (
            <li className="py-[4.8px] pl-[20px] text-[12px] leading-[18px]">No events available</li>
          ) : (
            events.map((event) => (
              <li key={event.eventId}>
                <NavLink
                  to={`/sports/${sportPath(sport)}/${competition.id}/market-details/${event.eventId}`}
                  state={{ isPremiumFancy: event.externalId?.startsWith('sr') ?? false }}
                  onClick={onSelectEvent}
                  className="relative block whitespace-normal break-normal border-b border-white py-[4.8px] pl-[20px] pr-[1.6px] text-[12px] font-normal capitalize leading-[18px] text-black [overflow-wrap:normal] [text-overflow:clip] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#243a48]"
                >
                  {event.eventName}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      </MenuChildren>
    </li>
  );
}

function SportBranch({ label, onSelectEvent }: { label: string; onSelectEvent: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const sport = label === 'Football' ? 'Soccer' : label;
  const { data, isFetching, isError, refetch } = useGetCompetitionByIdQuery(sport, {
    skip: !expanded,
  });
  const competitions = (data?.competitions ?? []).filter(
    (competition) =>
      !competition.sport || normalizeSport(competition.sport) === normalizeSport(sport)
  );

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((open) => !open)}
        className="relative block w-full overflow-visible whitespace-normal border-b border-[#ededed] py-[4.8px] pl-[9.6px] pr-[1.6px] text-left text-[13px] font-medium capitalize leading-[19.5px] text-black hover:bg-[#ededed] hover:text-[#1b2d52] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#243a48]"
      >
        <span className="whitespace-normal break-normal pr-[36px] align-middle [overflow-wrap:normal] [text-overflow:clip]">
          {label}
        </span>
        <MenuArrow expanded={expanded} />
      </button>
      <MenuChildren id={contentId} expanded={expanded}>
        <ul className="m-0 list-none bg-[#ededed] p-0">
          {isFetching && !data ? (
            <li role="status" className="py-[4.8px] pl-[15px] text-[12px] leading-[18px]">
              Loading competitions...
            </li>
          ) : isError ? (
            <li className="py-[4.8px] pl-[15px] text-[12px] leading-[18px]">
              Unable to load competitions.{' '}
              <button type="button" onClick={() => refetch()} className="underline">
                Retry
              </button>
            </li>
          ) : competitions.length === 0 ? (
            <li className="py-[4.8px] pl-[15px] text-[12px] leading-[18px]">
              No competitions available
            </li>
          ) : (
            competitions.map((competition) => (
              <CompetitionBranch
                key={competition.id}
                competition={competition}
                sport={sport}
                sportExpanded={expanded}
                onSelectEvent={onSelectEvent}
              />
            ))
          )}
        </ul>
      </MenuChildren>
    </li>
  );
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  reserveDesktopSpace = true,
}) => (
  <div className={reserveDesktopSpace ? 'contents lg:block lg:w-[240px] lg:shrink-0' : 'contents'}>
    <nav
      aria-label="Sports sidebar"
      className={cn(
        'fixed left-0 top-[50px] z-[100] h-[calc(100dvh-50px)] w-[240px] bg-white p-0 font-helvetica shadow-lg lg:top-[98px] lg:z-50 lg:block lg:h-[calc(100vh-98px)] lg:shadow-none',
        isSidebarOpen ? 'block' : 'hidden'
      )}
    >
      <div className="h-full overflow-y-auto scrollbar-hidden">
        <ul className="m-0 list-none p-0">
          {sidebarSports.map(({ label }) => (
            <SportBranch key={label} label={label} onSelectEvent={() => setIsSidebarOpen(false)} />
          ))}
        </ul>
      </div>
    </nav>
  </div>
);

export default Sidebar;
