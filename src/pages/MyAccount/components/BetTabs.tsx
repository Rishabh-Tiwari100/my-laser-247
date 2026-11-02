import { useState } from 'react';

const tabs = ['Current Bets', 'Settled Bets', 'Unmatched Bets'];

export default function BetTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex border border-[#8ea2b5] bg-[#f5f5f5]">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setActive(index)}
          className={`px-5 py-2 text-[13px] border-r last:border-r-0 transition
          ${
            active === index
              ? 'bg-[#5f7387] text-white font-semibold'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
