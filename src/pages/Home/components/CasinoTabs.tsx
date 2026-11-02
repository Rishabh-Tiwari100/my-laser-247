import { casinoTabs } from '@/utils/constants/home';

export interface CasinoTab {
  type: string;
  title: string;
  value: string;
}

interface CasinoTabsProps {
  activeTab?: CasinoTab;
  onTabChange: (tab: CasinoTab) => void;
}

const CasinoTabs = ({ activeTab, onTabChange }: CasinoTabsProps) => {
  return (
    <div className="flex items-center bg-black p-[5px]">
      <ul className="flex w-full flex-nowrap gap-[5px] overflow-x-auto whitespace-nowrap scrollbar-hide">
        {casinoTabs.map((tab) => (
          <li key={tab?.title} className="flex-1">
            <button
              key={`${tab.type}-${tab.value}`}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`h-full w-full rounded text-xs font-bold uppercase px-[10px] py-[5px] transition-colors duration-200
                ${activeTab?.value === tab?.value
                  ? 'border border-[#19198f] bg-[#19198f] text-white'
                  : 'border border-[243a48] bg-[#243a48] text-white'
                }`}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CasinoTabs;