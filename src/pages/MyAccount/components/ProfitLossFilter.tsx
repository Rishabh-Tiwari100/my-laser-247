export default function ProfitLossFilter() {
  return (
    <div className="border border-[#9dadb7] border-t-0 bg-[#dfe6e8] px-3 py-3">
      <div className="flex items-center gap-2 flex-wrap text-[13px]">
        <span>Period</span>

        <input
          defaultValue="27-06-2026"
          className="h-[24px] w-[100px] rounded border border-[#b8b8b8] px-2"
        />

        <input
          defaultValue="09:00"
          className="h-[24px] w-[44px] rounded border border-[#b8b8b8] bg-[#efefef] px-1"
        />

        <span>to</span>

        <input
          defaultValue="28-06-2026"
          className="h-[24px] w-[100px] rounded border border-[#b8b8b8] px-2"
        />

        <input
          defaultValue="08:59"
          className="h-[24px] w-[44px] rounded border border-[#b8b8b8] bg-[#efefef] px-1"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button className="h-[28px] rounded border border-[#bdbdbd] bg-white px-3 text-[13px]">
          Just For Today
        </button>

        <button className="h-[28px] rounded border border-[#bdbdbd] bg-white px-3 text-[13px]">
          From Yesterday
        </button>

        <button className="h-[28px] min-w-[118px] rounded border border-[#d18a00] bg-[#f7a81a] px-4 text-[13px] font-bold">
          Get P &amp; L
        </button>
      </div>
    </div>
  );
}
