export default function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-[#d7d7d7] bg-white px-3 py-2 text-[12px]">
      <span className="text-[#666]">Showing 1 to 10 of 10 entries</span>

      <div className="flex items-center gap-1">
        <button className="border border-[#bcbcbc] bg-[#efefef] px-2 py-1">Prev</button>

        <button className="border border-[#999] bg-[#d9d9d9] px-2 py-1 font-semibold">1</button>

        <button className="border border-[#bcbcbc] bg-[#efefef] px-2 py-1">Next</button>
      </div>
    </div>
  );
}
