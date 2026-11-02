import { SearchX } from 'lucide-react';

export default function Cashback() {
  return (
    <div className="w-full min-h-full bg-white">
      {/* Top Card */}
      <div className="px-3 pt-3">
        <div className="h-24 rounded bg-[#ffb300] flex flex-col items-center justify-center">
          <p className="text-[12px] text-[#222]">Total Cashback Earned</p>

          <h2 className="mt-1 text-[18px] font-bold text-[#111]">(PBU) 0</h2>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex h-[520px] flex-col items-center justify-center">
        {/* Grey Bar */}
        <div className="mb-4 h-[8px] w-[84px] rounded-full bg-[#efefef]" />

        {/* Icon */}
        <div className="relative mb-4">
          <div className="h-[70px] w-[90px] rounded-xl bg-[#f0f0f0] opacity-70" />

          <div className="absolute inset-0 flex items-center justify-center">
            <SearchX size={48} strokeWidth={1.6} className="text-[#b8b8b8]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-semibold text-[#5d6f8d]">No Cashback Records Found</h3>

        {/* Subtitle */}
        <p className="mt-1 text-[12px] text-[#a2a9b8]">Play and earn cashback on your losses.</p>
      </div>
    </div>
  );
}
