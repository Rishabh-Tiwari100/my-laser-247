import DatePicker from '@/components/common/DatePicker';
import { useState } from 'react';

type Props = {
  buttonText: string;
};

export default function BetgamesFilter({ buttonText }: Props) {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  return (
    <div className="mb-3">
      {/* All Tab */}
      <div className="flex items-end">
        <div className="h-[28px] min-w-[70px] bg-[#435a6d] text-white font-bold text-[14px] flex items-center justify-center rounded-t-[2px]">
          All
        </div>

        <div className="flex-1 border-b-[4px] border-[#435a6d]" />
      </div>

      {/* Filter */}
      <div className="bg-[#dfe6e8] border-x border-b border-[#a9b4bb] px-[12px] py-[12px]">
        <div className="flex items-center flex-wrap gap-[4px] text-[13px]">
          <span className="mr-2">Period</span>

          <DatePicker value={fromDate} onChange={setFromDate} />

          <input
            defaultValue="00:00"
            className="w-[46px] h-[24px] border border-[#b6b6b6] rounded px-1 text-[12px] bg-[#efefef]"
          />

          <span className="mx-1">to</span>

          <DatePicker value={toDate} onChange={setToDate} />

          <input
            defaultValue="23:59"
            className="w-[46px] h-[24px] border border-[#b6b6b6] rounded px-1 text-[12px] bg-[#efefef]"
          />
        </div>

        <div className="mt-[12px] flex gap-[4px]">
          <button className="h-[27px] px-[12px] border border-[#bdbdbd] bg-white text-[13px] rounded">
            Just For Today
          </button>

          <button className="h-[27px] px-[12px] border border-[#bdbdbd] bg-white text-[13px] rounded">
            From Yesterday
          </button>

          <button className="h-[27px] min-w-[118px] border border-[#cf8400] bg-[#f8a51c] rounded font-bold text-[13px]">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
