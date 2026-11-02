export default function HistoryFilter() {
  return (
    <div className="border border-[#9dadb7] border-t-0 bg-[#dfe6e8] px-3 py-3">
      <div className="flex items-center gap-2 flex-wrap text-[13px]">
        <span>Bet Status:</span>

        <select className="w-[120px] h-[28px] border border-[#b8b8b8] bg-white px-2">
          <option>Settled</option>
        </select>

        <span>Period</span>

        <input
          defaultValue="27-06-2026"
          className="w-[100px] h-[24px] rounded border border-[#b8b8b8] px-2"
        />

        <input
          defaultValue="09:00"
          className="w-[44px] h-[24px] rounded border border-[#b8b8b8] bg-[#efefef] px-1"
        />

        <span>to</span>

        <input
          defaultValue="28-06-2026"
          className="w-[100px] h-[24px] rounded border border-[#b8b8b8] px-2"
        />

        <input
          defaultValue="08:59"
          className="w-[44px] h-[24px] rounded border border-[#b8b8b8] bg-[#efefef] px-1"
        />
      </div>

      <div className="mt-[10px] flex items-center gap-[5px]">
        <button
          className="
      h-[24px]
      px-[10px]
      text-[12px]
      leading-none
      border
      border-[#b8b8b8]
      bg-white
      rounded-[2px]
      text-[#333]
    "
        >
          Just For Today
        </button>

        <button
          className="
      h-[24px]
      px-[10px]
      text-[12px]
      leading-none
      border
      border-[#b8b8b8]
      bg-white
      rounded-[2px]
      text-[#333]
    "
        >
          From Yesterday
        </button>

        <button
          className="
      h-[24px]
      px-[16px]
      text-[12px]
      leading-none
      font-bold
      border
      border-[#c88700]
      bg-[#f7a81a]
      rounded-[2px]
      text-[#222]
    "
        >
          Get History
        </button>
      </div>
    </div>
  );
}
