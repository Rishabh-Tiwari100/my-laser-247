export default function FancyMarketHeader({ title = '' }: { title?: string }) {
  return (
    <div className="grid h-[29px] grid-cols-12 border-b border-[#7e97a7] bg-white text-[13px] font-bold text-black lg:grid-cols-[11fr_7fr]">
      <div className="col-span-7 flex items-center px-[5px] text-[12px] lg:col-span-1">{title}</div>
      <div className="col-span-5 grid grid-cols-2 lg:col-span-1 lg:grid-cols-4">
        <div className="flex items-center justify-center border-r border-white bg-[#faa9ba]">
          No
        </div>
        <div className="flex items-center justify-center border-r border-white bg-[#72bbef]">
          Yes
        </div>
        <div className="col-span-2 hidden items-center justify-center lg:flex">Min-Max</div>
      </div>
    </div>
  );
}
