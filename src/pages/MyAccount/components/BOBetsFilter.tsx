import DatePicker from '@/components/common/DatePicker';
import { useState } from 'react';

type Props = {
  buttonText: string;
};

export default function BOBetsFilter({ buttonText }: Props) {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  return (
    <div className="mb-3">
      <div className="flex items-end">
        <div className="h-[28px] w-[70px] bg-[#41586b] text-white text-[14px] font-bold flex items-center justify-center rounded-t-[2px]">
          All
        </div>

        <div className="flex-1 border-b-[4px] border-[#41586b]" />
      </div>

      <div className="border-x border-b border-[#a9b4bb] bg-[#dfe6e8] px-3 py-3">
        <div className="flex items-center gap-1 flex-wrap text-[13px]">
          <span className="mr-2">Period</span>

          <DatePicker value={fromDate} onChange={setFromDate} />

          <input
            defaultValue="00:00"
            className="w-[46px] h-[24px] rounded border border-[#b8b8b8] bg-[#efefef] px-1"
          />

          <span>to</span>

          <DatePicker value={toDate} onChange={setToDate} />

          <input
            defaultValue="23:59"
            className="w-[46px] h-[24px] rounded border border-[#b8b8b8] bg-[#efefef] px-1"
          />
        </div>

        <div className="mt-3 flex items-center gap-[6px] flex-wrap">
          <label className="text-[13px]">Filter by Provider</label>

          <select className="h-[28px] w-[120px] rounded border border-[#b8b8b8] bg-white px-2 pr-6 text-[13px] leading-none outline-none">
            <option>All</option>
          </select>

          <button className="h-[28px] border border-[#c0c0c0] bg-white px-3 text-[13px] rounded">
            Just For Today
          </button>

          <button className="h-[28px] border border-[#c0c0c0] bg-white px-3 text-[13px] rounded">
            From Yesterday
          </button>

          <button className="h-[28px] min-w-[118px] rounded border border-[#cf8500] bg-[#f8a51c] font-bold text-[13px]">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
