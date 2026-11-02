import { useState } from 'react';
import ProductTabs from './ProductTabs';
import CurrentBetsTable from './CurrentBetsTable';

export default function CurrentBets() {
  const [tab, setTab] = useState<
    'all' | 'exchange' | 'fancy' | 'bookmaker' | 'sportsbook' | 'binary'
  >('all');

  return (
    <>
      <ProductTabs active={tab} onChange={setTab} />

      <div className="border border-[#9dadb7] border-t-0 bg-[#dfe6e8] px-3 py-3">
        <div className="flex flex-wrap items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <label>Bet Status</label>

            <select className="w-[120px] h-[28px] border border-[#b6b6b6] bg-white px-2">
              <option>All</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>Order By</span>

            <label className="flex items-center gap-1">
              <input type="checkbox" defaultChecked />
              Bet Placed
            </label>

            <label className="flex items-center gap-1">
              <input type="checkbox" />
              Market
            </label>
          </div>
        </div>
      </div>

      <CurrentBetsTable />
    </>
  );
}
