import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useDeviceWidth } from '@/hooks/useDeviceWidth';
import { Icons } from '@/utils/icons';

interface DateFilterProps {
  fromDate?: Date;
  toDate?: Date;
  setFromDate: (date?: Date) => void;
  setToDate: (date?: Date) => void;
  wrapperClass?: string;
  labelClass?: string;
  buttonClass?: string;
  popoverClass?: string;
  calendarClass?: string;
  disableClear?: boolean;
}

const DateFilter: React.FC<DateFilterProps> = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  wrapperClass,
  labelClass,
  buttonClass,
  popoverClass,
  calendarClass,
  disableClear = false,
}) => {
  const width = useDeviceWidth();

  const clearDate = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className={cn('flex items-center gap-1', wrapperClass)}>
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* FROM DATE */}
        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
          <span className={cn('text-13 sm:text-sm font-semibold', labelClass)}>From</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'px-2 justify-start gap-x-1.5 xs:gap-x-2 text-left font-normal rounded-full border-black text-xs md:text-13 h-8 md:h-9',
                  !fromDate && 'text-muted-foreground',
                  buttonClass
                )}
              >
                <CalendarIcon className="!h-3.5 !w-3.5 md:!h-4 md:!w-4" />
                {fromDate ? format(fromDate, width > 768 ? 'PPP' : 'PP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>

            <PopoverContent className={cn('w-auto p-0', popoverClass)} align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(date) => {
                  setFromDate(date);
                  if (toDate && date && toDate > toDate) {
                    setToDate(undefined);
                  }
                }}
                initialFocus
                className={calendarClass}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* TO DATE */}
        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
          <span className={cn('text-13 sm:text-sm font-semibold', labelClass)}>To</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'px-2 justify-start gap-x-1.5 xs:gap-x-2 text-left font-normal rounded-full border-black text-xs md:text-13 h-8 md:h-9',
                  !toDate && 'text-muted-foreground',
                  buttonClass,
                  ''
                )}
              >
                <CalendarIcon className="!h-3.5 !w-3.5 md:!h-4 md:!w-4" />
                {toDate ? format(toDate, width > 768 ? 'PPP' : 'PP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>

            <PopoverContent className={cn('w-auto p-0', popoverClass)} align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                disabled={(date) => !!fromDate && date < fromDate}
                initialFocus
                className={calendarClass}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {!disableClear && (
        <button
          onClick={clearDate}
          className="max-sm:hidden bg-black/90 text-sm text-white rounded-full p-1 hover:bg-black"
        >
          <Icons.close />
        </button>
      )}
    </div>
  );
};

export default DateFilter;
