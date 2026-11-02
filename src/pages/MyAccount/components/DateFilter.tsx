export default function DateFilter() {
  return (
    <div className="border border-[#8ca1b4] bg-[#dbe3e7] p-[10px]">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-6 text-[13px]">
          <span>Period</span>

          {/* From */}

          <div className="flex items-center gap-2">
            <input
              defaultValue="27-06-2026"
              className="h-[26px] w-[110px] border border-[#b7b7b7] bg-white px-2 text-[13px]"
            />

            <input
              defaultValue="09:00"
              className="h-[26px] w-[46px] border border-[#b7b7b7] bg-[#ececec] px-2 text-[12px] text-[#777]"
            />
          </div>

          <span>to</span>

          {/* To */}

          <div className="flex items-center gap-2">
            <input
              defaultValue="28-06-2026"
              className="h-[26px] w-[110px] border border-[#b7b7b7] bg-white px-2 text-[13px]"
            />

            <input
              defaultValue="08:59"
              className="h-[26px] w-[46px] border border-[#b7b7b7] bg-[#ececec] px-2 text-[12px] text-[#777]"
            />
          </div>
        </div>
      </div>

      <div className="mt-[10px] flex gap-[6px]">
        <button className="h-[28px] border border-[#b4b4b4] bg-white px-3 text-[13px] hover:bg-[#f4f4f4]">
          Just For Today
        </button>

        <button className="h-[28px] border border-[#b4b4b4] bg-white px-3 text-[13px] hover:bg-[#f4f4f4]">
          From Yesterday
        </button>

        <button className="h-[28px] border border-[#b97a00] bg-[#f5ad11] px-4 text-[13px] font-bold text-black hover:bg-[#ffb41d]">
          Get Statement
        </button>
      </div>
    </div>
  );
}
