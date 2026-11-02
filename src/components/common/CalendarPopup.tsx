import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export default function CalendarPopup({ value, onChange, onClose }: Props) {
  const monthStart = startOfMonth(value);

  const startDate = startOfWeek(monthStart, {
    weekStartsOn: 0,
  });

  const endDate = endOfWeek(endOfMonth(value), {
    weekStartsOn: 0,
  });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="absolute left-0 top-[30px] z-50 w-[300px] border border-[#ddd] bg-white shadow-lg">
      {/* Header */}

      <div className="flex h-[70px] items-center justify-between bg-[#807d7d] px-5 text-white">
        <button
          onClick={() => onChange(subMonths(value, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20"
        >
          <FaChevronLeft size={12} />
        </button>

        <div className="flex items-center gap-8 font-semibold">
          <span>{format(value, 'MMMM')}</span>
          <span>{format(value, 'yyyy')}</span>
        </div>

        <button
          onClick={() => onChange(addMonths(value, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9d9d9d]"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Week */}

      <div className="grid grid-cols-7 px-3 pt-3 text-center text-[13px] text-[#8ca2b5]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates */}

      <div className="grid grid-cols-7 gap-y-2 px-3 py-3 text-center text-[15px]">
        {days.map((day) => {
          const active = isSameDay(day, value);

          return (
            <button
              key={day.toString()}
              onClick={() => {
                onChange(day);
                onClose();
              }}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full transition
              ${
                active
                  ? 'bg-[#666] text-white'
                  : isSameMonth(day, value)
                    ? 'text-[#7c95ad]'
                    : 'text-[#c5c5c5]'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
