import PrimaryButton from './PrimaryButton';

export default function BetFilters() {
  return (
    <div className="border border-[#8ea2b5] bg-white p-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block mb-1 text-[13px]">From</label>

          <input type="date" className="w-[170px] h-10 border rounded px-3" />
        </div>

        <div>
          <label className="block mb-1 text-[13px]">To</label>

          <input type="date" className="w-[170px] h-10 border rounded px-3" />
        </div>

        <div>
          <label className="block mb-1 text-[13px]">Sport</label>

          <select className="w-[170px] h-10 border rounded px-3">
            <option>All Sports</option>

            <option>Cricket</option>

            <option>Football</option>

            <option>Tennis</option>
          </select>
        </div>

        <PrimaryButton title="Search" />
      </div>
    </div>
  );
}
