import type { FormEvent } from 'react';
import { CalendarDays } from 'lucide-react';
import type { SettledBetFilters } from '../types';
import { formatFilterDate } from '../settledBetUtils';
import { SPORT_FILTER_LIST } from '@/utils/constants/home';

interface SettledBetsFilterProps {
  value: SettledBetFilters;
  onChange: (value: SettledBetFilters) => void;
  onSubmit: () => void;
  disabled?: boolean;
  marketTypeOptions?: string[];
  subTypeOptions?: string[];
  showSubType?: boolean;
  ariaLabel?: string;
}

const marketTypes = ['exchange', 'fancy', 'bookmaker'];

const fieldClassName =
  'flex min-w-0 flex-col gap-[2px] leading-[15px] [&>span:first-child]:h-[15px]';
const controlClassName =
  'h-[34px] min-w-0 w-full rounded-[4px] border border-[#aeb3b7] bg-white px-[10px] py-0 text-[14px] leading-[32px] text-[#090909] outline-none transition-colors focus:border-[#283f50] focus:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]';

export default function SettledBetsFilter({
  value,
  onChange,
  onSubmit,
  disabled = false,
  marketTypeOptions = marketTypes,
  subTypeOptions = ['Settled'],
  showSubType = true,
  ariaLabel = 'Settled bets filters',
}: SettledBetsFilterProps) {
  const updateFilter = <Key extends keyof SettledBetFilters>(
    key: Key,
    nextValue: SettledBetFilters[Key]
  ) => {
    onChange({ ...value, [key]: nextValue });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={submit}
      className="border-y border-[#222] bg-white px-[11px] pb-[13px] pt-[10px] max-lg:px-[8px] max-lg:pt-[8px]"
      aria-label={ariaLabel}
    >
      <div className="grid grid-cols-2 gap-x-[8px] gap-y-[7px]">
        <label className={fieldClassName}>
          <span>From Date</span>
          <span className="relative flex h-[34px] w-full items-center justify-between overflow-hidden rounded-[4px] border border-[#aeb3b7] bg-white pl-[10px] pr-[9px] text-[14px] leading-[32px] focus-within:border-[#283f50] focus-within:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]">
            <span className="truncate">{formatFilterDate(value.fromDate)}</span>
            <CalendarDays className="h-[14px] w-[14px] shrink-0 stroke-[2.2]" aria-hidden="true" />
            <input
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="From Date"
              type="date"
              value={value.fromDate}
              max={value.toDate}
              onChange={(event) => updateFilter('fromDate', event.target.value)}
            />
          </span>
        </label>

        <label className={fieldClassName}>
          <span>To Date</span>
          <span className="relative flex h-[34px] w-full items-center justify-between overflow-hidden rounded-[4px] border border-[#aeb3b7] bg-white pl-[10px] pr-[9px] text-[14px] leading-[32px] focus-within:border-[#283f50] focus-within:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]">
            <span className="truncate">{formatFilterDate(value.toDate)}</span>
            <CalendarDays className="h-[14px] w-[14px] shrink-0 stroke-[2.2]" aria-hidden="true" />
            <input
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="To Date"
              type="date"
              value={value.toDate}
              min={value.fromDate}
              onChange={(event) => updateFilter('toDate', event.target.value)}
            />
          </span>
        </label>

        <label className={fieldClassName}>
          <span>Type</span>
          <select
            value={value.sport}
            onChange={(event) => updateFilter('sport', event.target.value)}
            className={`${controlClassName} cursor-pointer`}
          >
            {SPORT_FILTER_LIST.map((sport) => (
              <option value={sport} key={sport}>
                {sport}
              </option>
            ))}
          </select>
        </label>

        {showSubType && (
          <label className={fieldClassName}>
            <span>Sub Type</span>
            <select
              value={value.subType}
              onChange={(event) => updateFilter('subType', event.target.value)}
              className={`${controlClassName} cursor-pointer`}
            >
              {subTypeOptions.map((subType) => (
                <option value={subType} key={subType}>
                  {subType}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className={fieldClassName}>
          <span>Market Type</span>
          <select
            value={value.marketType}
            onChange={(event) => updateFilter('marketType', event.target.value)}
            className={`${controlClassName} cursor-pointer`}
          >
            {marketTypeOptions.map((marketType) => (
              <option value={marketType} key={marketType}>
                {marketType}
              </option>
            ))}
          </select>
        </label>

        <div className={`flex min-w-0 items-end ${showSubType ? '' : 'col-span-2'}`}>
          <button
            type="submit"
            disabled={disabled}
            className="flex h-[35px] w-full items-center justify-center rounded-[3px] bg-[#212121] text-[14px] font-bold text-white transition-colors hover:bg-[#343434] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#257da9] disabled:cursor-wait disabled:opacity-75"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
