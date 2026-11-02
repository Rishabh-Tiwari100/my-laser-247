export default function SummaryPanel() {
  return (
    <div className="border border-[#8ca1b4] bg-white">
      <div className="grid grid-cols-[350px_1fr]">
        {/* Left */}

        <div className="border-r border-[#d5d5d5] p-[10px]">
          <div className="text-[15px] font-bold text-[#27435a]">Your Balances</div>

          <div className="mt-[6px] flex items-end gap-2">
            <span className="text-[46px] font-bold leading-none text-[#2d7dc7]">49.30</span>

            <span className="mb-1 text-[20px] text-[#6b879f]">PBU</span>
          </div>
        </div>

        {/* Right */}

        <div className="p-[10px]">
          <div className="text-[16px] font-bold text-[#27435a]">Welcome,</div>

          <p className="mt-[4px] max-w-[640px] text-[14px] leading-[22px] text-[#22313f]">
            View your account details here. You can manage funds, review and change your settings
            and see the performance of your betting activity
          </p>
        </div>
      </div>
    </div>
  );
}
