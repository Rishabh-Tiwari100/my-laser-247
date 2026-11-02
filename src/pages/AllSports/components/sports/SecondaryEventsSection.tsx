import { Match } from '@/types/event';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { type ViewByOption } from '../ViewbyDropdown';

interface SecondaryEventsSectionProps {
  events: Match[];
  onEventClick?: (event: Match) => void;
  className?: string;
  viewBy?: ViewByOption;
}

const SecondaryEventsSection = ({
  events,
  onEventClick,
  className = '',
  viewBy = 'Time',
}: SecondaryEventsSectionProps) => {
  const navigate = useNavigate();

  const handleEventClick = (event: Match) => {
    onEventClick?.(event);

    navigate(
      `/sports/${event.sport.toLowerCase()}/${event.competitionId}/market-details/${event.eventId}`
    );
  };

  const renderEventRow = (event: Match, showBorder: boolean) => (
    <div
      key={event.eventId}
      onClick={() => handleEventClick(event)}
      className={`
        flex items-center p-0.5 pr-1.5 bg-white
        hover:bg-gray-100 transition-colors cursor-pointer
        ${showBorder ? 'border-b border-gray-200' : ''}
      `}
    >
      {/* Time */}
      <div className="shrink-0 min-w-[80px] text-xs px-2 py-0 font-semibold text-[#243a48]">
        {dayjs(event.time).format('hh:mm A')}
      </div>

      {/* Sport */}
      <div className="flex-1 flex items-center pl-6 pr-4 py-0 text-black">
        <div className="text-xs font-normal">{event.sport}</div>
        <span className="text-gray-300 text-xl">▸</span>
        <div className="text-xs font-normal">{event.competitionName}</div>
        <span className="text-gray-300 text-xl">▸</span>
        <div className="text-13 font-bold text-primary-blue hover:underline">{event.eventName}</div>
      </div>
    </div>
  );

  if (viewBy === 'Competition') {
    const groupedEvents = events.reduce(
      (groups, event) => {
        const key = event.competitionId ?? event.competitionName ?? 'Other';
        const existingGroup = groups.find((group) => group.key === key);

        if (existingGroup) {
          existingGroup.events.push(event);
          return groups;
        }

        return [
          ...groups,
          {
            key,
            name: event.competitionName || 'Other',
            events: [event],
          },
        ];
      },
      [] as { key: number | string; name: string; events: Match[] }[]
    );

    return (
      <div className={`overflow-y-auto ${className}`}>
        {groupedEvents.map((group) => (
          <div key={group.key}>
            <div className="bg-[#203946] px-2.5 py-1.5 text-xs font-bold text-white">
              {group.name}
            </div>
            {group.events.map((event, index) =>
              renderEventRow(event, index !== group.events.length - 1)
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-y-auto ${className}`}>
      {events.map((event, index) => renderEventRow(event, index !== events.length - 1))}
    </div>
  );
};

export default SecondaryEventsSection;
