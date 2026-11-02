import { useId } from 'react';
import { CalendarDays } from 'lucide-react';
import { formatReportDate } from '../profitLossUtils';

interface ReportDateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  compactLabel?: boolean;
}

export default function ReportDateField({
  label,
  value,
  onChange,
  min,
  max,
  compactLabel = false,
}: ReportDateFieldProps) {
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={`flex min-w-0 flex-col gap-[2px] leading-[15px] ${compactLabel ? 'text-[12px]' : ''}`}
    >
      <span className="h-[15px]">{label}</span>
      <span className="relative flex h-[34px] w-full items-center justify-between overflow-hidden rounded-[4px] border border-[#aeb3b7] bg-white pl-[10px] pr-[9px] text-[14px] leading-[32px] focus-within:border-[#283f50] focus-within:shadow-[0_0_0_1px_rgba(40,63,80,0.12)]">
        <span className="truncate">{formatReportDate(value)}</span>
        <CalendarDays className="h-[14px] w-[14px] shrink-0 stroke-[2.2]" aria-hidden="true" />
        <input
          id={inputId}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={label}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}
